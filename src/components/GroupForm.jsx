import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupContext } from '../context/GroupContext';

const GroupForm = ({ group }) => {
  const navigate = useNavigate();
  const { createGroup, updateGroup } = useGroupContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    // Only update form data if group prop changes and is not null
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
      });
    }
  }, [group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
// En src/components/GroupForm.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name.trim()) {
    setError('Group name is required');
    return;
  }
  
  setLoading(true);
  setError('');

  try {
    console.log("Submitting group form:", formData);
    
    if (group) {
      // Update existing group
      const result = await updateGroup(group._id, formData);
      console.log("Update group result:", result);
      
      // No verificar estructura específica, solo navegar si no hay error
      navigate(`/groups/${group._id}`);
    } else {
      // Create new group
      const result = await createGroup(formData);
      console.log("Create group result:", result);
      
      // No verificar estructura específica, solo navegar si no hay error
      navigate('/groups');
    }
  } catch (err) {
    console.error('Group form error:', err);
    setError(err.response?.data?.msg || err.message || 'Failed to save group');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    navigate(group ? `/groups/${group._id}` : '/groups');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 p-3 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Group Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : group ? 'Update Group' : 'Create Group'}
        </button>
      </div>
    </form>
  );
};

export default GroupForm;