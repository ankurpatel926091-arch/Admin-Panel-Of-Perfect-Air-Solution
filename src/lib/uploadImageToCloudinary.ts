// Utility to upload an image file to Cloudinary from the frontend
// Usage: const url = await uploadImageToCloudinary(file)

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary config missing');
  }
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.secure_url;
}
