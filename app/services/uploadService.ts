// services/uploadService.ts

export default async function uploadPhoto(photoUri: string, token?: string) {
  const formData = new FormData();
  formData.append("file", {
    uri: photoUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  const response = await fetch("http://172.16.46.27:8000/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // JWT only here
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");

  return await response.json();
}
