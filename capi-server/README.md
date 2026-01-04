# Meta Conversions API (CAPI) Server

This is a Node.js/Express server that handles Meta (Facebook) server-side tracking using the Conversions API (CAPI) for your landing pages.

## Why Use Server-Side Tracking?

Server-side tracking complements client-side Meta Pixel tracking by:
- **Bypassing ad blockers** - Events are sent from your server, not the browser
- **Improving data accuracy** - Reduces data loss from browser limitations
- **Better attribution** - More reliable tracking of conversions
- **Privacy compliance** - Better control over data handling

## Setup Instructions

### 1. Install Dependencies

Navigate to the `capi-server` directory and install the required packages:

```bash
cd capi-server
npm install
```

### 2. Get Meta Access Token

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel (ID: `25618509431149818`)
3. Navigate to **Settings** > **Conversions API**
4. Click **Generate Access Token**
5. Copy the access token

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Meta Access Token:
   ```
   META_PIXEL_ID=25618509431149818
   META_ACCESS_TOKEN=your_actual_access_token_here
   PORT=3000
   ```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port you specified).

### 5. Update Landing Page URLs

In your landing pages (Red and Violet are already updated), change the `CAPI_SERVER_URL` from:
```javascript
const CAPI_SERVER_URL = 'http://localhost:3000/api/track';
```

To your production server URL:
```javascript
const CAPI_SERVER_URL = 'https://your-server.com/api/track';
```

## Deployment Options

### Option 1: Deploy to Heroku (Free/Paid)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set META_PIXEL_ID=25618509431149818
   heroku config:set META_ACCESS_TOKEN=your_access_token
   ```
5. Deploy: `git push heroku main`

### Option 2: Deploy to Railway (Free/Paid)

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in the Railway dashboard
4. Deploy automatically

### Option 3: Deploy to DigitalOcean, AWS, or VPS

1. Set up a VPS server
2. Install Node.js
3. Upload your code
4. Use PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name capi-server
   pm2 save
   pm2 startup
   ```

## API Endpoints

### POST `/api/track`

Tracks an event to Meta Conversions API.

**Request Body:**
```json
{
  "eventName": "PageView",
  "eventSourceUrl": "https://yoursite.com/page",
  "userAgent": "Mozilla/5.0...",
  "fbp": "_fbp cookie value",
  "fbc": "_fbc cookie value",
  "email": "user@example.com",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event sent to Meta CAPI",
  "eventsReceived": 1,
  "fbTraceId": "ABC123..."
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "CAPI Server is running"
}
```

## Events Being Tracked

- **PageView** - Automatically tracked when page loads
- **Subscribe** - Tracked when user clicks the JOIN NOW button

## Updating Other Landing Pages

To add CAPI tracking to your other landing pages (Pink, Purple, Green, Grey, Black, Blue, Peach, White, Yellow), add the same script code before the closing `</body>` tag.

## Testing

1. Start the server
2. Open your landing page
3. Check the browser console for "Event sent to CAPI: PageView"
4. Click the JOIN NOW button
5. Check the browser console for "Event sent to CAPI: Subscribe"
6. Check the server logs for confirmation

## Verify in Meta Events Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Go to **Test Events**
4. You should see events coming from both:
   - **Browser** (client-side Pixel)
   - **Server** (CAPI)

## Security Notes

- **Never commit `.env` file** - It's already in `.gitignore`
- **Keep your Access Token secure** - It has access to your Meta account
- **Use HTTPS in production** - Protect data in transit
- **Consider rate limiting** - Add middleware to prevent abuse

## Troubleshooting

**Server not starting:**
- Check if port 3000 is already in use
- Verify all dependencies are installed

**Events not showing in Meta:**
- Verify your Access Token is correct
- Check the server logs for errors
- Ensure the Pixel ID matches

**CORS errors:**
- The server has CORS enabled by default
- If issues persist, check your hosting provider's settings

## Support

For issues or questions about Meta Conversions API:
- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Meta Business Help Center](https://www.facebook.com/business/help)
