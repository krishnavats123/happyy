import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Layout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="logo">&#9654; TeamFlow</div>
          <div className="tagline">Team Task Manager</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Main</div>
            <NavLink to="/dashboard" className={({isActive})=>`nav-item${isActive?' active':''}`}>&#9644; Dashboard</NavLink>
            <NavLink to="/projects" className={({isActive})=>`nav-item${isActive?' active':''}`}>&#128193; Projects</NavLink>
            <NavLink to="/tasks" className={({isActive})=>`nav-item${isActive?' active':''}`}>&#10003; My Tasks</NavLink>
            <NavLink to="/all-tasks" className={({isActive})=>`nav-item${isActive?' active':''}`}>&#9776; All Tasks</NavLink>
          </div>
          {user?.role === 'admin' && (
            <div className="nav-section">
              <div className="nav-label">Admin</div>
              <NavLink to="/team" className={({isActive})=>`nav-item${isActive?' active':''}`}>&#128101; Team Members</NavLink>
            </div>
          )}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="uname">{user?.name}</div>
            <div className="urole">{user?.role}</div>
          </div>
          <button className="btn btn-sm" style={{marginLeft:'auto',background:'#334155',color:'#94a3b8',border:'none'}} onClick={handleLogout}>Out</button>
        </div>
      </div>
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
