import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole } from '../api';
import { RoleBadge, Avatar } from '../components/Badges';
import { showToast } from '../components/Toast';
import { useAuth } from '../AuthContext';

export default function Team() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const load = () => getUsers().then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'member' : 'admin';
    await updateUserRole(u._id, newRole);
    load(); showToast(`${u.name} is now ${newRole}`);
  };

  return (
    <div>
      <div className="topbar"><div className="topbar-title">Team Members</div></div>
      <div className="content">
        <div className="card">
          {users.map(u => (
            <div key={u._id} className="member-row">
              <Avatar name={u.name} />
              <div style={{flex:1}}>
                <div className="mname">{u.name} {u._id === user?.id && <span style={{fontSize:11,color:'var(--text-muted)'}}>(you)</span>}</div>
                <div className="memail">{u.email}</div>
              </div>
              <RoleBadge role={u.role} />
              {u._id !== user?.id && (
                <button className="btn btn-sm btn-ghost" onClick={() => toggleRole(u)}>
                  {u.role === 'admin' ? 'Make Member' : 'Make Admin'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
