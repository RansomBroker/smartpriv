import React, { useState, useEffect } from "react";

const SoalUjianForm = ({ onSubmit, initialData, isLoading, onCancel }) => {
  const [formData, setFormData] = useState({
    link_soal: "",
    kelas: "1", // Default kelas
    judul: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form when initialData is not provided (for new entries)
      setFormData({ link_soal: "", kelas: "1", judul: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.link_soal || !formData.judul || !formData.kelas) {
      alert("Semua field harus diisi!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">
          {initialData ? "Edit Soal Ujian" : "Tambah Soal Ujian Baru"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="judul" className="form-label">
              Judul Soal
            </label>
            <input
              type="text"
              className="form-control"
              id="judul"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="link_soal" className="form-label">
              Link Soal
            </label>
            <input
              type="url"
              className="form-control"
              id="link_soal"
              name="link_soal"
              value={formData.link_soal}
              onChange={handleChange}
              placeholder="https://example.com/soal/matematika-bab-1"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="kelas" className="form-label">
              Kelas
            </label>
            <select
              className="form-select"
              id="kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={String(k)}>{`Kelas ${k}`}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-success me-2"
            disabled={isLoading}
          >
            {isLoading
              ? "Menyimpan..."
              : initialData
              ? "Update Soal"
              : "Simpan Soal"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
};

export default SoalUjianForm;
