import { useState } from "react";
import {
  Row,
  Container,
  Col,
  Image,
  FormGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    input: { username: "", password: "" },
  });
  const [error, setError] = useState(""); // State untuk pesan error

  // Simulasi data pengguna (nantinya bisa diganti dengan API dari backend)
  const users = [
    {
      id: 1,
      username: "admin",
      password: "admin",
      level: "admin",
      nama: "Administrator",
    },
    {
      id: 2,
      username: "guru",
      password: "guru",
      level: "guru",
      nama: "Bu Fetty",
    },
    {
      id: 3,
      username: "siswa",
      password: "siswa",
      level: "siswa",
      nama: "Fetty Ayu",
    },
  ];

  // Handle input perubahan
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      input: { ...prevState.input, [name]: value },
    }));
  };

  // Handle submit login
  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = users.find(
      (user) =>
        user.username === state.input.username &&
        user.password === state.input.password
    );

    if (foundUser) {
      // Simpan data pengguna ke localStorage
      localStorage.setItem("level", foundUser.level);
      localStorage.setItem("user_id", foundUser.id);
      localStorage.setItem("user_nama", foundUser.nama);

      // Redirect ke dashboard sesuai level
      if (foundUser.level === "siswa") {
        navigate(`/siswa/dashboard`);
      } else {
        navigate(`/office/dashboard/guru`);
      }
    } else {
      setError("Username atau Password salah!"); // Tampilkan error jika login gagal
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col xs={6} className="mx-auto">
          <div className="card-choose-login p-4">
            <div className="text-center">
              <h1>
                <strong>Log In</strong>
              </h1>
              <Image
                src={`/assets/images/smart_private.png`}
                fluid
                style={{ maxWidth: "200px" }}
              />
            </div>

            {/* Tampilkan error jika ada */}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="mt-3">
              <FormGroup className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  className="bg-transparent border-dark p-2"
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  className="bg-transparent border-dark p-2"
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <Row>
                <Col xs="4" className="mx-auto">
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="light"
                      className="rounded-pill p-2"
                    >
                      Masuk
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
