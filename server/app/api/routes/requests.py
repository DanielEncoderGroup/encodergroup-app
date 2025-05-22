from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Body, Query, Path
from bson import ObjectId

from app.models.user import UserPublic, UserRole
from app.models.request import (
    Request, 
    RequestCreate, 
    RequestUpdate, 
    StatusChangeRequest,
    CommentCreate,
    RequestStatus,
    RequestResponse,
    StatusChange,
    RequestComment
)
from app.core.database import get_database
from app.api.deps import get_current_user, get_admin_user, get_client_user, get_any_user

router = APIRouter()

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_request(
    request_in: RequestCreate,
    current_user: UserPublic = Depends(get_client_user)
) -> Any:
    """
    Crear una nueva solicitud (solo clientes).
    """
    db = get_database()
    
    # Crear la solicitud con los datos proporcionados
    request_data = request_in.model_dump()
    request_data.update({
        "clientId": ObjectId(current_user.id),
        "status": RequestStatus.DRAFT,
        "comments": [],
        "files": [],
        "statusHistory": [{
            "fromStatus": None,
            "toStatus": RequestStatus.DRAFT,
            "changedBy": ObjectId(current_user.id),
            "changedAt": datetime.utcnow(),
            "reason": "Creación de la solicitud"
        }],
        "createdAt": datetime.utcnow(),
        "updatedAt": None
    })
    
    result = await db.requests.insert_one(request_data)
    created_request = await db.requests.find_one({"_id": result.inserted_id})
    
    if created_request is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear la solicitud"
        )
    
    return {
        "success": True,
        "message": "Solicitud creada correctamente",
        "requestId": str(created_request["_id"])
    }

@router.get("/", response_model=dict)
async def get_requests(
    status: Optional[str] = Query(None, description="Filtrar por estado"),
    client_id: Optional[str] = Query(None, description="Filtrar por cliente (solo para administradores)"),
    search: Optional[str] = Query(None, description="Buscar en título o descripción"),
    skip: int = Query(0, ge=0, description="Número de elementos a omitir"),
    limit: int = Query(10, ge=1, le=100, description="Número máximo de elementos a devolver"),
    current_user: UserPublic = Depends(get_any_user)
) -> dict:
    """
    Obtener lista de solicitudes según los filtros.
    Los administradores pueden ver todas las solicitudes.
    Los clientes solo pueden ver sus propias solicitudes.
    """
    db = get_database()
    
    # Construir la consulta según los filtros
    query = {}
    
    # Filtrar por estado si se proporciona
    if status and status in RequestStatus.all_statuses():
        query["status"] = status
    
    # Filtrar por cliente
    if current_user.role == UserRole.CLIENT:
        # Los clientes solo pueden ver sus propias solicitudes
        query["clientId"] = ObjectId(current_user.id)
    elif current_user.role == UserRole.ADMIN and client_id:
        # Los administradores pueden filtrar por cliente
        query["clientId"] = ObjectId(client_id)
    
    # Buscar en título o descripción
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Obtener el total de elementos que coinciden con la consulta
    total = await db.requests.count_documents(query)
    
    # Obtener las solicitudes paginadas
    cursor = db.requests.find(query).sort("createdAt", -1).skip(skip).limit(limit)
    requests_list = []
    
    async for request in cursor:
        # Obtener información del cliente
        client = await db.users.find_one({"_id": request["clientId"]})
        client_data = None
        if client:
            client_data = {
                "id": str(client["_id"]),
                "firstName": client["firstName"],
                "lastName": client["lastName"],
                "email": client["email"],
                "role": client.get("role", UserRole.CLIENT)
            }
        
        # Obtener información del administrador asignado si existe
        admin_data = None
        if request.get("assignedTo"):
            admin = await db.users.find_one({"_id": request["assignedTo"]})
            if admin:
                admin_data = {
                    "id": str(admin["_id"]),
                    "firstName": admin["firstName"],
                    "lastName": admin["lastName"],
                    "email": admin["email"],
                    "role": admin.get("role", UserRole.ADMIN)
                }
        
        # Preparar respuesta
        request_response = {
            "id": str(request["_id"]),
            "title": request["title"],
            "description": request["description"],
            "status": request["status"],
            "statusLabel": RequestStatus.status_labels().get(request["status"], request["status"]),
            "clientId": str(request["clientId"]),
            "client": client_data,
            "assignedTo": str(request["assignedTo"]) if request.get("assignedTo") else None,
            "assignedAdmin": admin_data,
            "amount": request.get("amount"),
            "dueDate": request.get("dueDate"),
            "tags": request.get("tags", []),
            "commentsCount": len(request.get("comments", [])),
            "filesCount": len(request.get("files", [])),
            "createdAt": request["createdAt"],
            "updatedAt": request.get("updatedAt")
        }
        
        requests_list.append(request_response)
    
    return {
        "success": True,
        "total": total,
        "skip": skip,
        "limit": limit,
        "requests": requests_list
    }

