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
    'https://ember-guard-adsjw6bi2-ginaxtrans-projects.vercel.app',
    'https://ember-guard.vercel.app',
    'https://ember-guard-git-main-ginaxtrans-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  optionsSuccessStatus: 200
}));

app.options('*', cors());

app.use((req, res, next) => {
  console.log('Request from origin:', req.headers.origin);
  
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  
  if (req.method === 'OPTIONS') {
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
    documentation: 'All systems operational!',
    cors: {
      allowedOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://ember-guard-adsjw6bi2-ginaxtrans-projects.vercel.app',
        'https://ember-guard.vercel.app',
        'https://ember-guard-git-main-ginaxtrans-projects.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    }
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
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`MongoDB Connected Successfully`);
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
    console.error('Troubleshooting tips:');
    console.error('   - Make sure MongoDB is running on your system');
    console.error('   - Check your MONGODB_URI in .env file');
    console.error('   - Verify network connectivity if using MongoDB Atlas');
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log('EmberGuard Backend Server Started Successfully!');
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Auth Test: http://localhost:${PORT}/api/auth/test`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Started: ${new Date().toISOString()}`);
      console.log('Ready to handle requests!');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        console.error('Try using a different port or stop the other process');
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

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
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