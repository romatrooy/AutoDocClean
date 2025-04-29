from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class TemplateBase(BaseModel):
    filename: str
    file_path: str
    content_type: str
    is_template: bool = False
    variables: List[str] = []

class TemplateCreate(TemplateBase):
    user_id: int

class TemplateUpdate(TemplateBase):
    filename: Optional[str] = None
    file_path: Optional[str] = None
    content_type: Optional[str] = None
    is_template: Optional[bool] = None
    variables: Optional[List[str]] = None

class Template(TemplateBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
