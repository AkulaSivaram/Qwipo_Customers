import React, { useState } from 'react';
import { required, isPin } from '../utils/validators';

export default function AddressForm({ initial, onSubmit, onCancel }){
  const [address_details, setDetails] = useState(initial.address_details||'');
  const [city, setCity] = useState(initial.city||'');
  const [state, setState] = useState(initial.state||'');
  const [pin_code, setPin] = useState(initial.pin_code||'');
  const [error, setError] = useState('');

  const validate = () => {
    if (!required(address_details) || !required(city) || !required(state) || !isPin(pin_code)) return 'Invalid address fields';
    return '';
  };

  const submit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    onSubmit({ address_details, city, state, pin_code });
  };

  return (
    <form onSubmit={submit} className="card" style={{marginTop:10}}>
      {error && <div className="alert error">{error}</div>}
      <div className="grid-2">
        <div className="field"><label>Address Details *</label><input className="input" value={address_details} onChange={e=>setDetails(e.target.value)} /></div>
        <div className="field"><label>City *</label><input className="input" value={city} onChange={e=>setCity(e.target.value)} /></div>
        <div className="field"><label>State *</label><input className="input" value={state} onChange={e=>setState(e.target.value)} /></div>
        <div className="field"><label>Pin Code *</label><input className="input" value={pin_code} onChange={e=>setPin(e.target.value)} /></div>
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="btn primary" type="submit">Save Address</button>
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
