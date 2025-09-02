
const { db } = require('../utils/db');

function runAll(sql, params=[]) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}
function runGet(sql, params=[]) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
}

const Customer = {
  // options: { page, limit, q, city, state, pin_code, onlyOneAddress, sortBy, order }
  getAll: async (opts={}) => {
    const page = Math.max(parseInt(opts.page||1,10),1);
    const limit = Math.min(Math.max(parseInt(opts.limit||10,10),1),100);
    const offset = (page-1)*limit;
    const where = [];
    const params = [];
    if (opts.q) {
      where.push("(first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)");
      params.push('%'+opts.q+'%','%'+opts.q+'%','%'+opts.q+'%');
    }
    if (opts.city) { where.push("id IN (SELECT customer_id FROM addresses WHERE city LIKE ?)"); params.push('%'+opts.city+'%'); }
    if (opts.state) { where.push("id IN (SELECT customer_id FROM addresses WHERE state LIKE ?)"); params.push('%'+opts.state+'%'); }
    if (opts.pin_code) { where.push("id IN (SELECT customer_id FROM addresses WHERE pin_code LIKE ?)"); params.push('%'+opts.pin_code+'%'); }
    if (typeof opts.onlyOneAddress !== 'undefined') { where.push("only_one_address = ?"); params.push(opts.onlyOneAddress?1:0); }
    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const countSql = `SELECT COUNT(*) as total FROM customers ${whereSql}`;
    const dataSql = `SELECT * FROM customers ${whereSql} ORDER BY ${opts.sortBy||'created_at'} ${opts.order==='ASC'?'ASC':'DESC'} LIMIT ? OFFSET ?`;
    // add limit/offset params
    const countRow = await runGet(countSql, params);
    const rows = await runAll(dataSql, params.concat([limit, offset]));
    // fetch addresses for each row
    const result = await Promise.all(rows.map(async (r) => {
      const addrs = await runAll('SELECT * FROM addresses WHERE customer_id = ? ORDER BY created_at DESC', [r.id]);
      r.addresses = addrs || [];
      return r;
    }));
    return { rows: result, total: countRow ? countRow.total : 0, page, limit };
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        db.all('SELECT * FROM addresses WHERE customer_id = ?', [id], (e, addrs) => {
          if (e) return reject(e);
          row.addresses = addrs || [];
          resolve(row);
        });
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      const { first_name, last_name, phone_number, addresses = [] } = data;
      const insertCust = 'INSERT INTO customers (first_name, last_name, phone_number) VALUES (?,?,?)';
      db.run(insertCust, [first_name, last_name, phone_number], function(err) {
        if (err) return reject(err);
        const customerId = this.lastID;
        if (!addresses || !addresses.length) return resolve({ id: customerId, first_name, last_name, phone_number });
        const insertAddr = 'INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?,?,?,?,?)';
        let completed = 0;
        for (const a of addresses) {
          db.run(insertAddr, [customerId, a.address_details, a.city, a.state, a.pin_code], function(e) {
            if (e) console.error('Address insert error', e);
            completed++;
            if (completed === addresses.length) {
              resolve({ id: customerId, first_name, last_name, phone_number });
            }
          });
        }
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const { first_name, last_name, phone_number } = data;
      db.run('UPDATE customers SET first_name = ?, last_name = ?, phone_number = ?, updated_at = datetime(\'now\') WHERE id = ?', [first_name, last_name, phone_number, id], function(err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(null);
        resolve({ id, first_name, last_name, phone_number });
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
};

module.exports = Customer;
