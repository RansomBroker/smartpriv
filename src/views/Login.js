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
import { useAuth } from "../libs/auth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [state, setState] = useState({
    input: { username: "", password: "" },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      input: { ...prevState.input, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(state.input.username, state.input.password);
      
      if (result.success) {
        const user = result.user;
        
        // Store user data in localStorage for backward compatibility
        localStorage.setItem("level", user.level);
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_nama", user.nama);
        
        if (user.level === "guru") {
          localStorage.setItem("user_nohp", user.nohp);
          localStorage.setItem("user_alamat", user.alamat);
        }

        // Redirect based on user level
        if (user.level === "siswa") {
          navigate(`/siswa/dashboard`);
        } else if (user.level === "guru") {
          navigate(`/guru/dashboard`);
        } else {
          navigate(`/office/dashboard`);
        }
      } else {
        setError(result.error || "Username atau Password salah!");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
              </FormGroup>

              <Row className="mb-3">
                <Col xs="4" className="mx-auto">
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="light"
                      className="rounded-pill p-2"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Masuk"}
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
