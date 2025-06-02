const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('Starting EmberGuard Backend Server');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ember-guard-adsjw6bi2-ginaxtrans-projects.vercel.app',
    'https://ember-guard.vercel.app/',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EmberGuard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to EmberGuard Authentication API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      authTest: '/api/auth/test',
      register: '/api/auth/register',
      login: '/api/auth/login',
      currentUser: '/api/auth/me',
      logout: '/api/auth/logout'
    },
    documentation: 'All systems operational!'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      health: '/api/health',
      auth: '/api/auth/test',
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
});

app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack 
    })
  });
});

const connectDB = async () => {
  try {
    console.log('URI:', process.env.MONGODB_URI);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`MongoDB Connected`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Port: ${conn.connection.port}`);
   
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Make sure MongoDB is running on your system');
    console.error('Check your MONGODB_URI in .env file');
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Auth Test: http://localhost:${PORT}/api/auth/test`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Started: ${new Date().toISOString()}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
    console.log('Server stopped');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();