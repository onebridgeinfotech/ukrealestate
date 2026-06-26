const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export interface CloudinaryResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(
  file: File,
  folder = "marketuk/listings"
): Promise<{ result: CloudinaryResult | null; error: string | null }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  try {
    const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      return { result: null, error: err.error?.message ?? "Upload failed" };
    }
    const data = await res.json();
    return {
      result: {
        url: data.url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      },
      error: null,
    };
  } catch (e) {
    return { result: null, error: "Network error — please try again." };
  }
}

export async function uploadMultipleToCloudinary(
  files: File[],
  folder = "marketuk/listings",
  onProgress?: (done: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const { result } = await uploadToCloudinary(files[i], folder);
    if (result) urls.push(result.secureUrl);
    onProgress?.(i + 1, files.length);
  }
  return urls;
}

// Get an optimised delivery URL from a Cloudinary public ID
export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number; format?: string } = {}
): string {
  const { width, height, quality = 80, format = "auto" } = options;
  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    "c_fill",
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
