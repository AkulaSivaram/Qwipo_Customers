import React from 'react';

export default function Pagination({ page, limit, total, onChange }){
  const pages = Math.max(Math.ceil(total/limit), 1);
  const prev = () => onChange(Math.max(page-1,1));
  const next = () => onChange(Math.min(page+1,pages));
  return (
    <div className="pagination">
      <span className="tag">{total} results</span>
      <button className="btn ghost" onClick={prev} disabled={page<=1}>Prev</button>
      <span className="badge">Page <span className="kbd">{page}</span> / <span className="kbd">{pages}</span></span>
      <button className="btn ghost" onClick={next} disabled={page>=pages}>Next</button>
    </div>
  );
}
