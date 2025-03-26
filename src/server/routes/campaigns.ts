
import express from 'express';
import Campaign from '../models/Campaign';

const router = express.Router();

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get campaign by id
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a campaign
router.post('/', async (req, res) => {
  try {
    const newCampaign = new Campaign({
      title: req.body.title,
      description: req.body.description,
      reward: req.body.reward,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      active: req.body.active,
      createdBy: req.body.createdBy
    });

    const campaign = await newCampaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a campaign
router.put('/:id', async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