@router.get("/{request_id}", response_model=dict)
async def get_request(
    request_id: str = Path(..., description="ID de la solicitud"),
    current_user: UserPublic = Depends(get_any_user)
) -> dict:
    """
    Obtener una solicitud específica por su ID.
    Los administradores pueden ver cualquier solicitud.
    Los clientes solo pueden ver sus propias solicitudes.
    """
    db = get_database()
    
    try:
        request = await db.requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de solicitud inválido"
        )
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Verificar permisos
    if current_user.role == UserRole.CLIENT and str(request["clientId"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver esta solicitud"
        )
    
    # Obtener información del cliente
    client = await db.users.find_one({"_id": request["clientId"]})
    client_data = None
    if client:
        client_data = {
            "id": str(client["_id"]),
            "firstName": client["firstName"],
            "lastName": client["lastName"],
            "email": client["email"],
            "role": client.get("role", UserRole.CLIENT)
        }
    
    # Obtener información del administrador asignado si existe
    admin_data = None
    if request.get("assignedTo"):
        admin = await db.users.find_one({"_id": request["assignedTo"]})
        if admin:
            admin_data = {
                "id": str(admin["_id"]),
                "firstName": admin["firstName"],
                "lastName": admin["lastName"],
                "email": admin["email"],
                "role": admin.get("role", UserRole.ADMIN)
            }
    
    # Preparar comentarios con información de usuario
    comments = []
    for comment in request.get("comments", []):
        user = await db.users.find_one({"_id": comment["userId"]})
        user_data = None
        if user:
            user_data = {
                "id": str(user["_id"]),
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "email": user["email"],
                "role": user.get("role", UserRole.CLIENT)
            }
        
        comments.append({
            "id": str(comment.get("_id", "")),
            "content": comment["content"],
            "createdAt": comment["createdAt"],
            "user": user_data
        })
    
    # Preparar historial de estados con información de usuario
    status_history = []
    for status_change in request.get("statusHistory", []):
        user = await db.users.find_one({"_id": status_change["changedBy"]})
        user_data = None
        if user:
            user_data = {
                "id": str(user["_id"]),
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "role": user.get("role", UserRole.CLIENT)
            }
        
        status_history.append({
            "fromStatus": status_change["fromStatus"],
            "fromStatusLabel": RequestStatus.status_labels().get(status_change["fromStatus"], status_change["fromStatus"]) if status_change["fromStatus"] else None,
            "toStatus": status_change["toStatus"],
            "toStatusLabel": RequestStatus.status_labels().get(status_change["toStatus"], status_change["toStatus"]),
            "changedAt": status_change["changedAt"],
            "reason": status_change.get("reason"),
            "changedBy": user_data
        })
    
    # Preparar archivos con información de usuario
    files = []
    for file in request.get("files", []):
        user = await db.users.find_one({"_id": file["userId"]})
        user_data = None
        if user:
            user_data = {
                "id": str(user["_id"]),
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "role": user.get("role", UserRole.CLIENT)
            }
        
        files.append({
            "id": str(file.get("_id", "")),
            "filename": file["filename"],
            "fileSize": file["fileSize"],
            "fileType": file["fileType"],
            "uploadedAt": file["uploadedAt"],
            "user": user_data
        })
    
    # Preparar respuesta detallada
    response = {
        "id": str(request["_id"]),
        "title": request["title"],
        "description": request["description"],
        "status": request["status"],
        "statusLabel": RequestStatus.status_labels().get(request["status"], request["status"]),
        "clientId": str(request["clientId"]),
        "client": client_data,
        "assignedTo": str(request["assignedTo"]) if request.get("assignedTo") else None,
        "assignedAdmin": admin_data,
        "amount": request.get("amount"),
        "dueDate": request.get("dueDate"),
        "tags": request.get("tags", []),
        "comments": comments,
        "files": files,
        "statusHistory": status_history,
        "createdAt": request["createdAt"],
        "updatedAt": request.get("updatedAt")
    }
    
    return {
        "success": True,
        "request": response
    }

@router.put("/{request_id}", response_model=dict)
async def update_request(
    request_id: str = Path(..., description="ID de la solicitud"),
    request_update: RequestUpdate = Body(...),
    current_user: UserPublic = Depends(get_any_user)
) -> dict:
    """
    Actualizar una solicitud existente.
    Los clientes solo pueden actualizar sus propias solicitudes y solo ciertos campos.
    Los administradores pueden actualizar cualquier solicitud y todos los campos.
    """
    db = get_database()
    
    try:
        request = await db.requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de solicitud inválido"
        )
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Verificar permisos
    if current_user.role == UserRole.CLIENT:
        # Los clientes solo pueden actualizar sus propias solicitudes
        if str(request["clientId"]) != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para actualizar esta solicitud"
            )
        
        # Los clientes solo pueden actualizar solicitudes en estado DRAFT
        if request["status"] != RequestStatus.DRAFT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo puedes modificar solicitudes en estado de borrador"
            )
        
        # Los clientes no pueden cambiar ciertos campos
        if request_update.status or request_update.assignedTo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para modificar estos campos"
            )
    
    # Preparar datos para actualizar
    update_data = {}
    update_fields = request_update.model_dump(exclude_unset=True)
    
    for field, value in update_fields.items():
        if value is not None:
            # Manejar campos especiales
            if field == "assignedTo" and value:
                try:
                    # Verificar que el usuario asignado exista y sea admin
                    admin = await db.users.find_one({"_id": ObjectId(value), "role": UserRole.ADMIN})
                    if not admin:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="El usuario asignado debe ser un administrador válido"
                        )
                    update_data[field] = ObjectId(value)
                except:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="ID de administrador inválido"
                    )
            elif field == "status":
                # Verificar que el estado sea válido
                if value not in RequestStatus.all_statuses():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Estado no válido"
                    )
                
                # Registrar cambio de estado en el historial
                status_change = {
                    "fromStatus": request["status"],
                    "toStatus": value,
                    "changedBy": ObjectId(current_user.id),
                    "changedAt": datetime.utcnow(),
                    "reason": "Actualización de solicitud"
                }
                
                update_data[field] = value
                update_data["$push"] = {"statusHistory": status_change}
            else:
                update_data[field] = value
    
    # Actualizar timestamp
    update_data["updatedAt"] = datetime.utcnow()
    
    # Actualizar la solicitud
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": update_data}
    )
    
    return {
        "success": True,
        "message": "Solicitud actualizada correctamente"
    }

