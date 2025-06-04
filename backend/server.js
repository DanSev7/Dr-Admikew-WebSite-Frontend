// const express = require('express');
// const { createClient } = require('@supabase/supabase-js');
// const chapaRoutes = require('./routes/chapaRoutes');
// const emailRoutes = require('./routes/emailRoutes');
// const axios = require('axios');
// const cors = require('cors');
// const compression = require('compression');
// const helmet = require('helmet');
// require('dotenv').config();

// const app = express();
// // CORS configuration
// // const corsOptions = {
// //   origin: (origin, callback) => {
// //     callback(null, true); // Accept all origins dynamically
// //   },
// //   credentials: true,
// // };


// // CORS configuration
// // const corsOptions = {
// //   origin: process.env.NODE_ENV === 'production' 
// //     ? 'https://dradmikewmedcenter.com' 
// //     : 'http://localhost:5173' ,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// //   credentials: true
// // };
// // const corsOptions = {
// //   origin: 'http://localhost:5173',  // hardcoded for local dev
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// //   credentials: true
// // };
// const allowedOrigins = [
//  'https://dradmikewmedcenter.com' ,
//  'https://www.dradmikewmedcenter.com' ,
//  'http://dradmikewmedcenter.com',
//  'http://www.dradmikewmedcenter.com',
//  'http://localhost:5173',
// ];
// const corsOptions = {
//   origin: allowedOrigins,
//   credentials: true,
// };


// // app.use(cors(corsOptions));
// // app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(compression());
// app.use(helmet());

// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === 'production' && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });
// // Initialize Supabase client
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Get departments
// app.get('/api/departments', async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('departments')
//       .select('id, name, price');
//     if (error) throw error;
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get services by type
// app.get('/api/services/:type', async (req, res) => {
//   try {
//     const { type } = req.params;
//     const { data, error } = await supabase
//       .from('services')
//       .select('id, code, name, type, category, price')
//       .eq('type', type.charAt(0).toUpperCase() + type.slice(1));
//     if (error) throw error;
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get home service options
// app.get('/api/home-services', async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('home_service_options')
//       .select('id, name, price');
//     if (error) throw error;
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Sample
// app.get('/getAll', async(req, res) => {
//   try {
//     res.status(200).json({message: "Backend works fine"});
//   } catch (error) {
//     res.status(500).json({error : error.message});
//   }
// })

// app.get('/api/appointments/status-by-tx/:txRef', async (req, res) => {
//   const { txRef } = req.params;
//   console.log("txRef : ", txRef);
//   try {
//     const { data, error } = await supabase
//       .from('appointments')
//       .select('payment_status')
//       .eq('chapa_transaction_id', txRef)
//       .single();

//     if (error || !data) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Routes
// app.use('/api/chapa', chapaRoutes);
// app.use('/api', emailRoutes);

// // Payment success page (simple redirect handler)
// // app.get('/payment-success', (req, res) => {
// //   res.redirect('/'); // Redirect to home or a success page
// // });

// // Error Handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// // const HOST = process.env.NODE_ENV === 'production' ? 'api.dradmikewmedcenter.com' : 'localhost';
// const HOST = 'localhost';

// app.listen(PORT, () => {
//   console.log(`Server running on ${HOST}:${PORT}`);
// });

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const chapaRoutes = require('./routes/chapaRoutes');
const emailRoutes = require('./routes/emailRoutes');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Validate critical environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length) {
  console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();

// Configure CORS
const allowedOrigins = [
  'https://dradmikewmedcenter.com',
  'https://www.dradmikewmedcenter.com',
  'http://dradmikewmedcenter.com',
  'http://www.dradmikewmedcenter.com',
  'http://localhost:5173', // Only for development
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Customize CSP if needed
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(morgan('combined')); // Structured logging

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } } // Optimize Supabase client
);

// API Routes
app.get('/api/departments', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, price');
    if (error) throw new Error(`Supabase error: ${error.message}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.get('/api/services/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    const { data, error } = await supabase
      .from('services')
      .select('id, code, name, type, category, price')
      .eq('type', formattedType);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.get('/api/home-services', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('home_service_options')
      .select('id, name, price');
    if (error) throw new Error(`Supabase error: ${error.message}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.get('/api/appointments/status-by-tx/:txRef', async (req, res, next) => {
  try {
    const { txRef } = req.params;
    const { data, error } = await supabase
      .from('appointments')
      .select('payment_status')
      .eq('chapa_transaction_id', txRef)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.get('/getAll', async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Backend is operational' });
  } catch (error) {
    next(error);
  }
});

// Mount route handlers
app.use('/api/chapa', chapaRoutes);
app.use('/api', emailRoutes);

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`, { stack: err.stack, path: req.path, method: req.method });
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});