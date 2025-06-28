import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { Blob } from 'buffer'

export const configureCloudinary = () => {
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

configureCloudinary()

export const uploadToCloudinary = async (foto: Blob, folder: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}.jpg`;
    const bufferData = Buffer.from(await foto.arrayBuffer());

    const cloudinaryResult: UploadApiResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${bufferData.toString('base64')}`, 
      {
        folder: `exploreease/${folder}`,
        public_id: fileName,
      }
    );

    return cloudinaryResult.secure_url;
  } catch (error) {
    throw new Error(`Error uploading image to Cloudinary`);
  }
};