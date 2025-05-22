#!/usr/bin/env python3
"""
Script de migración para marcar como verificados los correos de usuarios existentes.

Este script debe ejecutarse una sola vez después de implementar la funcionalidad
de verificación de correo electrónico para asegurar que los usuarios existentes
puedan seguir usando la aplicación sin interrupciones.
"""

import sys
import os
import asyncio
from datetime import datetime

# Agregar directorio parent al path para importar módulos del proyecto
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importar módulos del proyecto
from app.core.database import get_database, connect_to_mongo, close_mongo_connection
from app.core.config import settings
from motor.motor_asyncio import AsyncIOMotorClient

async def migrate_existing_users():
    """
    Marca como verificados los correos electrónicos de todos los usuarios existentes.
    
    - Busca usuarios que no tienen el campo emailVerified
    - Busca usuarios que tienen emailVerified = False
    - Actualiza ambos grupos para tener emailVerified = True
    """
    print("Iniciando migración de verificación de correos para usuarios existentes...")
    
    try:
        # Conectar a la base de datos primero
        await connect_to_mongo()
        db = get_database()
        
        # Verificar que la conexión fue exitosa
        if db is None:
            raise Exception("No se pudo conectar a la base de datos. Verifica la configuración de MongoDB.")
        
        # Contar usuarios antes de la migración
        total_users = await db.users.count_documents({})
        unverified_users = await db.users.count_documents({
            "$or": [
                {"emailVerified": {"$exists": False}},
                {"emailVerified": False}
            ]
        })
        
        print(f"Total de usuarios en la base de datos: {total_users}")
        print(f"Usuarios sin verificación de correo: {unverified_users}")
        
        if unverified_users == 0:
            print("No hay usuarios que necesiten migración. Todos los usuarios ya están verificados.")
            return
        
        # Actualizar usuarios
        result = await db.users.update_many(
            {"$or": [
                {"emailVerified": {"$exists": False}},
                {"emailVerified": False}
            ]},
            {"$set": {
                "emailVerified": True,
                "migratedAt": datetime.utcnow()
            }}
        )
        
        print(f"Migración completada exitosamente:")
        print(f"- Usuarios actualizados: {result.modified_count}")
        print(f"- Usuarios encontrados: {result.matched_count}")
        
        # Verificar resultado
        still_unverified = await db.users.count_documents({
            "$or": [
                {"emailVerified": {"$exists": False}},
                {"emailVerified": False}
            ]
        })
        
        if still_unverified > 0:
            print(f"ADVERTENCIA: Aún hay {still_unverified} usuarios sin verificar.")
        else:
            print("Todos los usuarios ahora están marcados como verificados.")
        
    except Exception as e:
        print(f"Error durante la migración: {str(e)}")
        raise e

async def main():
    try:
        print(f"Conectando a la base de datos MongoDB en: {settings.MONGO_URI}")
        await migrate_existing_users()
    finally:
        # Asegurarse de cerrar la conexión a la base de datos
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(main())
    print("Proceso de migración finalizado.")