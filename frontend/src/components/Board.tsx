import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Column } from './Column';
import { OnlineUsers } from './OnlineUsers';
import { useBoardSocket } from '../hooks/useBoardSocket';

export const Board: React.FC = () => {
  useBoardSocket(); // Initialize socket connection and listeners
  
  const tasks = useSelector((state: RootState) => state.board.tasks);
  
  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <div className="min-h-screen bg-gray-800 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Real-Time Collaborative Board</h1>
        <OnlineUsers />
        
        <div className="flex flex-col md:flex-row gap-6">
          <Column title="To Do" status="TODO" tasks={todoTasks} />
          <Column title="In Progress" status="IN_PROGRESS" tasks={inProgressTasks} />
          <Column title="Done" status="DONE" tasks={doneTasks} />
        </div>
      </div>
    </div>
  );
};
