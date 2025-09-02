import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, handleError } from '../services/api';
import Filters from '../components/Filters';
import CustomerTable from '../components/CustomerTable';
import Pagination from '../components/Pagination';

export default function CustomerListPage(){
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total:0, page:1, limit:10 });
  const [query, setQuery] = useState({ page:1, limit:10, sortBy:'created_at', order:'DESC' });
  const [alert, setAlert] = useState('');

  const fetchData = async () => {
    const params = new URLSearchParams(query).toString();
    const res = await api.get(`/customers?${params}`);
    setItems(res.data.data);
    setMeta(res.data.meta);
  };

  useEffect(()=>{ fetchData().catch(e=>setAlert(handleError(e))); }, [JSON.stringify(query)]);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this customer permanently?')) return;
    try {
      await api.delete(`/customers/${id}`);
      setAlert('Customer deleted');
      fetchData();
    } catch (e) { setAlert(handleError(e)); }
  };

  return (
    <div>
      {alert && <div className="alert success">{alert}</div>}
      <Filters onChange={setQuery} initial={query} />
      <CustomerTable items={items} onDelete={onDelete} />
      <Pagination page={meta.page} limit={meta.limit} total={meta.total} onChange={(p)=>setQuery(q=>({...q, page:p}))} />
      <div style={{marginTop:10}}><Link to="/customers/new" className="btn primary">+ New Customer</Link></div>
    </div>
  );
}
