const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/projects — all projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email');
    // Attach task counts
    const result = await Promise.all(projects.map(async (p) => {
      const tasks = await Task.find({ projectId: p._id });
      return {
        ...p.toObject(),
        totalTasks: tasks.length,
        doneTasks: tasks.filter(t => t.status === 'done').length
      };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects — create (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });
    const project = await Project.create({ name, description, createdBy: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/projects/:id — update (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id — delete project + its tasks (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ message: 'Project and tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