@router.patch("/{request_id}/status", response_model=dict)
async def change_request_status(
    request_id: str = Path(..., description="ID de la solicitud"),
    status_change: StatusChangeRequest = Body(...),
    current_user: UserPublic = Depends(get_admin_user)
) -> dict:
    """
    Cambiar el estado de una solicitud (solo administradores).
    """
    db = get_database()
    
    try:
        request = await db.requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de solicitud inválido"
        )
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Verificar que el estado sea válido
    if status_change.status not in RequestStatus.all_statuses():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado no válido"
        )
    
    # No permitir cambiar a un estado igual al actual
    if request["status"] == status_change.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La solicitud ya está en estado {status_change.status}"
        )
    
    # Registrar cambio de estado en el historial
    status_history_entry = {
        "fromStatus": request["status"],
        "toStatus": status_change.status,
        "changedBy": ObjectId(current_user.id),
        "changedAt": datetime.utcnow(),
        "reason": status_change.reason
    }
    
    # Actualizar la solicitud
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": status_change.status,
                "updatedAt": datetime.utcnow()
            },
            "$push": {
                "statusHistory": status_history_entry
            }
        }
    )
    
    return {
        "success": True,
        "message": f"Estado de la solicitud actualizado a {status_change.status}"
    }

@router.post("/{request_id}/comments", response_model=dict)
async def add_comment(
    request_id: str = Path(..., description="ID de la solicitud"),
    comment: CommentCreate = Body(...),
    current_user: UserPublic = Depends(get_any_user)
) -> dict:
    """
    Añadir un comentario a una solicitud.
    Tanto clientes como administradores pueden añadir comentarios.
    """
    db = get_database()
    
    try:
        request = await db.requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de solicitud inválido"
        )
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Si es cliente, verificar que sea su solicitud
    if current_user.role == UserRole.CLIENT and str(request["clientId"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para comentar en esta solicitud"
        )
    
    # Crear el comentario
    new_comment = {
        "_id": ObjectId(),
        "userId": ObjectId(current_user.id),
        "content": comment.content,
        "createdAt": datetime.utcnow()
    }
    
    # Añadir el comentario a la solicitud
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$push": {"comments": new_comment},
            "$set": {"updatedAt": datetime.utcnow()}
        }
    )
    
    # Obtener información del usuario para la respuesta
    user_data = {
        "id": current_user.id,
        "firstName": current_user.firstName,
        "lastName": current_user.lastName,
        "role": current_user.role
    }
    
    return {
        "success": True,
        "message": "Comentario añadido correctamente",
        "comment": {
            "id": str(new_comment["_id"]),
            "content": new_comment["content"],
            "createdAt": new_comment["createdAt"],
            "user": user_data
        }
    }

