from typing import Optional, Annotated, Any, List
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, BeforeValidator
from app.models.user import PyObjectId, UserPublic

# Estados posibles de una solicitud
class RequestStatus:
    DRAFT = "draft"            # Borrador (no enviado)
    IN_PROCESS = "in_process"  # En proceso (enviado pero no revisado)
    IN_REVIEW = "in_review"    # En revisión por un administrador
    APPROVED = "approved"      # Aprobado
    REJECTED = "rejected"      # Rechazado
    
    @classmethod
    def all_statuses(cls):
        return [cls.DRAFT, cls.IN_PROCESS, cls.IN_REVIEW, cls.APPROVED, cls.REJECTED]
    
    @classmethod
    def status_labels(cls):
        return {
            cls.DRAFT: "Borrador",
            cls.IN_PROCESS: "En proceso",
            cls.IN_REVIEW: "En revisión",
            cls.APPROVED: "Aprobado",
            cls.REJECTED: "Rechazado"
        }

# Modelo para comentarios en una solicitud
class RequestComment(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    userId: PyObjectId
    content: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    }

# Modelo para archivos adjuntos
class RequestFile(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    userId: PyObjectId
    filename: str
    filePath: str
    fileSize: int
    fileType: str
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    }

# Modelo para el historial de cambios de estado
class StatusChange(BaseModel):
    fromStatus: str
    toStatus: str
    changedBy: PyObjectId
    changedAt: datetime = Field(default_factory=datetime.utcnow)
    reason: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    }

# Modelo principal para solicitudes
class Request(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: str
    description: str
    status: str = Field(default=RequestStatus.DRAFT)
    clientId: PyObjectId  # ID del cliente que crea la solicitud
    assignedTo: Optional[PyObjectId] = None  # ID del admin asignado (opcional)
    amount: Optional[float] = None  # Monto asociado a la solicitud
    dueDate: Optional[datetime] = None  # Fecha límite (opcional)
    tags: List[str] = []  # Etiquetas para categorizar
    comments: List[RequestComment] = []  # Comentarios
    files: List[RequestFile] = []  # Archivos adjuntos
    statusHistory: List[StatusChange] = []  # Historial de cambios de estado
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        },
        "json_schema_extra": {
            "example": {
                "title": "Solicitud de reembolso de viáticos",
                "description": "Reembolso por gastos de viaje a Santiago para reunión con cliente",
                "status": "in_process",
                "clientId": "507f1f77bcf86cd799439011",
                "amount": 125000.50,
                "tags": ["viáticos", "reembolso", "viaje"]
            }
        }
    }

# Modelo para crear una nueva solicitud
class RequestCreate(BaseModel):
    title: str
    description: str
    amount: Optional[float] = None
    dueDate: Optional[datetime] = None
    tags: List[str] = []
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Solicitud de reembolso de viáticos",
                "description": "Reembolso por gastos de viaje a Santiago para reunión con cliente",
                "amount": 125000.50,
                "tags": ["viáticos", "reembolso", "viaje"]
            }
        }
    }

# Modelo para actualizar una solicitud existente
class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignedTo: Optional[str] = None
    amount: Optional[float] = None
    dueDate: Optional[datetime] = None
    tags: Optional[List[str]] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Solicitud actualizada",
                "status": "in_review"
            }
        }
    }

# Modelo para cambiar el estado de una solicitud
class StatusChangeRequest(BaseModel):
    status: str
    reason: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "approved",
                "reason": "Todos los documentos están en orden"
            }
        }
    }

# Modelo para añadir un comentario
class CommentCreate(BaseModel):
    content: str
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "content": "Por favor adjunta las facturas correspondientes"
            }
        }
    }

# Modelo para respuestas con solicitudes
class RequestResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str
    statusLabel: str
    clientId: str
    client: Optional[UserPublic] = None
    assignedTo: Optional[str] = None
    assignedAdmin: Optional[UserPublic] = None
    amount: Optional[float] = None
    dueDate: Optional[datetime] = None
    tags: List[str] = []
    commentsCount: int
    filesCount: int
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Solicitud de reembolso de viáticos",
                "description": "Reembolso por gastos de viaje a Santiago para reunión con cliente",
                "status": "in_process",
                "statusLabel": "En proceso",
                "clientId": "507f1f77bcf86cd799439022",
                "amount": 125000.50,
                "commentsCount": 2,
                "filesCount": 1,
                "tags": ["viáticos", "reembolso", "viaje"],
                "createdAt": "2023-08-28T12:34:56.789000"
            }
        }
    }