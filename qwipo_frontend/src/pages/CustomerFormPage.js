import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { api, handleError } from '../services/api';

export default function CustomerFormPage({ mode }){
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState({});
  const [error, setError] = useState('');

  useEffect(()=>{
    if (mode==='edit' && id) {
      api.get(`/customers/${id}`).then(r=>{
        const c = r.data.data;
        setInitial({ first_name:c.first_name, last_name:c.last_name, phone_number:c.phone_number, addresses: c.addresses });
      }).catch(e=>setError(handleError(e)));
    }
  },[mode,id]);

  const onSubmit = async (payload) => {
    try {
      if (mode==='create') {
        await api.post('/customers', payload);
      } else {
        await api.put(`/customers/${id}`, { first_name: payload.first_name, last_name: payload.last_name, phone_number: payload.phone_number });
        // Sync addresses: naive way — delete all then re-add
        const detail = await api.get(`/customers/${id}`);
        const current = detail.data.data.addresses;
        for (const a of current) await api.delete(`/addresses/${a.id}`);
        for (const a of payload.addresses) await api.post(`/customers/${id}/addresses`, a);
      }
      navigate('/customers');
    } catch (e) {
      throw new Error(handleError(e));
    }
  };

  return (
    <div>
      <h2 style={{marginBottom:8}}>{mode==='create' ? 'Create New Customer' : `Edit Customer #${id}`}</h2>
      {error && <div className="alert error">{error}</div>}
      <CustomerForm initial={initial} onSubmit={onSubmit} mode={mode} />
    </div>
  );
}
