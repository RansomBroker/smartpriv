import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id" // Corrected: No trailing /api
    : ""; // For development, proxy will be used

function PrestasiForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [state, setState] = useState({
    input: {
      siswa_id: "",
      prestasi: "",
    },
  });

  // Fetch siswa list for dropdown
  useEffect(() => {
    const fetchSiswaList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user`);
        // Filter users with level "siswa"
        const siswaData = response.data.filter(
          (user) => user.level === "siswa"
        );
        setSiswaList(siswaData);
      } catch (error) {
        console.error("Error fetching siswa list:", error);
        setError("Gagal mengambil data siswa");
      }
    };
    fetchSiswaList();
  }, []);

  // Fetch prestasi data if in edit mode
  useEffect(() => {
    if (isEdit) {
      const fetchPrestasiData = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/prestasi/${id}`
          );
          const prestasiData = response.data;
          setState((prev) => ({
            input: {
              ...prev.input,
              siswa_id: prestasiData.siswa_id,
              prestasi: prestasiData.prestasi,
            },
          }));
        } catch (error) {
          console.error("Error fetching prestasi data:", error);
          setError("Gagal mengambil data prestasi");
        }
      };
      fetchPrestasiData();
    }
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
    setError("");
    setLoading(true);

    try {
      const userId = parseInt(state.input.siswa_id);
      // Find the selected student from siswaList using the parsed userId
      const selectedSiswa = siswaList.find(
        (siswa) => parseInt(siswa.id) === userId
      );

      if (!selectedSiswa) {
        throw new Error("Data siswa tidak ditemukan");
      }

      // Create payload with transformed data
      const payload = {
        userId: userId,
        name: selectedSiswa.name, // Get name directly from the found student
        prestasi: state.input.prestasi,
      };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/prestasi/${id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/prestasi`, payload);
      }

      navigate("/office/prestasi_siswa");
    } catch (error) {
      console.error("Error saving prestasi:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>{isEdit ? "Edit Prestasi Siswa" : "Tambah Prestasi Siswa"}</h3>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <Row>
          <Col xs={12} md={7}>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Siswa
                </Form.Label>
                <Col md={8}>
                  <Form.Select
                    name="siswa_id"
                    value={state.input.siswa_id}
                    onChange={handleChange}
                    required
                    disabled={isEdit}
                  >
                    <option value="">Pilih Siswa</option>
                    {siswaList.map((siswa) => (
                      <option key={siswa.id} value={siswa.id}>
                        {siswa.name} {siswa.kelas ? `(${siswa.kelas})` : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Prestasi
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    as="textarea"
                    name="prestasi"
                    value={state.input.prestasi}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </Col>
              </Form.Group>

              <Row>
                <Col md={{ span: 8, offset: 4 }}>
                  <Button type="submit" className="me-2" disabled={loading}>
                    <Save /> {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Link
                    className="btn btn-outline-dark"
                    to="/office/prestasi_siswa"
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

export default PrestasiForm;
