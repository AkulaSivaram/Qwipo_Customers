import React, { useState, useEffect } from 'react';

export default function Filters({ onChange, initial }){
  const [q, setQ] = useState(initial.q||'');
  const [city, setCity] = useState(initial.city||'');
  const [state, setState] = useState(initial.state||'');
  const [pin_code, setPin] = useState(initial.pin_code||'');
  const [onlyOne, setOnlyOne] = useState(initial.onlyOneAddress||false);
  const [sortBy, setSortBy] = useState(initial.sortBy||'created_at');
  const [order, setOrder] = useState(initial.order||'DESC');

  useEffect(()=>{ onChange({ q, city, state, pin_code, onlyOneAddress: onlyOne, sortBy, order, page:1 }); },[q,city,state,pin_code,onlyOne,sortBy,order]);

  const clear = () => {
    setQ(''); setCity(''); setState(''); setPin(''); setOnlyOne(false); setSortBy('created_at'); setOrder('DESC');
    onChange({ q:'', city:'', state:'', pin_code:'', onlyOneAddress:false, sortBy:'created_at', order:'DESC', page:1 });
  };

  return (
    <div className="card" style={{marginBottom:12}}>
      <div className="row">
        <div className="field"><label>Search</label><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Name or phone" /></div>
        <div className="field"><label>City</label><input className="input" value={city} onChange={e=>setCity(e.target.value)} /></div>
        <div className="field"><label>State</label><input className="input" value={state} onChange={e=>setState(e.target.value)} /></div>
        <div className="field"><label>PIN</label><input className="input" value={pin_code} onChange={e=>setPin(e.target.value)} /></div>
      </div>
      <div className="row" style={{marginTop:8, alignItems:'flex-end'}}>
        <div className="field"><label>Only One Address?</label>
          <select className="input" value={onlyOne ? 'yes':'no'} onChange={e=>setOnlyOne(e.target.value==='yes')}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div className="field"><label>Sort By</label>
          <select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="created_at">Created</option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="phone_number">Phone</option>
          </select>
        </div>
        <div className="field"><label>Order</label>
          <select className="input" value={order} onChange={e=>setOrder(e.target.value)}>
            <option value="DESC">DESC</option>
            <option value="ASC">ASC</option>
          </select>
        </div>
        <button className="btn ghost" onClick={clear} style={{height:42, alignSelf:'center'}}>Clear Filters</button>
      </div>
    </div>
  );
}
