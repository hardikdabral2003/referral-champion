
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection';
import campaignRoutes from './routes/campaigns';
import referralRoutes from './routes/referrals';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Set port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
