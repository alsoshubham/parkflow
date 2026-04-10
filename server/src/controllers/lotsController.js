import { db } from '../models/data.js';

export const lotsController = {
  getAll(req, res) {
    res.json(db.lots);
  },

  getById(req, res) {
    const lot = db.lots.find(l => l.id === req.params.id);
    if (!lot) return res.status(404).json({ error: 'Lot not found' });
    res.json(lot);
  },

  create(req, res) {
    const lot = { ...req.body, id: db.genId('l'), status: 'active' };
    db.lots.push(lot);
    res.status(201).json(lot);
  },

  update(req, res) {
    const idx = db.lots.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lot not found' });
    db.lots[idx] = { ...db.lots[idx], ...req.body };
    res.json(db.lots[idx]);
  },

  delete(req, res) {
    const idx = db.lots.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lot not found' });
    db.lots.splice(idx, 1);
    res.json({ message: 'Lot deleted' });
  },
};
