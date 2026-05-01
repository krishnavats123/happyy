import React, { useEffect, useState } from 'react';
import { getMyTasks, updateTask, createTask } from '../api';
import { StatusBadge, PriorityBadge, Avatar } from '../components/Badges';
import TaskModal from '../components/TaskModal';
import { showToast } from '../components/Toast';
import { useAuth } from '../AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'create' | task

  const load = () => getMyTasks().then(r => setTasks(r.data));
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    try {
      if (modal === 'create') await createTask({ ...form, assigneeId: user.id });
      else await updateTask(modal._id, form);
      setModal(null); load(); showToast('Task saved');
    } catch (err) { showToast(err.response?.data?.message || 'Error'); }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const cols = ['todo', 'in-progress', 'done'];
  const labels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">My Tasks</div>
        <button className="btn btn-primary" onClick={() => setModal('create')}>+ New Task</button>
      </div>
      <div className="content">
        <div className="filters">
          {['all', 'todo', 'in-progress', 'done'].map(f => (
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : labels[f] || f}
            </button>
          ))}
        </div>
        <div className="kanban">
          {cols.map(status => {
            const colTasks = filtered.filter(t => t.status === status);
            return (
              <div key={status} className="kanban-col">
                <div className="kanban-header">
                  <div className="kanban-title">{labels[status]}</div>
                  <div className="kanban-count">{colTasks.length}</div>
                </div>
                {colTasks.map(t => (
                  <div key={t._id} className="task-card" onClick={() => setModal(t)}>
                    <div className="task-name">{t.name}</div>
                    <div className="task-meta">
                      <PriorityBadge priority={t.priority} />
                      {t.projectId && <span style={{fontSize:11,color:'var(--text-muted)'}}>{t.projectId.name}</span>}
                      {t.due && <span style={{fontSize:11,color:'var(--text-muted)'}}>Due: {t.due.split('T')[0]}</span>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {modal && <TaskModal task={modal==='create'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  );
}
