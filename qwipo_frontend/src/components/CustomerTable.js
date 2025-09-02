import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomerTable({ items, onDelete }){
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Only One Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr className="tr" key={c.id}>
              <td>{c.id}</td>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.phone_number}</td>
              <td>
                {c.only_one_address ? <span className="badge">Yes</span> : <span className="badge">No</span>}
              </td>
              <td style={{display:'flex', gap:8}}>
                <Link className="btn ghost" to={`/customers/${c.id}`}>View</Link>
                <Link className="btn ghost" to={`/customers/${c.id}/edit`}>Edit</Link>
                <button className="btn danger" onClick={()=>onDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length===0 && (
            <tr><td colSpan="5" style={{color:'#9ca3af'}}>No customers found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
