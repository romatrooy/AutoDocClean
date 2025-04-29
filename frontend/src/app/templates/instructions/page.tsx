'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TemplateInstructions() {
  const [activeTab, setActiveTab] = useState('format');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Инструкция по созданию шаблонов</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Вкладки навигации */}
        <div className="flex border-b">
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'format' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={() => setActiveTab('format')}
          >
            Формат шаблонов
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'examples' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={() => setActiveTab('examples')}
          >
            Примеры использования
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'tips' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={() => setActiveTab('tips')}
          >
            Советы и рекомендации
          </button>
        </div>
        
        {/* Содержимое вкладок */}
        <div className="p-6">
          {activeTab === 'format' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Формат шаблонов</h2>
              <p className="mb-4 text-gray-800">
                Шаблоны в нашей системе представляют собой документы с переменными, которые будут заменены при генерации документа.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900">Как обозначать переменные</h3>
              <p className="mb-2 text-gray-800">Переменные в шаблоне обозначаются с помощью двойных решеток с обеих сторон:</p>
              <div className="bg-gray-100 p-3 rounded mb-4">
                <code className="text-blue-600 font-medium">##имя_переменной##</code>
              </div>
              
              <p className="mb-4 text-gray-800">Например, вместо конкретного имени клиента вы можете использовать переменную:</p>
              <div className="bg-gray-100 p-3 rounded mb-4 text-gray-800">
                <p>Уважаемый <span className="text-blue-600 font-medium">##имя_клиента##</span>, благодарим вас за обращение.</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900">Поддерживаемые форматы файлов</h3>
              <ul className="list-disc list-inside mb-4 text-gray-800">
                <li>Текстовые файлы (.txt)</li>
                <li>Документы Microsoft Word (.docx)</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900">Правила именования переменных</h3>
              <ul className="list-disc list-inside mb-4 text-gray-800">
                <li>Используйте только латинские буквы, цифры и символ подчеркивания</li>
                <li>Не используйте пробелы в именах переменных</li>
                <li>Имена переменных чувствительны к регистру</li>
                <li>Используйте понятные и описательные имена</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'examples' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Примеры использования</h2>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">Пример 1: Договор оказания услуг</h3>
              <div className="bg-gray-100 p-4 rounded mb-6 text-gray-800">
                <p className="mb-2"><strong>ДОГОВОР №##номер_договора##</strong></p>
                <p className="mb-2">г. ##город## от ##дата##</p>
                <p className="mb-4">
                  ООО "Компания", в лице директора ##имя_директора##, действующего на основании Устава, именуемое в дальнейшем "Исполнитель", с одной стороны, и ##название_клиента##, в лице ##представитель_клиента##, действующего на основании ##основание_представителя##, именуемое в дальнейшем "Заказчик", с другой стороны, заключили настоящий Договор о нижеследующем:
                </p>
                <p>Сумма договора: ##сумма## рублей.</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900">Пример 2: Акт выполненных работ</h3>
              <div className="bg-gray-100 p-4 rounded mb-6 text-gray-800">
                <p className="mb-2"><strong>АКТ №##номер_акта##</strong></p>
                <p className="mb-2">к договору №##номер_договора## от ##дата_договора##</p>
                <p className="mb-4">
                  Исполнитель: ##исполнитель##<br/>
                  Заказчик: ##заказчик##
                </p>
                <p className="mb-2">Оказанные услуги:</p>
                <p className="mb-2">##описание_услуг##</p>
                <p className="mb-4">Стоимость: ##стоимость## рублей</p>
                <p className="mb-2">
                  Исполнитель: ____________ / ##подпись_исполнителя##<br/>
                  Заказчик: ____________ / ##подпись_заказчика##
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'tips' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Советы и рекомендации</h2>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">Лучшие практики</h3>
              <ul className="list-disc list-inside mb-6 text-gray-800">
                <li className="mb-2">Используйте понятные имена переменных, отражающие их содержимое</li>
                <li className="mb-2">Группируйте связанные переменные с помощью префиксов (например, client_name, client_address)</li>
                <li className="mb-2">Создавайте шаблоны с учетом возможных отсутствующих данных</li>
                <li className="mb-2">Проверяйте шаблон перед использованием, заполнив все переменные тестовыми данными</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900">Распространенные ошибки</h3>
              <ul className="list-disc list-inside mb-6 text-gray-800">
                <li className="mb-2">Неправильное написание переменных (пропуск символов ##)</li>
                <li className="mb-2">Использование разных имен для одной и той же переменной</li>
                <li className="mb-2">Слишком сложные имена переменных, в которых легко допустить ошибку</li>
                <li className="mb-2">Отсутствие проверки шаблона перед его использованием</li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                <h3 className="text-md font-semibold mb-2 text-gray-900">Совет</h3>
                <p className="text-gray-800">
                  Создайте библиотеку часто используемых шаблонов и переменных. Это позволит стандартизировать процесс создания документов и сократить количество ошибок.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t">
          <Link href="/templates" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Вернуться к шаблонам
          </Link>
        </div>
      </div>
    </div>
  );
}
