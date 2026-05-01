import React, { useEffect, useState } from 'react';
import { getProjects, getAllTasks } from '../api';
import { StatusBadge } from '../components/Badges';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getProjects().then(r => setProjects(r.data)).catch(() => {});
    getAllTasks().then(r => setTasks(r.data)).catch(() => {});
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.due && t.due.split('T')[0] < today && t.status !== 'done').length;
  const myTasks = tasks.filter(t => t.assigneeId?._id === user?.id || t.assigneeId === user?.id).slice(0, 5);

  return (
    <div>
      <div className="topbar"><div className="topbar-title">Dashboard</div></div>
      <div className="content">
        <div className="stat-grid">
          <div className="stat-card blue"><div className="stat-label">Total Projects</div><div className="stat-value">{projects.length}</div><div className="stat-sub">Active projects</div></div>
          <div className="stat-card green"><div className="stat-label">Completed</div><div className="stat-value">{done}</div><div className="stat-sub">Tasks done</div></div>
          <div className="stat-card amber"><div className="stat-label">In Progress</div><div className="stat-value">{inProgress}</div><div className="stat-sub">Tasks ongoing</div></div>
          <div className="stat-card red"><div className="stat-label">Overdue</div><div className="stat-value">{overdue}</div><div className="stat-sub">Need attention</div></div>
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div className="card-title">My Recent Tasks</div></div>
            {myTasks.length ? myTasks.map(t => (
              <div key={t._id} style={{display:'flex',alignItems:'center',gap:8,padding:'0.6rem 0',borderBottom:'1px solid var(--bg)'}}>
                <div style={{flex:1,fontSize:13,fontWeight:500}}>{t.name}</div>
                <StatusBadge status={t.status} due={t.due} />
              </div>
            )) : <div className="empty"><div className="empty-text">No tasks assigned to you</div></div>}
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Active Projects</div></div>
            {projects.map(p => {
              const pct = p.totalTasks ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0;
              return (
                <div key={p._id} style={{padding:'0.6rem 0',borderBottom:'1px solid var(--bg)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:600}}>{p.name}</span>
                    <span style={{fontSize:12,color:'var(--text-muted)'}}>{pct}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
