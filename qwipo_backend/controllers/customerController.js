
const Customer = require('../models/customerModel');

exports.getCustomers = async (req, res) => {
  try {
    const opts = {
      page: req.query.page,
      limit: req.query.limit,
      q: req.query.q,
      city: req.query.city,
      state: req.query.state,
      pin_code: req.query.pin_code,
      onlyOneAddress: typeof req.query.onlyOneAddress !== 'undefined' ? (req.query.onlyOneAddress==='true' || req.query.onlyOneAddress==='1') : undefined,
      sortBy: req.query.sortBy,
      order: req.query.order
    };
    const result = await Customer.getAll(opts);
    res.json({ message: 'success', meta: { total: result.total, page: result.page, limit: result.limit }, data: result.rows });
  } catch (err) {
    console.error('getCustomers error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'success', data: customer });
  } catch (err) {
    console.error('getCustomerById error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const data = req.body;
    if (!data.first_name || !data.last_name || !data.phone_number) {
      return res.status(400).json({ error: 'first_name, last_name and phone_number are required' });
    }
    const created = await Customer.create(data);
    res.status(201).json({ message: 'Customer created', data: created });
  } catch (err) {
    console.error('createCustomer error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated', data: updated });
  } catch (err) {
    console.error('updateCustomer error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error('deleteCustomer error', err);
    res.status(500).json({ error: err.message });
  }
};
