from sqlalchemy.orm import Session
from fastapi import UploadFile
import os
from datetime import datetime
from typing import List, Optional
from app.crud.base import CRUDBase

from app.models.template import Template
from app.schemas.template import TemplateCreate, TemplateUpdate
from app.utils.document_parser import extract_variables

def get_template(db: Session, template_id: int):
    return db.query(Template).filter(Template.id == template_id).first()

async def create_template(db: Session, file: UploadFile, user_id: int) -> Template:
    # Создаем директорию для файлов, если её нет
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Генерируем уникальное имя файла
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"{upload_dir}/{timestamp}_{file.filename}"
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Создаем запись в БД
    db_template = Template(
        filename=file.filename,
        file_path=file_path,
        content_type=file.content_type,
        user_id=user_id
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def get_templates(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Template)\
        .filter(Template.user_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def delete_template(db: Session, template_id: int):
    template = get_template(db, template_id)
    if template and os.path.exists(template.file_path):
        os.remove(template.file_path)
    db.delete(template)
    db.commit()
    return template

class CRUDTemplate(CRUDBase[Template, TemplateCreate, TemplateUpdate]):
    def create_with_variables(self, db: Session, *, obj_in: TemplateCreate, file_path: str) -> Template:
        # Извлекаем переменные из документа
        variables_info = extract_variables(file_path)
        
        # Создаем объект с информацией о переменных
        db_obj = Template(
            filename=obj_in.filename,
            file_path=obj_in.file_path,
            content_type=obj_in.content_type,
            user_id=obj_in.user_id,
            is_template=variables_info["is_template"],
            variables=variables_info["variables"]
        )
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Template]:
        return (
            db.query(self.model)
            .filter(Template.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def remove(self, db: Session, *, id: int) -> Template:
        obj = db.query(self.model).get(id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

template = CRUDTemplate(Template)
