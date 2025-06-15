import React, { useState, useEffect, useCallback } from "react";
import SoalUjianDataSiswa from "./SoalUjianDataSiswa";
import { MoodleTokenStorage } from "../../../utils/moodleTokenStorage";

const SoalUjianSiswa = () => {
  const [soalList, setSoalList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Simulasi user yang login
  const currentUsername = "fetty"; // Ganti sesuai username siswa yang login

  // Simpan token manual ke localStorage sekali saja
  useEffect(() => {
    const manualTokens = [
      { username: "fetty", token: "e8359ff974ab7ce969bc3414398c8a46" },
      { username: "azkayla", token: "93ca2049926f6758381bd272adae99f5" },
    ];
    localStorage.setItem("moodleTokens", JSON.stringify(manualTokens));
    localStorage.setItem("loggedInUser", currentUsername);
  }, []);

  // Ambil token Moodle berdasarkan username
  useEffect(() => {
    const token = MoodleTokenStorage(currentUsername);
    setToken(token);
    console.log("Token Moodle untuk", currentUsername, ":", token);
  }, [currentUsername]);

  const fetchSoalUjian = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mockData = [
        {
          id: "1",
          link_soal: "https://example.com/soal/matematika-bab-1",
          kelas: "1",
          judul: "Matematika Bab 1 - Persamaan Kuadrat",
        },
        {
          id: "2",
          link_soal: "https://example.com/soal/fisika-bab-1",
          kelas: "2",
          judul: "Fisika Bab 1 - Gerak Lurus",
        },
        {
          id: "3",
          link_soal: "https://example.com/soal/matematika-bab-2",
          kelas: "1",
          judul: "Matematika Bab 2 - Fungsi Kuadrat",
        },
        {
          id: "4",
          link_soal: "https://example.com/soal/kimia-bab-1",
          kelas: "3",
          judul: "Kimia Bab 1 - Stoikiometri",
        },
      ];
      setSoalList(mockData);
    } catch (err) {
      setError(err.message || "Gagal memuat soal ujian.");
      setSoalList([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSoalUjian();
  }, [fetchSoalUjian]);

  return (
    <div className="container mt-4">
      <h2>Daftar Soal Ujian</h2>
      {token && <p><strong>Token Moodle:</strong> {token}</p>}
      {isLoading && <p>Memuat soal...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && <SoalUjianDataSiswa soalList={soalList} />}
    </div>
  );
};

export default SoalUjianSiswa;
