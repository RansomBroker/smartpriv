// src/utils/moodleTokenStorage.js
export function MoodleTokenStorage(username) {
  try {
    const tokens = JSON.parse(localStorage.getItem("moodleTokens") || "[]");
    const userToken = tokens.find((t) => t.username === username);
    return userToken?.token || null;
  } catch (err) {
    console.error("Gagal mengambil token dari localStorage:", err);
    return null;
  }
}
