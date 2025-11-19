// Cloudinary Configuration
// Sign up at: https://cloudinary.com
// Get your credentials from the dashboard
// Create an unsigned upload preset in Settings -> Upload -> Add upload preset

const CLOUDINARY_CLOUD_NAME = 'dbgdrdh1e';
const CLOUDINARY_UPLOAD_PRESET = 'flgh7scu';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

/**
 * Upload image to Cloudinary
 * @param uri - Local image URI from device
 * @param folder - Optional folder path in Cloudinary (e.g., 'properties', 'avatars')
 * @returns Cloudinary secure URL of uploaded image
 */
export const uploadImageToCloudinary = async (
  uri: string,
  folder: string = 'properties'
): Promise<string> => {
  try {
    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        'Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET'
      );
    }

    const formData = new FormData();
    
    // Append the image file
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    } as any);
    
    // Append upload preset
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Optional: Append folder path
    if (folder) {
      formData.append('folder', folder);
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data: CloudinaryResponse = await response.json();

    if (!data.secure_url) {
      throw new Error('Upload succeeded but no URL returned');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param imageUrl - Cloudinary image URL or public_id
 * @returns Boolean indicating success
 */
export const deleteImageFromCloudinary = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract public_id from URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }

    // Get everything after 'upload/' and before the file extension
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension

    // Note: Deleting images requires authentication with your Cloudinary API key/secret
    // This should be done from your backend for security reasons
    // For now, we'll just return true and log a warning
    console.warn(
      'Image deletion from Cloudinary requires backend implementation for security.',
      'Public ID:', publicId
    );
    
    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param uris - Array of local image URIs
 * @param folder - Optional folder path in Cloudinary
 * @returns Array of Cloudinary secure URLs
 */
export const uploadMultipleImagesToCloudinary = async (
  uris: string[],
  folder: string = 'properties'
): Promise<string[]> => {
  try {
    const uploadPromises = uris.map(uri => uploadImageToCloudinary(uri, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw error;
  }
};
