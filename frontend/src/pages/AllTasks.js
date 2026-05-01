import React, { useEffect, useState } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask } from '../api';
import { StatusBadge, PriorityBadge, Avatar } from '../components/Badges';
import TaskModal from '../components/TaskModal';
import { showToast } from '../components/Toast';
import { useAuth } from '../AuthContext';

export default function AllTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(null);
  const isAdmin = user?.role === 'admin';

  const load = () => getAllTasks().then(r => setTasks(r.data));
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    try {
      if (modal === 'create') await createTask(form);
      else await updateTask(modal._id, form);
      setModal(null); load(); showToast('Task saved');
    } catch (err) { showToast(err.response?.data?.message || 'Error'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id); load(); showToast('Task deleted');
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">All Tasks</div>
        {isAdmin && <button className="btn btn-primary" onClick={() => setModal('create')}>+ New Task</button>}
      </div>
      <div className="content">
        <div className="card">
          <table>
            <thead>
              <tr><th>Task</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Status</th><th>Due</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan={7}><div className="empty"><div>No tasks yet</div></div></td></tr>
              ) : tasks.map(t => {
                const canEdit = isAdmin || t.assigneeId?._id === user?.id;
                return (
                  <tr key={t._id}>
                    <td><div style={{fontWeight:600}}>{t.name}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{t.description}</div></td>
                    <td>{t.projectId?.name || '-'}</td>
                    <td>{t.assigneeId ? <div style={{display:'flex',alignItems:'center',gap:6}}><Avatar name={t.assigneeId.name} size={24}/>{t.assigneeId.name}</div> : '-'}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} due={t.due} /></td>
                    <td style={{fontSize:12}}>{t.due ? t.due.split('T')[0] : '-'}</td>
                    <td>
                      <div style={{display:'flex',gap:4}}>
                        {canEdit && <button className="btn btn-sm btn-ghost" onClick={() => setModal(t)}>Edit</button>}
                        {isAdmin && <button className="btn btn-sm btn-danger" onClick={() => remove(t._id)}>Del</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal && <TaskModal task={modal==='create'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}
