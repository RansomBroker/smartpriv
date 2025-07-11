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

function SiswaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    input: {
      username: "",
      password: "",
      password_confirmation: "",
      nama_user: "",
      nohp: "",
      alamat: "",
      level: "siswa",
      kelas: "", // This field won't be submitted to API
    },
  });

  // Fetch siswa data if in edit mode
  useEffect(() => {
    if (isEdit) {
      const fetchSiswaData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/user/${id}`);
          const siswaData = response.data;
          setState((prev) => ({
            input: {
              ...prev.input,
              username: siswaData.username,
              nama_user: siswaData.name,
              nohp: siswaData.nohp,
              alamat: siswaData.alamat,
              kelas: siswaData.kelas || "", // Get kelas if it exists
            },
          }));
        } catch (error) {
          console.error("Error fetching siswa data:", error);
          setError("Gagal mengambil data siswa");
        }
      };
      fetchSiswaData();
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
      // Validate password confirmation
      if (
        !isEdit &&
        state.input.password !== state.input.password_confirmation
      ) {
        setError("Password dan konfirmasi password tidak sesuai");
        return;
      }

      const payload = { ...state.input };
      // Transform nama_user to name
      payload.name = payload.nama_user;
      delete payload.nama_user;

      // Remove fields that shouldn't be sent to API
      delete payload.password_confirmation;

      // Remove password if empty in edit mode
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/user/${id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/user`, payload);
      }

      navigate("/office/siswa");
    } catch (error) {
      console.error("Error saving siswa:", error);
      setError(
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>{isEdit ? "Edit Siswa" : "Tambah Siswa"}</h3>

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
                  Username
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="username"
                    value={state.input.username}
                    onChange={handleChange}
                    required
                    disabled={isEdit}
                  />
                </Col>
              </Form.Group>

              {!isEdit && (
                <>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column md={4}>
                      Password
                    </Form.Label>
                    <Col md={8}>
                      <Form.Control
                        type="password"
                        name="password"
                        value={state.input.password}
                        onChange={handleChange}
                        required={!isEdit}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column md={4}>
                      Konfirmasi Password
                    </Form.Label>
                    <Col md={8}>
                      <Form.Control
                        type="password"
                        name="password_confirmation"
                        value={state.input.password_confirmation}
                        onChange={handleChange}
                        required={!isEdit}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              {isEdit && (
                <Form.Group as={Row} className="mb-2">
                  <Form.Label column md={4}>
                    Password Baru (Opsional)
                  </Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="password"
                      name="password"
                      value={state.input.password}
                      onChange={handleChange}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                    />
                  </Col>
                </Form.Group>
              )}

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Nama
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="nama_user"
                    value={state.input.nama_user}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Kelas
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="kelas"
                    value={state.input.kelas}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  No HP
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="nohp"
                    value={state.input.nohp}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Alamat
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    as="textarea"
                    name="alamat"
                    value={state.input.alamat}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Row>
                <Col md={{ span: 8, offset: 4 }}>
                  <Button type="submit" className="me-2" disabled={loading}>
                    <Save /> {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Link className="btn btn-outline-dark" to="/office/siswa">
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

export default SiswaForm;
