'use client';
import { useState, useEffect } from 'react';
import { Template } from '@/types/template';

export interface TemplateFormProps {
  template: Template;
  onClose: () => void;
  onSubmit: (formValues: Record<string, string>) => void;
}

export function TemplateForm({ template, onClose, onSubmit }: TemplateFormProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [variables, setVariables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (template && template.variables) {
      // Если variables - массив строк
      if (Array.isArray(template.variables)) {
        setVariables(template.variables);
        
        // Инициализируем пустые значения формы
        const initialValues: Record<string, string> = {};
        template.variables.forEach(variable => {
          initialValues[variable] = '';
        });
        setFormValues(initialValues);
      } 
      // Если variables - объект с ключами/значениями
      else if (typeof template.variables === 'object') {
        const varArray = Object.keys(template.variables);
        setVariables(varArray);
        
        // Используем существующие значения
        setFormValues(template.variables as Record<string, string>);
      }
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, не содержится ли сообщение о том, что это docx файл
    if (variables.length === 1 && variables[0].includes("This is a Word document")) {
      setError("Word documents cannot be filled directly. Please use Google Docs button.");
      return;
    }
    
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {variables.map((variable) => (
        <div key={variable} className="space-y-1">
          <label 
            htmlFor={variable} 
            className="block text-sm font-medium text-gray-900"
          >
            {variable.replace(/_/g, ' ')}
          </label>
          <input
            type="text"
            id={variable}
            name={variable}
            value={formValues[variable] || ''}
            onChange={handleInputChange}
            placeholder={`Enter ${variable.replace(/_/g, ' ')}...`}
            className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      ))}
      
      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Fill and Download
        </button>
      </div>
    </form>
  );
} 