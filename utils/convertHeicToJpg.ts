import convert from "heic-convert";

/**
 * Converts HEIC/HEIF images to JPG format
 * @param file - The file to convert
 * @returns A new File object with JPG format, or the original file if not HEIC
 */
export async function convertHeicToJpg(file: File): Promise<File> {
  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");

  if (!isHeic) {
    return file;
  }

  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert HEIC to JPG
    const outputBuffer = await convert({
      buffer: buffer,
      format: "JPEG",
      quality: 0.9, // High quality JPG output
    });

    // Create new filename with .jpg extension
    const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");

    // Create a new File object with the converted data
    const convertedFile = new File([outputBuffer], newFileName, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });

    return convertedFile;
  } catch (error) {
    console.error("Error converting HEIC to JPG:", error);
    throw new Error(`Failed to convert HEIC image: ${error}`);
  }
}
