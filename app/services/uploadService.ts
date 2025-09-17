export default async function uploadPhoto(uri: string) {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as any);

  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = await response.json();
    console.log("Upload success:", result);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
