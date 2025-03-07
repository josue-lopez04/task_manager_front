// File: src/components/GroupCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const { _id, name, description, members } = group;
  
  return (
    <Link to={`/groups/${_id}`} className="block">
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <h4 className="font-semibold mb-2">{name}</h4>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>{members?.length || 0} members</span>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
