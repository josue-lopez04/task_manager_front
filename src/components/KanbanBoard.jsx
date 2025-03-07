// File: src/components/KanbanBoard.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './KanbanBoard.css';

const KanbanBoard = ({ tasks, onTaskUpdate }) => {
  const [columns, setColumns] = useState({
    todo: { name: 'To Do', items: [] },
    'in progress': { name: 'In Progress', items: [] },
    review: { name: 'Review', items: [] },
    done: { name: 'Done', items: [] }
  });

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const newColumns = {
        todo: { name: 'To Do', items: [] },
        'in progress': { name: 'In Progress', items: [] },
        review: { name: 'Review', items: [] },
        done: { name: 'Done', items: [] }
      };

      tasks.forEach(task => {
        const status = task.status.toLowerCase();
        if (newColumns[status]) {
          newColumns[status].items.push(task);
        } else {
          newColumns.todo.items.push(task);
        }
      });

      setColumns(newColumns);
    }
  }, [tasks]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceColumn.items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: { ...sourceColumn, items: newItems }
      }));
    } else {
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      const updatedTask = { ...movedItem, status: destination.droppableId };
      destItems.splice(destination.index, 0, updatedTask);

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems }
      }));

      if (onTaskUpdate) {
        onTaskUpdate(draggableId, { status: destination.droppableId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 capitalize">
              {column.name} ({column.items.length})
            </h3>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {column.items.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
