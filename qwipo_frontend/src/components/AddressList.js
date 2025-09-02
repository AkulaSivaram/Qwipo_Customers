import React from 'react';

export default function AddressList({ items, onEdit, onDelete }){
  return (
    <div className="card">
      <h3>Addresses</h3>
      {items.length===0 && <div className="tag">No addresses</div>}
      {items.map(a => (
        <div key={a.id} style={{border:'1px solid #1f2937', padding:10, borderRadius:10, marginTop:8}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div><b>{a.city}</b>, {a.state} — {a.pin_code}</div>
              <div style={{color:'#9ca3af'}}>{a.address_details}</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn ghost" onClick={()=>onEdit(a)}>Edit</button>
              <button className="btn danger" onClick={()=>onDelete(a.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
