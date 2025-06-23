import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

const mapelSD = [
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika",
  "IPAS",
  "SBDP",
  "PPKn",
  "PJOK",
  "Al-Qur'an Hadist",
  "Aqidah Akhlaq",
  "Bahasa Arab",
  "Fiqih",
  "Bahasa Jawa",
  "Seni Kebudayaan Islam",
  "Perpustakaan",
  "Aswaja",
  "Sempoa"
];

export default function SoalUjianEditForm() {
  const { kelas, id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    input: {
      mapel: "",
      link_soal: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSoalData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/soal/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setState({
          input: {
            mapel: data.mapel || "",
            link_soal: data.link_soal || "",
          },
        });
      } catch (e) {
        console.error("Failed to fetch Soal Ujian data:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSoalData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      input: {
        ...prev.input,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapel: state.input.mapel,
          link_soal: state.input.link_soal,
          judul: state.input.mapel, // tetap dikirim meskipun tidak ditampilkan
          kelas: kelas,
        }),
      });

      if (response.ok) {
        console.log("Data updated successfully!");
        navigate(`/office/soal_ujian/${kelas}`);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Gagal memperbarui data" }));
        console.error("Error updating data:", response.statusText, errorData);
        setError(errorData.message || "Gagal memperbarui data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Terjadi kesalahan saat memperbarui data.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>Edit Soal Ujian Kelas {kelas}</h3>
        {error && <p className="text-danger">{error}</p>}
        <Row>
          <Col xs={12} md={7}>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>Mapel</Form.Label>
                <Col md={8}>
                  <Form.Select
                    name="mapel"
                    value={state.input.mapel}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Pilih Mata Pelajaran</option>
                    {mapelSD.map((mapel, index) => (
                      <option key={index} value={mapel}>
                        {mapel}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>Link Soal</Form.Label>
                <Col md={8}>
                  <Form.Control
                    as="textarea"
                    name="link_soal"
                    value={state.input.link_soal}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Row>
                <Col md={{ span: 8, offset: 4 }}>
                  <Button type="submit" className="me-2">
                    <Save /> Simpan Perubahan
                  </Button>
                  <Link
                    className="btn btn-outline-dark"
                    to={`/office/soal_ujian/${kelas}`}
                  >
                    Batal
                  </Link>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
