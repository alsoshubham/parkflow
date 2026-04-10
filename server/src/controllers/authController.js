import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { db } from '../models/data.js';

export const authController = {
  login(req, res) {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (user.status !== 'active') return res.status(403).json({ error: 'Account is inactive' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  },

  me(req, res) {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  },
};
