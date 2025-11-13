const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    require('./models/User');
    require('./models/Gig');
    require('./models/Application');

    const userRoutes = require("./routes/userRoutes");
    app.use("/api/users", userRoutes);

    const gigRoutes = require("./routes/gigRoutes");
    app.use("/api/gigs", gigRoutes);

    const applicationRoutes = require("./routes/applicationRoutes");
    app.use("/api/applications", applicationRoutes);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });