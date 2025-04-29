import re

class TemplateParser:
    def __init__(self):
        self.pattern = r'##([^#]+)##'  # Паттерн для поиска переменных в формате ##переменная##
    
    def extract_variables(self, text):
        """Извлекает все переменные из текста шаблона"""
        variables = re.findall(self.pattern, text)
        return list(set(variables))  # Убираем дубликаты 