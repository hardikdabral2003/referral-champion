
import express from 'express';
import Referral from '../models/Referral';

const router = express.Router();

// Get all referrals
router.get('/', async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get referrals by campaign id
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const referrals = await Referral.find({ campaignId: req.params.campaignId });
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get referral by code
router.get('/code/:code', async (req, res) => {
  try {
    const referral = await Referral.findOne({ code: req.params.code });
    if (!referral) {
      return res.status(404).json({ msg: 'Referral not found' });
    }
    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a referral
router.post('/', async (req, res) => {
  try {
    const newReferral = new Referral({
      campaignId: req.body.campaignId,
      referrerId: req.body.referrerId,
      code: req.body.code,
    });

    const referral = await newReferral.save();
    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Track referral click
router.put('/click/:code', async (req, res) => {
  try {
    let referral = await Referral.findOne({ code: req.params.code });
    if (!referral) {
      return res.status(404).json({ msg: 'Referral not found' });
    }

    referral = await Referral.findOneAndUpdate(
      { code: req.params.code },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Track referral conversion
router.put('/convert/:code', async (req, res) => {
  try {
    let referral = await Referral.findOne({ code: req.params.code });
    if (!referral) {
      return res.status(404).json({ msg: 'Referral not found' });
    }

    referral = await Referral.findOneAndUpdate(
      { code: req.params.code },
      { $inc: { conversions: 1 } },
      { new: true }
    );

    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
