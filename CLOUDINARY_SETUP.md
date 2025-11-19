# Cloudinary Setup Instructions

## Overview
This project uses **Cloudinary** for image storage and management instead of Firebase Storage. Cloudinary provides a free tier with generous limits and built-in image optimization.

## Why Cloudinary?
- ✅ Free tier: 25GB storage + 25GB bandwidth/month
- ✅ Works perfectly with Expo Go (no native modules needed)
- ✅ Automatic image optimization and compression
- ✅ Built-in CDN for fast global delivery
- ✅ On-the-fly image transformations (resize, crop, format)
- ✅ No backend required for uploads

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to https://cloudinary.com
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Get Your Credentials
After logging in to your Cloudinary dashboard:
1. You'll see your **Cloud Name** on the dashboard home page
2. Note this down - you'll need it for configuration

### 3. Create an Upload Preset
1. Go to **Settings** (gear icon) → **Upload**
2. Scroll down to **Upload presets** section
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Give it a name (e.g., `home_rental_app`)
   - **Signing Mode**: Select **Unsigned** (important for mobile apps)
   - **Folder**: Optionally set a base folder (e.g., `home-rental`)
   - **Access mode**: Public (so images can be accessed via URL)
5. Click **Save**
6. Note down your **preset name**

### 4. Configure Your App
1. Open `src/services/cloudinary.service.ts`
2. Replace the placeholder values:
   ```typescript
   const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // Replace with your actual cloud name
   const CLOUDINARY_UPLOAD_PRESET = 'your_preset_name'; // Replace with your preset name
   ```

### 5. Example Configuration
```typescript
// Example with actual values:
const CLOUDINARY_CLOUD_NAME = 'dxyz123abc'; // Your cloud name from dashboard
const CLOUDINARY_UPLOAD_PRESET = 'home_rental_app'; // The preset you created
```

## How It Works

### Image Upload Flow
1. User selects/takes a photo using the image picker
2. App uploads image directly to Cloudinary using the unsigned preset
3. Cloudinary returns a secure URL (HTTPS)
4. App stores this URL in Firestore database
5. Images are delivered via Cloudinary's global CDN

### Folder Structure
Images are organized by user and type:
```
cloudinary/
└── properties/
    └── {userId}/
        ├── image1.jpg
        ├── image2.jpg
        └── ...
```

## Features

### Automatic Optimization
Cloudinary automatically:
- Compresses images without quality loss
- Converts to optimal format (WebP, AVIF when supported)
- Serves responsive images based on device

### Image Transformations
You can transform images on-the-fly by modifying the URL:
```javascript
// Original
https://res.cloudinary.com/demo/image/upload/sample.jpg

// Resized to 300x300
https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg

// With quality optimization
https://res.cloudinary.com/demo/image/upload/q_auto,f_auto/sample.jpg
```

## Security Notes

### Upload Security
- Uses **unsigned uploads** with upload presets
- Preset restricts what can be uploaded (format, size, etc.)
- No API keys exposed in mobile app

### Image Deletion
- Image deletion requires API authentication
- Should be done from your backend/cloud functions
- Current implementation logs a warning (implement backend for production)

## Testing

### Test Upload
1. Run your app: `npm start`
2. Go to Add Property screen
3. Select an image
4. Submit the form
5. Check your Cloudinary dashboard to see the uploaded image

### Verify in Dashboard
1. Go to **Media Library** in Cloudinary dashboard
2. You should see your uploaded images in the configured folders
3. Click any image to see details and get the URL

## Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Credits**: 25 monthly

This is more than sufficient for a startup or small application.

## Migration from Firebase Storage

### What Changed
- ✅ Image uploads now use Cloudinary
- ✅ Image URLs are now Cloudinary CDN URLs
- ✅ Fixed deprecated `ImagePicker.MediaTypeOptions` warning
- ✅ No changes needed to other parts of the app
- ✅ Firebase Auth and Firestore still work as before

### Files Modified
1. `src/services/cloudinary.service.ts` - New Cloudinary service
2. `src/services/firebase.service.ts` - Updated to use Cloudinary
3. `src/screens/Property/AddPropertyScreen.tsx` - Uses Cloudinary for uploads

## Troubleshooting

### "Cloudinary not configured" Error
- Make sure you replaced the placeholder values in `cloudinary.service.ts`
- Double-check your cloud name and preset name

### "Upload failed" Error
- Verify your upload preset is set to **Unsigned**
- Check if the preset name matches exactly
- Ensure you have internet connectivity

### Images Not Appearing
- Check the Cloudinary dashboard Media Library
- Verify the URLs are being saved to Firestore correctly
- Check browser console for CORS errors (shouldn't happen with Cloudinary)

## Support
- Cloudinary Documentation: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com
- Community: https://community.cloudinary.com

## Next Steps
1. Complete the setup steps above
2. Test image upload functionality
3. Monitor usage in Cloudinary dashboard
4. Consider implementing backend image deletion for security
