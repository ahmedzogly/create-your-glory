import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "avatars";
const FILE_PATH = "profile/avatar.jpg";

export function useProfileImage(fallback: string) {
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(FILE_PATH);
    // Check if file exists by fetching with cache bust
    fetch(data.publicUrl + "?t=" + Date.now(), { method: "HEAD" })
      .then((res) => {
        if (res.ok) setImageUrl(data.publicUrl + "?t=" + Date.now());
      })
      .catch(() => {});
  }, []);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(FILE_PATH, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(FILE_PATH);
      setImageUrl(data.publicUrl + "?t=" + Date.now());
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return { imageUrl, uploading, upload };
}
