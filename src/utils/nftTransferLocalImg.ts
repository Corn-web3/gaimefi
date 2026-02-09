import { uploadFile } from "@/services/gameService";

// Use fetch or axios to download image
async function downloadImage(ipfsUrl) {
  const response = await fetch(ipfsUrl);
  const blob = await response.blob();
  return blob;
}
async function uploadToServer(imageBlob) {
  const formData = new FormData();
  formData.append("file", imageBlob);

  const res = await uploadFile(formData);
  return res; // Return new image URL
}
export async function transferImage(ipfsUrl) {
  try {
    // Download IPFS image
    const imageBlob = await downloadImage(ipfsUrl);

    // Upload to own server
    const imgUrl = await uploadToServer(imageBlob);

    // Return new URL
    return imgUrl;
  } catch (error) {
    console.error("error", error);
  }
}
