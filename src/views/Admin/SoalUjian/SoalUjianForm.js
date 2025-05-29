import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : ""; // For development, proxy will be used

export default function SoalUjianForm() {
  const { kelas } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    input: {},
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
          link_soal: state.input.link_soal,
          kelas: kelas,
          judul: state.input.judul,
          mapel: state.input.mapel,
        }),
      });

      if (response.ok) {
        // Handle successful submission, e.g., redirect or show a success message
        console.log("Data submitted successfully!");
        // You might want to redirect the user, for example:
        navigate(`/office/soal_ujian/${kelas}`);
      } else {
        // Handle errors
        console.error("Error submitting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <Card>
        <Card.Body className="p-4">
          <h3>Tambah Soal Ujian Kelas {kelas}</h3>
          <Row>
            <Col xs={12} md={7}>
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-2">
                  <Form.Label column md={4}>
                    Mapel
                  </Form.Label>
                  <Col md={8}>
                    <Form.Control
                      name="mapel"
                      value={state.input.mapel}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-2">
                  <Form.Label column md={4}>
                    Judul
                  </Form.Label>
                  <Col md={8}>
                    <Form.Control
                      name="judul"
                      value={state.input.judul}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-2">
                  <Form.Label column md={4}>
                    Link Soal
                  </Form.Label>
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
    </>
  );
}
