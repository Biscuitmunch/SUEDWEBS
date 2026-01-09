export const BASE_URL =
  window.location.hostname === "elsie.cafe"
    ? "https://api.elsie.cafe"
    : import.meta.env.VITE_API_URL;
