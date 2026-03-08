import { urls } from "../config/urls";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const hostImg = async (file: File) => {
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", file);
    const response = await fetch(urls.imgbb, {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
}