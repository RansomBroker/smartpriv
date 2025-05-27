import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { useAuth } from "../../../libs/auth";
import axios from "axios";

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id/api"
    : ""; // For development, proxy will be used

function GuruProfile() {
  const { user: authUser } = useAuth(); // Rename to authUser to be clear it's from auth
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [state, setState] = useState({
    input: {
      username: "",
      name: "",
      nohp: "",
      alamat: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Fetch user data from API using ID from auth
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser?.id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/user/${authUser.id}`
          );
          setUserData(response.data);
          setState((prev) => ({
            input: {
              ...prev.input,
              username: response.data.username || "",
              name: response.data.name || "",
              nohp: response.data.nohp || "",
              alamat: response.data.alamat || "",
            },
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Gagal mengambil data user");
        }
      }
    };
    fetchUserData();
  }, [authUser?.id]);

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
    setSuccess("");
    setLoading(true);

    try {
      // Create payload without empty password
      const payload = { ...state.input };
      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/user/${authUser.id}`,
        payload
      );
      setUserData(response.data); // Update local user data with response
      setSuccess("Data berhasil diperbarui");

      // Clear password fields after successful update
      setState((prev) => ({
        input: {
          ...prev.input,
          password: "",
          password_confirmation: "",
        },
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <Card>
        <Card.Body className="p-4">
          <div>Loading...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>Profil Guru</h3>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mt-3">
            {success}
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
                    disabled
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Nama
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    name="name"
                    value={state.input.name}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  No. HP
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
                    rows={3}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2">
                <Form.Label column md={4}>
                  Password Baru
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
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                  />
                </Col>
              </Form.Group>

              <Row>
                <Col md={{ span: 8, offset: 4 }}>
                  <Button type="submit" className="me-2" disabled={loading}>
                    <Save /> {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default GuruProfile;
