from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from typing import Dict, Any
from app.core.google_config import google_settings

class GoogleDocsService:
    def __init__(self, access_token: str, refresh_token: str = None):
        self.credentials = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri=google_settings.GOOGLE_TOKEN_URI,
            client_id=google_settings.GOOGLE_CLIENT_ID,
            client_secret=google_settings.GOOGLE_CLIENT_SECRET,
            scopes=google_settings.GOOGLE_SCOPES
        )
        self.docs_service = build('docs', 'v1', credentials=self.credentials)
        self.drive_service = build('drive', 'v3', credentials=self.credentials)

    async def create_document(self, title: str, content: str = None) -> Dict[str, Any]:
        """
        Создает документ Google Docs и опционально заполняет его содержимым
        """
        # Создаем пустой документ
        document = self.docs_service.documents().create(
            body={'title': title}
        ).execute()
        
        document_id = document['documentId']
        
        # Если передан контент, заполняем документ
        if content:
            requests = [{
                'insertText': {
                    'location': {
                        'index': 1
                    },
                    'text': content
                }
            }]
            
            self.docs_service.documents().batchUpdate(
                documentId=document_id,
                body={'requests': requests}
            ).execute()
        
        # Устанавливаем доступ для чтения всем, у кого есть ссылка
        self.drive_service.permissions().create(
            fileId=document_id,
            body={
                'role': 'reader',
                'type': 'anyone'
            }
        ).execute()
        
        # Получаем информацию о файле, включая URL
        file_info = self.drive_service.files().get(
            fileId=document_id,
            fields='id, name, webViewLink'
        ).execute()
        
        # Добавляем URL для открытия документа
        return {
            'documentId': document_id,
            'title': title,
            'url': file_info.get('webViewLink') or f"https://docs.google.com/document/d/{document_id}/edit"
        }

    async def update_document(self, document_id: str, content: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Обновляет документ Google Docs
        """
        if isinstance(content, dict) and 'content' in content:
            # Если передан словарь с ключом 'content', используем его значение
            text_content = content['content']
            requests = [{
                'insertText': {
                    'location': {
                        'index': 1
                    },
                    'text': text_content
                }
            }]
        elif isinstance(content, str):
            # Если передана строка, используем ее как контент
            requests = [{
                'insertText': {
                    'location': {
                        'index': 1
                    },
                    'text': content
                }
            }]
        else:
            # Если передан какой-то другой формат, используем пустой список запросов
            requests = []
        
        result = self.docs_service.documents().batchUpdate(
            documentId=document_id,
            body={'requests': requests}
        ).execute()
        return result

    async def save_to_drive(self, document_id: str, folder_id: str = None) -> Dict[str, Any]:
        file_metadata = {}
        if folder_id:
            file_metadata['parents'] = [folder_id]
        
        file = self.drive_service.files().get(
            fileId=document_id,
            fields='id, name, webViewLink'
        ).execute()
        return file

    def _prepare_update_requests(self, content: Dict[str, Any]) -> list:
        # Преобразуем контент в запросы для API Google Docs
        requests = []
        # Здесь будет логика формирования запросов для обновления документа
        return requests
