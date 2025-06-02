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
    'http://localhost:3000',
    'https://ember-guard.vercel.app',
    'https://ember-guard-git-main-ginaxtrans-projects.vercel.app',
    /^https:\/\/ember-guard.*\.vercel\.app$/,
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.options('*', cors());

app.use((req, res, next) => {
  console.log('Request from origin:', req.headers.origin || 'No Origin');
  console.log('Request path:', req.method, req.path);
  
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request');
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

app.get('/api/debug/cors', (req, res) => {
  console.log('CORS debug endpoint accessed');
  res.json({
    success: true,
    message: 'CORS test endpoint working',
    requestOrigin: req.headers.origin,
    allowedOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://ember-guard.vercel.app',
      'https://ember-guard-git-main-ginaxtrans-projects.vercel.app',
      /^https:\/\/ember-guard.*\.vercel\.app$/,
      process.env.FRONTEND_URL
    ].filter(Boolean),
    requestHeaders: req.headers,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => {
  console.log('Health check accessed');
  res.json({ 
    success: true, 
    message: 'EmberGuard API is running perfectly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    cors: {
      enabled: true,
      allowedOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://ember-guard.vercel.app',
        'https://ember-guard-git-main-ginaxtrans-projects.vercel.app',
        /^https:\/\/ember-guard.*\.vercel\.app$/,
        process.env.FRONTEND_URL
      ].filter(Boolean)
    }
  });
});

app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.json({
    success: true,
    message: 'Welcome to EmberGuard Authentication API',
    version: '1.0.0',
    status: 'Server is running successfully',
    endpoints: {
      health: '/api/health',
      corsDebug: '/api/debug/cors',
      authTest: '/api/auth/test',
      register: '/api/auth/register',
      login: '/api/auth/login',
      currentUser: '/api/auth/me',
      logout: '/api/auth/logout'
    },
    documentation: 'All systems operational!',
    deployment: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    },
    cors: {
      enabled: true,
      allowedOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://ember-guard.vercel.app',
        'https://ember-guard-git-main-ginaxtrans-projects.vercel.app',
        /^https:\/\/ember-guard.*\.vercel\.app$/,
        process.env.FRONTEND_URL
      ].filter(Boolean)
    }
  });
});

app.get('/test', (req, res) => {
  console.log('Basic test endpoint accessed');
  res.json({
    success: true,
    message: 'Basic connectivity test successful',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      root: '/',
      test: '/test',
      health: '/api/health',
      corsDebug: '/api/debug/cors',
      auth: '/api/auth/test',
      register: '/api/auth/register',
      login: '/api/auth/login'
    },
    timestamp: new Date().toISOString()
  });
});

app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack 
    })
  });
});

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI status:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('MongoDB Connected Successfully');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Port: ${conn.connection.port}`);
   
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Make sure MongoDB is running and check MONGODB_URI');
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode without database');
    } else {
      process.exit(1);
    }
  }
};

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log('EmberGuard Backend Server Started Successfully');
      console.log(`Server URL: http://localhost:${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log(`Basic Test: http://localhost:${PORT}/test`);
      console.log(`CORS Debug: http://localhost:${PORT}/api/debug/cors`);
      console.log(`Auth Test: http://localhost:${PORT}/api/auth/test`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Started: ${new Date().toISOString()}`);
      console.log('Ready to handle requests');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    console.log('Server stopped');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  console.log('Shutting down server due to unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.log('Shutting down server due to uncaught exception');
  process.exit(1);
});

startServer();