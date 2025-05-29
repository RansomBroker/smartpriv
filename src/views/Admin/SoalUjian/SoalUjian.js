import React, { useState, useEffect, useCallback } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios"; // Import axios directly
import SoalUjianForm from "./SoalUjianForm";
import SoalUjianData from "./SoalUjianData";

// Define API base URL directly in the component or use environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const SoalUjian = () => {
  const params = useParams();
  const [soalList, setSoalList] = useState([]);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const kelasIdFromUrl = params.kelas;

  const fetchSoalUjian = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/soal`);
      setSoalList(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch exam questions.");
      setSoalList([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSoalUjian();
  }, [fetchSoalUjian]);

  const handleAddSoal = async (soalData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/soal`, soalData);
      const newSoal = response.data;
      setSoalList((prevList) => [...prevList, newSoal]);
      setIsFormVisible(false);
      setSelectedSoal(null);
    } catch (err) {
      setError(err.message || "Failed to add exam question.");
    }
    setIsLoading(false);
  };

  const handleEditSoal = (soal) => {
    setSelectedSoal(soal);
    setIsFormVisible(true);
  };

  const handleUpdateSoal = async (updatedSoal) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/soal/${updatedSoal.id}`,
        updatedSoal
      );
      const returnedUpdatedSoal = response.data;
      setSoalList((prevList) =>
        prevList.map((s) =>
          s.id === returnedUpdatedSoal.id ? returnedUpdatedSoal : s
        )
      );
      setSelectedSoal(null);
      setIsFormVisible(false);
    } catch (err) {
      setError(err.message || "Failed to update exam question.");
    }
    setIsLoading(false);
  };

  const handleDeleteSoal = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam question?")) {
      setIsLoading(true);
      setError(null);
      try {
        await axios.delete(`${API_BASE_URL}/api/soal/${id}`);
        setSoalList((prevList) => prevList.filter((s) => s.id !== id));
      } catch (err) {
        setError(err.message || "Failed to delete exam question.");
      }
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    if (isFormVisible) {
      setSelectedSoal(null);
    }
    setIsFormVisible(!isFormVisible);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setSelectedSoal(null);
  };

  const kelasOptions = [1, 2, 3, 4, 5, 6];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manajemen Soal Ujian</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {kelasIdFromUrl ? (
        <>
          <button
            className="btn btn-primary mb-3"
            onClick={toggleFormVisibility}
          >
            {isFormVisible
              ? `Tutup Form Soal Kelas ${kelasIdFromUrl}`
              : `Tambah Soal Ujian Kelas ${kelasIdFromUrl}`}
          </button>

          {isFormVisible && (
            <SoalUjianForm
              onSubmit={selectedSoal ? handleUpdateSoal : handleAddSoal}
              initialData={
                selectedSoal || {
                  kelas: kelasIdFromUrl,
                  link_soal: "",
                  judul: "",
                }
              }
              isLoading={isLoading}
              onCancel={closeForm}
            />
          )}

          {isLoading ? (
            <p className="text-info">Loading data...</p>
          ) : (
            !error && (
              <SoalUjianData
                soalList={soalList}
                onEdit={handleEditSoal}
                onDelete={handleDeleteSoal}
              />
            )
          )}
        </>
      ) : (
        <>
          {isLoading && <p className="text-info">Loading data...</p>}
          {!isLoading && !error && (
            <>
              <p>Silakan pilih kelas untuk mengelola soal ujian:</p>
              <Row className="p-2">
                {kelasOptions.map((v) => (
                  <Col key={v} xs={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100 text-center shadow-sm">
                      <Card.Body className="d-flex flex-column justify-content-center">
                        <Card.Title as="h4" className="fw-bold my-3">
                          Kelas {v}
                        </Card.Title>
                        <Link
                          to={`/office/soal_ujian/${v}`}
                          className="stretched-link"
                          aria-label={`Lihat soal ujian kelas ${v}`}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SoalUjian;
