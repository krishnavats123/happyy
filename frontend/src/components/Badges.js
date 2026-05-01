import React from 'react';

export function StatusBadge({ status, due }) {
  const today = new Date().toISOString().split('T')[0];
  if (status !== 'done' && due && due.split('T')[0] < today)
    return <span className="badge badge-overdue">Overdue</span>;
  const map = { todo: 'badge-todo', 'in-progress': 'badge-progress', done: 'badge-done' };
  const label = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
  return <span className={`badge ${map[status] || 'badge-todo'}`}>{label[status] || status}</span>;
}

export function PriorityBadge({ priority }) {
  return <span className={`badge badge-${priority}`}>{priority}</span>;
}

export function RoleBadge({ role }) {
  return <span className={`badge ${role === 'admin' ? 'badge-admin' : 'badge-member'}`}>{role}</span>;
}

export function Avatar({ name, size = 32 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}
