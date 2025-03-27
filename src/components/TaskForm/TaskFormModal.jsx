// src/components/TaskForm/TaskFormModal.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from '../TaskForm';

// Estilos específicos para el modal
const modalStyles = `
  .task-modal-overlay {
    animation: fadeIn 0.2s ease-out;
  }
  
  .task-modal-content {
    animation: slideIn 0.3s ease-out;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const TaskFormModal = ({ isOpen, onClose, groupId }) => {
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSuccess = () => {
    setSuccessMessage('Task created successfully!');
    // Cierra el modal después de 1.5 segundos para permitir que el usuario vea el mensaje
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 task-modal-overlay">
        <div className="bg-white rounded-lg p-6 w-full max-w-md task-modal-content shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Task</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {successMessage ? (
          <div className="bg-green-50 p-4 rounded-md text-green-700 mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        ) : (
          <TaskForm groupId={groupId} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
    </>

  );
};

export default TaskFormModal;