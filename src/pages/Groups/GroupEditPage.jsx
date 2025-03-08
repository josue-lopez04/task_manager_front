import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import GroupForm from '../../components/GroupForm';

const GroupEditPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { getGroup } = useGroupContext();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId) {
        setError('Group ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getGroup(groupId);
        
        if (response && response.group) {
          setGroup(response.group);
          
          // Check if current user is the creator
          if (user && response.group.createdBy && response.group.createdBy._id !== user.userId) {
            setNotAuthorized(true);
          }
        } else {
          setError('Failed to load group data');
        }
      } catch (err) {
        console.error('Error fetching group:', err);
        setError(err.message || 'Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, getGroup, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading group...</p>
      </div>
    );
  }

  if (notAuthorized) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Not authorized: Only the group creator can edit this group</p>
        <Link to={`/groups/${groupId}`} className="text-blue-600 hover:underline mt-2 inline-block">
          Back to group details
        </Link>
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