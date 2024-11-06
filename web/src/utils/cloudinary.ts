'use server';

import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getFile(publicID: string) {
  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = await cloudinary.url(publicID, {
    transformation: [
      {
        fetch_format: "auto",
        quality: "auto",
      },
      {
        width: 1200,
        height: 1200,
        crop: "fill",
        gravity: "auto:faces",
      },
    ],
  });
  return optimizeUrl;
}

export async function upload(formData: FormData) {
  // Upload an image
  const file = formData.get('avatar') as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  return await new Promise ((resolve, reject) => {
    cloudinary.uploader.upload_stream({folder:'avatar'}, function (error, result){
      if ( error ) {
        console.log("Error from cloudinary upload :",error);
        
        reject(error);
        return;
      }
      resolve(result);
    }).end(buffer);
  })
}

export async function deleteFile(url: string) {
  let trimmedURL = url.slice(
    url.indexOf("avatar"),
    url.indexOf("?_a=BAMAH2a40")
  );
  const result = await cloudinary.uploader.destroy(trimmedURL);
  if (result?.result == "ok") {
    return { success: true };
  }
  return { success: false };
}