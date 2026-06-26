import { supabase } from "./supabase";

export async function uploadListingImage(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("listing-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("listing-images").getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export async function uploadMultipleImages(userId: string, files: File[]): Promise<string[]> {
  const results = await Promise.all(files.map((f) => uploadListingImage(userId, f)));
  return results.filter((r) => r.url).map((r) => r.url as string);
}

export async function deleteListingImage(url: string): Promise<void> {
  const path = url.split("/listing-images/")[1];
  if (path) await supabase.storage.from("listing-images").remove([path]);
}

export async function uploadListingDocument(userId: string, file: File, docType: string): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${docType}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("listing-documents")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) return { url: null, error: error.message };

  const { data } = await supabase.storage.from("listing-documents").createSignedUrl(fileName, 3600);
  return { url: data?.signedUrl ?? null, error: null };
}
