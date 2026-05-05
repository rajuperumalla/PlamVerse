import { api } from "./api";

export async function getSignedUploadUrl(filename: string, mime: string) {
  const { data } = await api.post("/uploads/sign", { filename, mime });
  return data as { uploadUrl: string; publicUrl: string };
}

export async function uploadImage(uri: string, filename: string) {
  const mime = "image/jpeg";
  const { uploadUrl, publicUrl } = await getSignedUploadUrl(filename, mime);
  const res = await fetch(uri);
  const blob = await res.blob();
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": mime },
    body: blob,
  });
  return publicUrl;
}
