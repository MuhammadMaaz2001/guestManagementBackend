import express from 'express';
import cors from 'cors';
import guestRoutes from './routes/guest.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/guests', guestRoutes);

export default app;
