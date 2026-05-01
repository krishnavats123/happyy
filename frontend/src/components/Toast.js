import React, { useState, useEffect } from 'react';

let showToastFn = null;

export function showToast(msg) {
  if (showToastFn) showToastFn(msg);
}

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToastFn = (m) => {
      setMsg(m); setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
  }, []);

  return <div className={`toast${visible ? ' show' : ''}`}>{msg}</div>;
}
