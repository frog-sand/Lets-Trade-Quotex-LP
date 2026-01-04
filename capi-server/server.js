require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Meta CAPI Configuration
const PIXEL_ID = process.env.META_PIXEL_ID || '25618509431149818';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const CAPI_VERSION = 'v18.0';
const CAPI_URL = `https://graph.facebook.com/${CAPI_VERSION}/${PIXEL_ID}/events`;

// Hash function for user data (required by Meta for privacy)
function hashData(data) {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CAPI Server is running' });
});

// Main CAPI endpoint
app.post('/api/track', async (req, res) => {
  try {
    const {
      eventName,
      eventSourceUrl,
      userAgent,
      ipAddress,
      fbp,
      fbc,
      email,
      phone,
      firstName,
      lastName,
      city,
      state,
      zip,
      country
    } = req.body;

    // Validate required fields
    if (!eventName) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    if (!ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Meta Access Token not configured' });
    }

    // Build user data object (hash PII)
    const userData = {
      client_ip_address: ipAddress || req.ip,
      client_user_agent: userAgent || req.headers['user-agent'],
    };

    // Add fbp and fbc if available
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    // Add hashed PII if available
    if (email) userData.em = hashData(email);
    if (phone) userData.ph = hashData(phone);
    if (firstName) userData.fn = hashData(firstName);
    if (lastName) userData.ln = hashData(lastName);
    if (city) userData.ct = hashData(city);
    if (state) userData.st = hashData(state);
    if (zip) userData.zp = hashData(zip);
    if (country) userData.country = hashData(country);

    // Build event data
    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: eventSourceUrl || req.headers.referer || req.headers.origin,
      action_source: 'website',
      user_data: userData,
    };

    // Prepare CAPI payload
    const payload = {
      data: [eventData],
      access_token: ACCESS_TOKEN,
    };

    // Send to Meta CAPI
    const response = await axios.post(CAPI_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[CAPI] Event sent: ${eventName}`, {
      eventId: response.data.events_received,
      fbTraceId: response.data.fbtrace_id,
    });

    res.json({
      success: true,
      message: 'Event sent to Meta CAPI',
      eventsReceived: response.data.events_received,
      fbTraceId: response.data.fbtrace_id,
    });

  } catch (error) {
    console.error('[CAPI] Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send event to Meta CAPI',
      details: error.response?.data || error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Meta CAPI Server running on port ${PORT}`);
  console.log(`Pixel ID: ${PIXEL_ID}`);
  console.log(`Access Token: ${ACCESS_TOKEN ? 'Configured ✓' : 'NOT CONFIGURED ✗'}`);
});
