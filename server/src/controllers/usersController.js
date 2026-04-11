import { db } from '../models/data.js';

import bcrypt from 'bcryptjs';

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
    
    let userPassword = req.body.password || '123456';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);

    const user = {
      ...req.body,
      password: hash,
      id: db.genId('u'),
      created: new Date().toISOString().split('T')[0],
    };
    db.users.push(user);
    db.save();
    
    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  },

  update(req, res) {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    
    let updates = { ...req.body };
    if (updates.password) {
      const salt = bcrypt.genSaltSync(10);
      updates.password = bcrypt.hashSync(updates.password, salt);
    }

    db.users[idx] = { ...db.users[idx], ...updates };
    db.save();
    
    const { password, ...safeUser } = db.users[idx];
    res.json(safeUser);
  },

  delete(req, res) {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    db.users.splice(idx, 1);
    db.save();
    res.json({ message: 'User deleted' });
  },
};
