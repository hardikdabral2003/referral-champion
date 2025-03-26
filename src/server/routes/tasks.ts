
import express from 'express';
import Task from '../models/Task';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get tasks by user id
router.get('/user/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task({
      campaignId: req.body.campaignId,
      description: req.body.description,
      userId: req.body.userId
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Complete a task
router.put('/complete/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { completed: true } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
