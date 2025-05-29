import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../../libs/auth"; // Corrected path

function SoalUjian() {
  const kelas = [1, 2, 3, 4, 5, 6];
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading user information...</p>; // Or some other loading indicator
  }

  if (!user) {
    return <p>User not found. Please log in.</p>; // Or redirect to login
  }

  let basePath = "";
  if (user.level === "admin") {
    basePath = "/office";
  } else if (user.level === "guru") {
    basePath = "/guru";
  } else if (user.level === "siswa") {
    basePath = "/siswa";
  }
  // It might be good to have a default or error case if user.level is unexpected

  return (
    <>
      <Row className="p-4">
        {kelas.map((v, index) => {
          // Added index for key
          return (
            <Col xs={6} md={4} className="my-4" key={index}>
              {" "}
              {/* Added key prop */}
              <Card>
                <Card.Body>
                  <h3 className="fw-bold text-center my-5">{v}</h3>
                  {basePath && (
                    <Link
                      to={`${basePath}/soal_ujian/${v}`}
                      className="stretched-link"
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
export default SoalUjian;
