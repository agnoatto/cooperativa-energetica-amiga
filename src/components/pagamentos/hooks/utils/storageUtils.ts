
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "../constants";

export async function verifyBucketExists() {
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    throw new Error(`Erro ao verificar buckets: ${bucketError.message}`);
  }

  const bucketExists = buckets.some(b => b.name === STORAGE_BUCKET);
  if (!bucketExists) {
    throw new Error(`Bucket ${STORAGE_BUCKET} não encontrado`);
  }
}

export async function uploadFileToStorage(filePath: string, file: File) {
  return await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
}

export async function removeFileFromStorage(filePath: string) {
  return await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);
}

export async function createFileSignedUrl(filePath: string, expirySeconds: number) {
  return await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, expirySeconds);
}
