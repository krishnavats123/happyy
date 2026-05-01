import React, { useState, useEffect } from 'react';
import { getProjects, getUsers } from '../api';
import { useAuth } from '../AuthContext';

export default function TaskModal({ task, onClose, onSave }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [form, setForm] = useState({
    name: task?.name || '',
    description: task?.description || '',
    projectId: task?.projectId?._id || task?.projectId || '',
    assigneeId: task?.assigneeId?._id || task?.assigneeId || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    due: task?.due ? task.due.split('T')[0] : ''
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getProjects().then(r => setProjects(r.data));
    if (isAdmin) getUsers().then(r => setUsers(r.data));
  }, [isAdmin]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay open" onClick={e => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{task ? 'Edit Task' : 'New Task'}</div>
          <button className="modal-close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="field"><label>Task Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="field"><label>Description</label><textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
        {isAdmin && (
          <div className="form-row">
            <div className="field"><label>Project</label>
              <select value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                <option value="">Select project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Assignee</label>
              <select value={form.assigneeId} onChange={e => set('assigneeId', e.target.value)}>
                <option value="">Select assignee</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="form-row-3">
          <div className="field"><label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          {isAdmin && <>
            <div className="field"><label>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="field"><label>Due Date</label><input type="date" value={form.due} onChange={e => set('due', e.target.value)} /></div>
          </>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}
