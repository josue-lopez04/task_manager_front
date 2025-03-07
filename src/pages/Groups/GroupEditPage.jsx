// File: src/pages/Groups/GroupEditPage.jsx (continued)
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../context/GroupContext';
import GroupForm from '../../components/GroupForm';
import '../../styles/pages.css'


const GroupEditPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { getGroup } = useGroupContext();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const { group: groupData } = await getGroup(groupId);
        setGroup(groupData);
      } catch (err) {
        setError(err.message || 'Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, getGroup]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading group...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
        <Link to="/groups" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to groups
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Edit Group</h2>
        <p className="text-gray-600">
          Update group details
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        {group ? (
          <GroupForm group={group} />
        ) : (
          <p className="text-yellow-600">Group not found</p>
        )}
      </div>

      <div className="mt-4">
        <Link to={`/groups/${groupId}`} className="text-blue-600 hover:underline">
          Back to group details
        </Link>
      </div>
    </div>
  );
};

export default GroupEditPage;