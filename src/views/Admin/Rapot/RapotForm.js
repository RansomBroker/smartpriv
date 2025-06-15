import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

function RapotForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [state, setState] = useState({
    input: {
      siswa_id: "",
      mapel: "",
      bab: "",
      nilai: "",
      semester: "",
      catatan: "",
    },
  });

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setCurrentUser(userData);
    }
  }, []);

  useEffect(() => {
    const fetchSiswaList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user`);
        const siswaData = response.data.filter(
          (user) => user.level === "siswa"
        );
        setSiswaList(siswaData);
      } catch (error) {
        setError("Gagal mengambil data siswa");
      }
    };
    fetchSiswaList();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchRapotData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/rapot/${id}`);
          const rapot = response.data;
          setState({
            input: {
              siswa_id: rapot.userId || rapot.siswa_id, // Handle both field names
              mapel: rapot.mapel,
              bab: rapot.bab || "",
              nilai: rapot.nilai,
              semester: rapot.semester || "",
              catatan: rapot.catatan || "",
            },
          });
        } catch (error) {
          setError("Gagal mengambil data rapot");
        }
      };
      fetchRapotData();
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

    const payload = {
      userId: parseInt(state.input.siswa_id),
      mapel: state.input.mapel,
      bab: state.input.bab,
      nilai: parseFloat(state.input.nilai),
      semester: state.input.semester,
      catatan: state.input.catatan,
    };

    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/rapot/${id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/rapot`, payload);
      }

      // Navigate based on user role
      const basePath = currentUser?.level === "guru" ? "/guru" : "/office";
      navigate(`${basePath}/rapot_siswa`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get base path for navigation based on user role
  const basePath = currentUser?.level === "guru" ? "/guru" : "/office";

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>{isEdit ? "Edit Rapot Siswa" : "Tambah Rapot Siswa"}</h3>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <Row>
          <Col xs={12} md={7}>
            <Form onSubmit={handleSubmit}>
              {/* Siswa */}
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
                        {siswa.name || siswa.username}{" "}
                        {siswa.kelas ? `(${siswa.kelas})` : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              {/* Mapel */}
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

              {/* Bab */}
              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Bab
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="bab"
                    value={state.input.bab}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              {/* Nilai */}
              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Nilai
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    type="number"
                    name="nilai"
                    value={state.input.nilai}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                  />
                </Col>
              </Form.Group>

              {/* Semester */}
              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Semester
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="semester"
                    value={state.input.semester}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              {/* Catatan */}
              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={4}>
                  Catatan
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    as="textarea"
                    name="catatan"
                    value={state.input.catatan}
                    onChange={handleChange}
                    rows={3}
                  />
                </Col>
              </Form.Group>

              <Row>
                <Col md={{ span: 8, offset: 4 }}>
                  <Button type="submit" className="me-2" disabled={loading}>
                    <Save /> {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Link
                    to={`${basePath}/rapot_siswa`}
                    className="btn btn-outline-dark"
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

export default RapotForm;