@router.delete("/{request_id}", response_model=dict)
async def delete_request(
    request_id: str = Path(..., description="ID de la solicitud"),
    current_user: UserPublic = Depends(get_any_user)
) -> dict:
    """
    Eliminar una solicitud.
    Los clientes solo pueden eliminar sus propias solicitudes en estado DRAFT.
    Los administradores pueden eliminar cualquier solicitud.
    """
    db = get_database()
    
    try:
        request = await db.requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de solicitud inválido"
        )
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Verificar permisos
    if current_user.role == UserRole.CLIENT:
        # Los clientes solo pueden eliminar sus propias solicitudes
        if str(request["clientId"]) != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para eliminar esta solicitud"
            )
        
        # Los clientes solo pueden eliminar solicitudes en estado DRAFT
        if request["status"] != RequestStatus.DRAFT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo puedes eliminar solicitudes en estado de borrador"
            )
    
    # Eliminar la solicitud
    await db.requests.delete_one({"_id": ObjectId(request_id)})
    
    return {
        "success": True,
        "message": "Solicitud eliminada correctamente"
    }

@router.post("/{request_id}/submit", response_model=dict)
async def submit_request(
    request_id: str = Path(..., description="ID de la solicitud"),
    current_user: UserPublic = Depends(get_client_user)
) -> dict:
    """
    Enviar una solicitud para revisión (solo clientes).
    Cambia el estado de DRAFT a IN_PROCESS.
    """
    db = get_database()
    
    try:
        request = await db.requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de solicitud inválido"
        )
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Verificar que sea la solicitud del cliente
    if str(request["clientId"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para enviar esta solicitud"
        )
    
    # Verificar que esté en estado DRAFT
    if request["status"] != RequestStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo puedes enviar solicitudes en estado de borrador"
        )
    
    # Registrar cambio de estado en el historial
    status_history_entry = {
        "fromStatus": RequestStatus.DRAFT,
        "toStatus": RequestStatus.IN_PROCESS,
        "changedBy": ObjectId(current_user.id),
        "changedAt": datetime.utcnow(),
        "reason": "Solicitud enviada para revisión"
    }
    
    # Actualizar la solicitud
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": RequestStatus.IN_PROCESS,
                "updatedAt": datetime.utcnow()
            },
            "$push": {
                "statusHistory": status_history_entry
            }
        }
    )
    
    return {
        "success": True,
        "message": "Solicitud enviada correctamente para revisión"
    }