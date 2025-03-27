// src/components/ApiDiagnostic.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApiDiagnostic = ({ taskId }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing direct API call to /tasks/' + taskId);
      const response = await api.get(`/tasks/${taskId}`);
      console.log('API Response:', response);
      setResult(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Error en la llamada API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mt-4">
      <h3 className="text-lg font-medium mb-2">Diagnóstico de API</h3>
      <button
        onClick={testDirectApi}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Probando...' : 'Probar llamada directa a API'}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 p-3 rounded text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <p className="font-medium">Respuesta API:</p>
          <pre className="bg-gray-200 p-2 rounded overflow-auto mt-2 text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiDiagnostic;