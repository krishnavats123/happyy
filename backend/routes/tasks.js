const express = require('express');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/tasks — all tasks (admin) or own tasks (member)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { assigneeId: req.user._id };
    const tasks = await Task.find(filter)
      .populate('projectId', 'name')
      .populate('assigneeId', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/my — tasks assigned to logged in user
router.get('/my', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assigneeId: req.user._id })
      .populate('projectId', 'name')
      .populate('assigneeId', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks — create task (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, projectId, assigneeId, status, priority, due } = req.body;
    if (!name || !projectId || !assigneeId)
      return res.status(400).json({ message: 'Name, project and assignee required' });
    const task = await Task.create({ name, description, projectId, assigneeId, status, priority, due });
    const populated = await task.populate(['projectId', 'assigneeId']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id — update (admin can update all; member can update own)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAdmin = req.user.role === 'admin';
    const isAssignee = task.assigneeId.toString() === req.user._id.toString();
    if (!isAdmin && !isAssignee)
      return res.status(403).json({ message: 'Not authorized to update this task' });

    // Members can only update status
    const updates = isAdmin ? req.body : { status: req.body.status };
    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('projectId', 'name')
      .populate('assigneeId', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
