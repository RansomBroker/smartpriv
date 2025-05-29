import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : ""; // For development, proxy will be used

export default function SoalUjianEditForm() {
  const { kelas, id } = useParams(); // Get kelas and id from URL
  const navigate = useNavigate();
  const [state, setState] = useState({
    input: {
      mapel: "",
      judul: "",
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
        // Assuming the API returns kelas as well, otherwise it's already available from useParams
        setState({
          input: {
            mapel: data.mapel,
            judul: data.judul,
            link_soal: data.link_soal,
          },
        });
      } catch (e) {
        console.error("Failed to fetch Soal Ujian data:", e);
        setError(e.message);
        // Optionally, redirect or show a more prominent error message
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSoalData();
    }
  }, [id]);

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
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...state.input, // Send all fields from state.input
          kelas: kelas, // Ensure kelas is included from the URL param
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
        setError(
          errorData.message ||
            "Gagal memperbarui data. Status: " + response.statusText
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Terjadi kesalahan saat memperbarui data.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // if (error) { // Optional: render a more prominent error message or component
  //   return <p>Error loading data: {error}</p>;
  // }

  return (
    <>
      <Card>
        <Card.Body className="p-4">
          <h3>Edit Soal Ujian Kelas {kelas}</h3>
          {error && <p className="text-danger">{error}</p>}
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
                      name="link_soal" // Ensure this matches state and payload
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
    </>
  );
}
