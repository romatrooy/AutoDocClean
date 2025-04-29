'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navigation/Navbar';

export default function EditTemplatePage() {
  const [template, setTemplate] = useState<any>(null);
  const [content, setContent] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const templateId = params.id;

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Получаем детали шаблона
      const response = await fetch(`http://localhost:8000/api/v1/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`);
      }
      
      const templateData = await response.json();
      setTemplate(templateData);
      
      // Получаем содержимое шаблона
      const contentResponse = await fetch(`http://localhost:8000/api/v1/templates/${templateId}/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!contentResponse.ok) {
        console.error(`Content response error: ${contentResponse.status} - ${await contentResponse.text()}`);
        throw new Error('Failed to fetch template content');
      }
      
      try {
        const contentData = await contentResponse.json();
        setContent(contentData.content || '');
        
        // Извлекаем переменные из содержимого
        extractVariables(contentData.content || '');
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        setContent('');
        extractVariables('');
      }
    } catch (err) {
      console.error('Error fetching template:', err);
      setError(`Failed to load template: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractVariables = (text: string) => {
    const regex = /{{(.*?)}}/g;
    const matches = text.match(regex) || [];
    const vars = matches.map(match => match.replace(/{{|}}/g, ''));
    setVariables([...new Set(vars)]); // Убираем дубликаты
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    extractVariables(newContent);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/templates/${templateId}/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save template');
      }
      
      setSaveSuccess(true);
      
      // Скрываем сообщение об успехе после 3 секунд
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/templates"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Templates
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Template: {template?.filename}</h1>
            
            {saveSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                Template saved successfully!
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Template Content</h2>
                  <textarea
                    value={content}
                    onChange={handleContentChange}
                    className="w-full h-96 p-4 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md font-mono text-base text-black bg-white"
                    placeholder="Enter template content here..."
                    style={{ lineHeight: '1.5', letterSpacing: '0.01em' }}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Save Template
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Variables Found</h2>
                  {variables.length === 0 ? (
                    <p className="text-gray-600">No variables found in template</p>
                  ) : (
                    <ul className="space-y-2">
                      {variables.map((variable, index) => (
                        <li key={index} className="bg-gray-100 px-3 py-2 rounded-md text-gray-800 font-mono text-sm">
                          {`{{${variable}}}`}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <h3 className="text-md font-medium text-gray-900 mb-2">How to use variables</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Use double curly braces to define variables: <code className="bg-gray-200 px-1 py-0.5 rounded">{'{{variable_name}}'}</code>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Variables will be replaced with user input when the template is filled.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!loading && !error && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Template Help</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">How to Create a Template</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex">
                        <span className="mr-2">1.</span>
                        <span>Type your document text in the editor above</span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">2.</span>
                        <span>Add variables where you want dynamic content using <code className="bg-gray-100 px-1 py-0.5 rounded">##variable_name##</code></span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">3.</span>
                        <span>Click Save to store your template</span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">4.</span>
                        <span>When using the template, you'll be prompted to fill in each variable</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Example Template</h3>
                    <div className="bg-white p-4 rounded border border-gray-200 text-gray-800">
                      <p>Dear ##client_name##,</p>
                      <p className="mt-2">Thank you for your interest in our services. We're pleased to provide you with a quote for the work discussed on ##meeting_date##.</p>
                      <p className="mt-2">The total cost will be $##total_amount##.</p>
                      <p className="mt-2">Sincerely,<br/>##your_name##</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}