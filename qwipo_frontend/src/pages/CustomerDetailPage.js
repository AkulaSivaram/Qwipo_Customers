import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api, handleError } from '../services/api';
import AddressList from '../components/AddressList';
import AddressForm from '../components/AddressForm';

export default function CustomerDetailPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [alert, setAlert] = useState('');

  const load = async () => {
    const res = await api.get(`/customers/${id}`);
    setCustomer(res.data.data);
  };

  useEffect(()=>{ load().catch(e=>setAlert(handleError(e))); }, [id]);

  const del = async () => {
    if (!window.confirm('Delete this customer permanently?')) return;
    await api.delete(`/customers/${id}`);
    navigate('/customers');
  };

  const addAddress = async (payload) => {
    await api.post(`/customers/${id}/addresses`, payload);
    setAdding(false); await load(); setAlert('Address added');
  };

  const updateAddress = async (payload) => {
    await api.put(`/addresses/${editing.id}`, payload);
    setEditing(null); await load(); setAlert('Address updated');
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    await api.delete(`/addresses/${addressId}`);
    await load(); setAlert('Address deleted');
  };

  if (!customer) return <div className="tag">Loading...</div>;

  return (
    <div>
      {alert && <div className="alert success">{alert}</div>}
      <div className="card" style={{marginBottom:10}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <h2 style={{margin:0}}>{customer.first_name} {customer.last_name}</h2>
            <div className="tag">Phone: {customer.phone_number}</div>
            <div className="tag">Only One Address: {customer.only_one_address ? 'Yes' : 'No'}</div>
            <div className="tag">Total Addresses: {customer.address_count}</div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <Link className="btn ghost" to={`/customers/${id}/edit`}>Edit</Link>
            <button className="btn danger" onClick={del}>Delete</button>
          </div>
        </div>
      </div>

      <AddressList items={customer.addresses} onEdit={setEditing} onDelete={deleteAddress} />

      {!adding && !editing && (
        <div style={{marginTop:10}}>
          <button className="btn ghost" onClick={()=>setAdding(true)}>+ Add Address</button>
        </div>
      )}

      {adding && (
        <AddressForm initial={{}} onSubmit={addAddress} onCancel={()=>setAdding(false)} />
      )}

      {editing && (
        <AddressForm initial={editing} onSubmit={updateAddress} onCancel={()=>setEditing(null)} />
      )}
    </div>
  );
}
