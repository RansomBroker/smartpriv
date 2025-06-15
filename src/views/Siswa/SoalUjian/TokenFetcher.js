export async function fetchMoodleTokens(usernames) {
  try {
    const res = await fetch("/api/moodle-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames }),
    });

    const data = await res.json();
    localStorage.setItem("moodleTokens", JSON.stringify(data.results));
    return data.results;
  } catch (err) {
    console.error("Gagal ambil token Moodle:", err);
    return [];
  }
}
