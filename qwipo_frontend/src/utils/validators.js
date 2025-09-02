export const isPhone = (v) => /^\d{7,15}$/.test(String(v||'').trim());
export const isPin = (v) => /^\d{4,10}$/.test(String(v||'').trim());
export const required = (v) => String(v||'').trim().length > 0;
