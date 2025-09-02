import React, { useState } from 'react';
import { required, isPhone, isPin } from '../utils/validators';

export default function CustomerForm({ initial, onSubmit, mode='create' }){
  const [first_name, setFirst] = useState(initial.first_name||'');
  const [last_name, setLast] = useState(initial.last_name||'');
  const [phone_number, setPhone] = useState(initial.phone_number||'');

  const [addresses, setAddresses] = useState(initial.addresses || [ { address_details:'', city:'', state:'', pin_code:'' } ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const addAddress = () => setAddresses(p => [...p, { address_details:'', city:'', state:'', pin_code:'' }]);
  const removeAddress = (i) => setAddresses(p => p.filter((_,idx)=>idx!==i));
  const updateAddress = (i, key, val) => setAddresses(p => p.map((a,idx)=> idx===i ? { ...a, [key]: val } : a));

  const validate = () => {
    if (!required(first_name) || !required(last_name)) return 'First & Last name are required';
    if (!isPhone(phone_number)) return 'Phone number must be 7-15 digits';
    for (const a of addresses) {
      if (!required(a.address_details) || !required(a.city) || !required(a.state) || !isPin(a.pin_code)) return 'Address fields invalid';
    }
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      await onSubmit({ first_name, last_name, phone_number, addresses });
      setSuccess(mode==='create' ? 'Customer created successfully' : 'Customer updated successfully');
    } catch (err) {
      setError(err?.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="card">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid-2">
        <div className="field"><label>First Name *</label><input className="input" value={first_name} onChange={e=>setFirst(e.target.value)} /></div>
        <div className="field"><label>Last Name *</label><input className="input" value={last_name} onChange={e=>setLast(e.target.value)} /></div>
        <div className="field"><label>Phone Number *</label><input className="input" value={phone_number} onChange={e=>setPhone(e.target.value)} /></div>
      </div>

      <div className="hr" />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Addresses</h3>
        <button type="button" className="btn ghost" onClick={addAddress}>+ Add Address</button>
      </div>

      {addresses.map((a, idx) => (
        <div className="grid-2" key={idx} style={{marginBottom:8}}>
          <div className="field"><label>Address Details *</label><input className="input" value={a.address_details} onChange={e=>updateAddress(idx,'address_details', e.target.value)} /></div>
          <div className="field"><label>City *</label><input className="input" value={a.city} onChange={e=>updateAddress(idx,'city', e.target.value)} /></div>
          <div className="field"><label>State *</label><input className="input" value={a.state} onChange={e=>updateAddress(idx,'state', e.target.value)} /></div>
          <div className="field"><label>Pin Code *</label><input className="input" value={a.pin_code} onChange={e=>updateAddress(idx,'pin_code', e.target.value)} /></div>
          {addresses.length>1 && (
            <div><button type="button" className="btn danger" onClick={()=>removeAddress(idx)}>Remove</button></div>
          )}
        </div>
      ))}

      <div style={{display:'flex',gap:8, marginTop:12}}>
        <button disabled={loading} className="btn primary" type="submit">{loading ? 'Saving...' : (mode==='create' ? 'Create' : 'Save Changes')}</button>
      </div>
    </form>
  );
}
