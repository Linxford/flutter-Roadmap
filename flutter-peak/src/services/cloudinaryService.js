import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  }
});

export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const timestamp = Math.round((new Date).getTime()/1000);
    const signature = generateSignature(publicId, timestamp);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return data;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.image(publicId)
    .format('auto')
    .quality('auto')
    .delivery('q_auto,f_auto')
    .toURL();
};
