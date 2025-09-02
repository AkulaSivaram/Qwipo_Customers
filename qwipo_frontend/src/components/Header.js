import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header(){
  const loc = useLocation();
  return (
    <div className="header">
      <div className="brand">Qwipo Customer Manager</div>
      <div className="row">
        <Link to="/customers" className="btn ghost">Customers</Link>
        {loc.pathname !== '/customers/new' && (
          <Link to="/customers/new" className="btn primary">+ New Customer</Link>
        )}
      </div>
    </div>
  );
}
