import { db } from '../models/data.js';

export const sessionsController = {
  getAll(req, res) {
    res.json(db.sessions);
  },

  getActive(req, res) {
    res.json(db.sessions.filter(s => s.status === 'active'));
  },

  logEntry(req, res) {
    const session = {
      id: db.genId('S'),
      ...req.body,
      entryTime: new Date().toISOString(),
      exitTime: null,
      status: 'active',
      guardId: req.user.id,
      amount: null,
    };
    db.sessions.push(session);
    db.save();
    res.status(201).json(session);
  },

  logExit(req, res) {
    const idx = db.sessions.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Session not found' });

    const session = db.sessions[idx];
    const lot = db.lots.find(l => l.id === session.lotId);
    const hours = Math.max(1, Math.round((Date.now() - new Date(session.entryTime).getTime()) / 3600000));
    const amount = hours * (lot?.pricePerHour || 40);

    db.sessions[idx] = {
      ...session,
      exitTime: new Date().toISOString(),
      status: 'closed',
      amount,
    };
    db.save();

    res.json(db.sessions[idx]);
  },
};
