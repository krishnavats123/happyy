import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api';
import { useAuth } from '../AuthContext';
import { showToast } from '../components/Toast';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null); // null | 'create' | project object
  const [form, setForm] = useState({ name: '', description: '' });
  const isAdmin = user?.role === 'admin';

  const load = () => getProjects().then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: '', description: '' }); setModal('create'); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description }); setModal(p); };

  const save = async () => {
    if (!form.name.trim()) return showToast('Project name required');
    try {
      if (modal === 'create') await createProject(form);
      else await updateProject(modal._id, form);
      setModal(null); load(); showToast('Project saved');
    } catch (err) { showToast(err.response?.data?.message || 'Error'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete project and all its tasks?')) return;
    await deleteProject(id); load(); showToast('Project deleted');
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Projects</div>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>}
      </div>
      <div className="content">
        {projects.length === 0 ? (
          <div className="empty"><div className="empty-icon">📁</div><div>No projects yet</div></div>
        ) : (
          <div className="project-grid">
            {projects.map(p => {
              const pct = p.totalTasks ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0;
              return (
                <div key={p._id} className="project-card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div className="project-name">{p.name}</div>
                    {isAdmin && (
                      <div style={{display:'flex',gap:4}}>
                        <button className="btn btn-sm btn-ghost" onClick={()=>openEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={()=>remove(p._id)}>Del</button>
                      </div>
                    )}
                  </div>
                  <div className="project-desc">{p.description || 'No description'}</div>
                  <div className="project-stats">
                    <div><span>{p.totalTasks}</span> tasks</div>
                    <div><span>{p.doneTasks}</span> done</div>
                    <div><span>{pct}%</span> complete</div>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}></div></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay open" onClick={e=>e.target.className.includes('modal-overlay')&&setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{modal==='create'?'New Project':'Edit Project'}</div>
              <button className="modal-close" onClick={()=>setModal(null)}>&#x2715;</button>
            </div>
            <div className="field"><label>Project Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="field"><label>Description</label><textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
