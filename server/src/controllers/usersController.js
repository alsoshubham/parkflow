import { db } from '../models/data.js';

export const usersController = {
  getAll(req, res) {
    const safeUsers = db.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  },

  getById(req, res) {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  },

  create(req, res) {
    if (db.users.find(u => u.email === req.body.email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const user = {
      ...req.body,
      id: db.genId('u'),
      created: new Date().toISOString().split('T')[0],
    };
    db.users.push(user);
    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  },

  update(req, res) {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    db.users[idx] = { ...db.users[idx], ...req.body };
    const { password, ...safeUser } = db.users[idx];
    res.json(safeUser);
  },

  delete(req, res) {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    db.users.splice(idx, 1);
    res.json({ message: 'User deleted' });
  },
};
