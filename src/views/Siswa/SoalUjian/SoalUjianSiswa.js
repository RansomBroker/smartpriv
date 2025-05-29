import React, { useState, useEffect, useCallback } from "react";
import SoalUjianDataSiswa from "./SoalUjianDataSiswa";
// import api from '../../../services/api'; // Assuming you have an API service utility

const SoalUjianSiswa = () => {
  const [soalList, setSoalList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSoalUjian = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await api.get('/api/soall'); // Replace with actual API call
      // Mock data for now, ensure it matches the structure expected by SoalUjianDataSiswa
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
      {isLoading && <p>Memuat soal...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && <SoalUjianDataSiswa soalList={soalList} />}
    </div>
  );
};

export default SoalUjianSiswa;
