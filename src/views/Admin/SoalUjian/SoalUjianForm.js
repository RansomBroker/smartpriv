import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

// Mapel SD
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

export default function SoalUjianForm() {
  const { kelas } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    input: {
      mapel: "",
      link_soal: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      input: {
        ...prevState.input,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapel: state.input.mapel,
          link_soal: state.input.link_soal,
          judul: state.input.mapel, // Kirim default "-" karena field wajib di BE
          kelas: kelas,
        }),
      });

      if (response.ok) {
        console.log("Data submitted successfully!");
        navigate(`/office/soal_ujian/${kelas}`);
      } else {
        console.error("Error submitting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>Tambah Soal Ujian Kelas {kelas}</h3>
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
                    <Save /> Simpan
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
