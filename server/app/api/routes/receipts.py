from fastapi import APIRouter, Depends, HTTPException, status, Body, UploadFile, File, Form
from typing import List, Optional, Any
from app.models.receipt import ReceiptCreate, ReceiptUpdate, ReceiptStatusUpdate, ReceiptResponse, ReceiptStats
from app.models.user import UserPublic
from app.api.deps import get_current_user
from app.core.database import get_database
from bson import ObjectId
from datetime import datetime
import os
import shutil
import uuid

router = APIRouter()

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_receipt(
    companyName: str = Form(...),
    folioNumber: str = Form(...),
    date: str = Form(...),
    description: str = Form(...),
    totalAmount: float = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: UserPublic = Depends(get_current_user)
) -> Any:
    """
    Create new receipt
    """
    db = get_database()
    
    # Handle image upload if present
    image_url = None
    if image:
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Generate unique filename for the image
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join("uploads", unique_filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Set image URL for database
        image_url = f"/uploads/{unique_filename}"
    
    # Create receipt document
    receipt_data = {
        "user": ObjectId(current_user.id),
        "companyName": companyName,
        "folioNumber": folioNumber,
        "date": datetime.fromisoformat(date.replace('Z', '+00:00')),
        "description": description,
        "totalAmount": totalAmount,
        "imageUrl": image_url,
        "status": "en_revision",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    # Insert receipt into database
    result = await db.receipts.insert_one(receipt_data)
    receipt_id = result.inserted_id
    
    # Get created receipt
    created_receipt = await db.receipts.find_one({"_id": receipt_id})
    
    # Format response
    created_receipt["id"] = str(created_receipt["_id"])
    created_receipt["user"] = str(created_receipt["user"])
    
    return {
        "success": True,
        "data": created_receipt
    }

@router.get("/", response_model=dict)
async def get_receipts(current_user: UserPublic = Depends(get_current_user)) -> Any:
    """
    Get all receipts for current user
    """
    db = get_database()
    
    # Find all receipts for the current user
    cursor = db.receipts.find({"user": ObjectId(current_user.id)})
    receipts = await cursor.to_list(length=100)  # Limit to 100 receipts
    
    # Format response
    formatted_receipts = []
    for receipt in receipts:
        receipt["id"] = str(receipt["_id"])
        receipt["user"] = str(receipt["user"])
        formatted_receipts.append(receipt)
    
    return {
        "success": True,
        "count": len(formatted_receipts),
        "data": formatted_receipts
    }

@router.get("/stats", response_model=dict)
async def get_receipt_stats(current_user: UserPublic = Depends(get_current_user)) -> Any:
    """
    Get receipt statistics for current user
    """
    db = get_database()
    
    # Count total receipts
    total_receipts = await db.receipts.count_documents({"user": ObjectId(current_user.id)})
    
    # Count receipts by status
    en_revision = await db.receipts.count_documents({
        "user": ObjectId(current_user.id),
        "status": "en_revision"
    })
    
    aceptadas = await db.receipts.count_documents({
        "user": ObjectId(current_user.id),
        "status": "aceptada"
    })
    
    rechazadas = await db.receipts.count_documents({
        "user": ObjectId(current_user.id),
        "status": "rechazada"
    })
    
    # Calculate total amount for accepted receipts
    pipeline = [
        {"$match": {"user": ObjectId(current_user.id), "status": "aceptada"}},
        {"$group": {"_id": None, "total": {"$sum": "$totalAmount"}}}
    ]
    
    result = await db.receipts.aggregate(pipeline).to_list(length=1)
    total_amount = result[0]["total"] if result else 0
    
    return {
        "success": True,
        "data": {
            "totalReceipts": total_receipts,
            "enRevision": en_revision,
            "aceptadas": aceptadas,
            "rechazadas": rechazadas,
            "totalAmount": total_amount
        }
    }

@router.get("/{receipt_id}", response_model=dict)
async def get_receipt_by_id(
    receipt_id: str,
    current_user: UserPublic = Depends(get_current_user)
) -> Any:
    """
    Get receipt by ID
    """
    db = get_database()
    
    # Find receipt by ID
    receipt = await db.receipts.find_one({
        "_id": ObjectId(receipt_id),
        "user": ObjectId(current_user.id)
    })
    
    if not receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found"
        )
    
    # Format response
    receipt["id"] = str(receipt["_id"])
    receipt["user"] = str(receipt["user"])
    
    return {
        "success": True,
        "data": receipt
    }

@router.put("/{receipt_id}", response_model=dict)
async def update_receipt(
    receipt_id: str,
    companyName: Optional[str] = Form(None),
    folioNumber: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    totalAmount: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: UserPublic = Depends(get_current_user)
) -> Any:
    """
    Update receipt by ID
    """
    db = get_database()
    
    # Find receipt by ID and verify ownership
    receipt = await db.receipts.find_one({
        "_id": ObjectId(receipt_id),
        "user": ObjectId(current_user.id)
    })
    
    if not receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found"
        )
    
    # Prepare update data
    update_data = {}
    
    if companyName is not None:
        update_data["companyName"] = companyName
    
    if folioNumber is not None:
        update_data["folioNumber"] = folioNumber
    
    if date is not None:
        update_data["date"] = datetime.fromisoformat(date.replace('Z', '+00:00'))
    
    if description is not None:
        update_data["description"] = description
    
    if totalAmount is not None:
        update_data["totalAmount"] = totalAmount
    
    # Handle image upload if present
    if image:
        # Delete old image if exists
        if receipt.get("imageUrl"):
            old_image_path = os.path.join(os.getcwd(), receipt["imageUrl"].lstrip("/"))
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
        
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Generate unique filename for the image
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join("uploads", unique_filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Set image URL for database
        update_data["imageUrl"] = f"/uploads/{unique_filename}"
    
    # Always update the updatedAt field
    update_data["updatedAt"] = datetime.utcnow()
    
    # Update receipt in database
    if update_data:
        await db.receipts.update_one(
            {"_id": ObjectId(receipt_id)},
            {"$set": update_data}
        )
    
    # Get updated receipt
    updated_receipt = await db.receipts.find_one({"_id": ObjectId(receipt_id)})
    
    # Format response
    updated_receipt["id"] = str(updated_receipt["_id"])
    updated_receipt["user"] = str(updated_receipt["user"])
    
    return {
        "success": True,
        "data": updated_receipt
    }

@router.patch("/{receipt_id}/status", response_model=dict)
async def update_receipt_status(
    receipt_id: str,
    status_data: ReceiptStatusUpdate = Body(...),
    current_user: UserPublic = Depends(get_current_user)
) -> Any:
    """
    Update receipt status
    """
    db = get_database()
    
    # Find receipt by ID and verify ownership
    receipt = await db.receipts.find_one({
        "_id": ObjectId(receipt_id),
        "user": ObjectId(current_user.id)
    })
    
    if not receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found"
        )
    
    # Update status and updatedAt field
    await db.receipts.update_one(
        {"_id": ObjectId(receipt_id)},
        {"$set": {
            "status": status_data.status,
            "updatedAt": datetime.utcnow()
        }}
    )
    
    # Get updated receipt
    updated_receipt = await db.receipts.find_one({"_id": ObjectId(receipt_id)})
    
    # Format response
    updated_receipt["id"] = str(updated_receipt["_id"])
    updated_receipt["user"] = str(updated_receipt["user"])
    
    return {
        "success": True,
        "data": updated_receipt
    }

@router.delete("/{receipt_id}", response_model=dict)
async def delete_receipt(
    receipt_id: str,
    current_user: UserPublic = Depends(get_current_user)
) -> Any:
    """
    Delete receipt by ID
    """
    db = get_database()
    
    # Find receipt by ID and verify ownership
    receipt = await db.receipts.find_one({
        "_id": ObjectId(receipt_id),
        "user": ObjectId(current_user.id)
    })
    
    if not receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found"
        )
    
    # Delete image if exists
    if receipt.get("imageUrl"):
        image_path = os.path.join(os.getcwd(), receipt["imageUrl"].lstrip("/"))
        if os.path.exists(image_path):
            os.remove(image_path)
    
    # Delete receipt from database
    await db.receipts.delete_one({"_id": ObjectId(receipt_id)})
    
    return {
        "success": True,
        "message": "Receipt deleted successfully"
    }