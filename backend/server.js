const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();


const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);


const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';


const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, 
    methods: ["GET", "POST"]
  }
});


app.use(cors({
  origin: FRONTEND_URL
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.get('/',(req,res )=>{
  res.send({
    activestatus:true,
    error:false,
  })
})


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));