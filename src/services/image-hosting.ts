import { url } from "../config/urls";

export const hostImg = async (file: File) => {
    const IMGBB_API_KEY = "6334163a0374179bfb370aa8c864041d";
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", file);
    const response = await fetch(url.imgbb, {
        method: "POST",
        body: formData,
    });
    const data = await response.json();

    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
}