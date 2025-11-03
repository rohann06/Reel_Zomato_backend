import dotenv from "dotenv";
dotenv.config();

import ImageKit, { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

export const uploadFile = async (file, fileName) => {
  try {
    const response = await client.files.upload({
      file: await toFile(file, fileName),
      fileName,
    });

    console.log("File uploaded:", response);

    // ✅ Make sure to return response
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
