'use client';
import { useState, useEffect } from 'react';
import { Template } from '@/types/template';

interface TemplateEditorProps {
  template: Template;
  onSave: (updatedTemplate: Partial<Template>) => Promise<void>;
}

export default function TemplateEditor({ template, onSave }: TemplateEditorProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isBinary, setIsBinary] = useState(false);

  useEffect(() => {
    const fetchTemplateContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`http://localhost:8000/api/v1/templates/${template.id}/content`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error response: ${response.status} - ${errorText}`);
          throw new Error(`Failed to fetch template content: ${response.status}`);
        }
        
        const data = await response.json();
        setContent(data.content || '');
        setIsBinary(data.is_binary || false);
        
        // Извлекаем переменные из содержимого
        const variableRegex = /##([^#]+)##/g;
        const matches = data.content.match(variableRegex) || [];
        const extractedVars = matches.map(match => match.replace(/##/g, ''));
        setVariables([...new Set(extractedVars)]); // Удаляем дубликаты
        
      } catch (err) {
        console.error('Error fetching template content:', err);
        setError(`Failed to load template content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (template.id) {
      fetchTemplateContent();
    }
  }, [template.id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`http://localhost:8000/api/v1/templates/${template.id}/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error saving: ${response.status} - ${errorText}`);
        throw new Error(`Failed to save template: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Проверяем, создан ли новый шаблон
      if (responseData.message && responseData.message.includes("Created new text template")) {
        setMessage(`Created new text template: ${responseData.new_template.filename}`);
        
        // Перенаправляем на новый шаблон через 2 секунды
        setTimeout(() => {
          window.location.href = `/templates/${responseData.new_template.id}/edit`;
        }, 2000);
        
        return;
      }
      
      // Для обычных текстовых шаблонов обновляем как раньше
      const variableRegex = /##([^#]+)##/g;
      const matches = content.match(variableRegex) || [];
      const extractedVars = matches.map(match => match.replace(/##/g, ''));
      const uniqueVars = [...new Set(extractedVars)];
      
      await onSave({ 
        variables: uniqueVars,
        is_template: uniqueVars.length > 0 
      });
      
      setVariables(uniqueVars);
      setMessage('Template saved successfully');
    } catch (err) {
      console.error('Error saving template:', err);
      setError(`Failed to save template: ${err.message}`);
    } finally {
      setIsSaving(false);
      if (!message || !message.includes("Created new text template")) {
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4 text-black">Edit Template: {template.filename}</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {message}
        </div>
      )}
      
      {isBinary && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 mb-4">
          <h3 className="font-bold mb-2">Word Document Template</h3>
          <p className="mb-2 text-yellow-900">
            When you save, a new text template will be created with the content below.
            You can edit the text and add variables using <code className="bg-white px-1.5 py-0.5 rounded-md border border-yellow-400 font-mono font-bold">##variable_name##</code> syntax.
          </p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-bold text-black mb-2">
            Template Content
          </label>
          <textarea
            id="template-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 p-4 border-2 border-gray-400 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base text-black bg-white"
            placeholder="Enter template content here..."
            style={{ lineHeight: '1.5', letterSpacing: '0.01em' }}
          />
          
          <div className="mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md shadow-md hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              {isSaving ? 'Saving...' : (isBinary ? 'Create Text Template' : 'Save Template')}
            </button>
          </div>
        </div>
        
        <div className="md:w-1/3">
          <h3 className="text-md font-bold text-black mb-2">Variables Found</h3>
          {variables.length > 0 ? (
            <div className="space-y-2">
              {variables.map((variable, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md shadow-md flex items-center border border-gray-300">
                  <code className="text-base text-blue-800 font-mono font-semibold flex-1">
                    ##{variable}##
                  </code>
                  <button
                    onClick={() => {
                      const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
                      if (textarea) {
                        const cursorPos = textarea.selectionStart;
                        const textBefore = content.substring(0, cursorPos);
                        const textAfter = content.substring(cursorPos);
                        setContent(textBefore + `##${variable}##` + textAfter);
                        
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(cursorPos + variable.length + 4, cursorPos + variable.length + 4);
                        }, 0);
                      }
                    }}
                    className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md font-medium"
                  >
                    Insert
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-md shadow-md border border-gray-300 text-black">
              <span className="font-medium">No variables found in template</span>
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 p-4 rounded-md shadow-md border border-blue-200">
            <h4 className="font-bold text-black mb-2">How to use variables</h4>
            <ul className="text-sm text-black space-y-2">
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>Use double hash syntax: <code className="bg-white px-2 py-0.5 rounded-md border border-blue-300 font-mono font-semibold text-blue-800">##variable_name##</code></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span className="font-medium">Variable names should be descriptive</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span className="font-medium">Avoid spaces in variable names</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span className="font-medium">Variables will be replaced with user input when the template is filled</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 