const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');

// Create a new bug
router.post('/', async (req, res) => {
  try {
    const bug = new Bug(req.body);
    await bug.save();
    res.status(201).json(bug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bugs
router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a bug by ID
router.put('/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bug) return res.status(404).json({ error: 'Bug not found' });
    res.json(bug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a bug by ID
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) return res.status(404).json({ error: 'Bug not found' });
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

