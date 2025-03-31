import { Row, Container, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <Container>
      <Row>
        <Col xs={8} className="mx-auto">
          <Row>
            <Col xs={10} md={8} className="mx-auto text-center">
              <Image src={`/assets/images/smart_private.png`} fluid />
            </Col>
          </Row>

          <Row className="d-flex justify-content-between">
            <Col xs="4">
              <Link
                to={`/login`}
                className="d-flex flex-column align-items-center card-choose-login text-dark"
              >
                <Image src={`/assets/images/admin.png`} fluid />
                <span className="h5 fw-bolder">Admin</span>
              </Link>
            </Col>
            <Col xs="4">
              <Link
                to={`/login`}
                className="d-flex flex-column align-items-center card-choose-login text-dark"
              >
                <Image src={`/assets/images/guru.png`} fluid />
                <span className="h5 fw-bolder">Guru</span>
              </Link>
            </Col>
            <Col xs="4">
              <Link
                to={`/login`}
                className="d-flex flex-column align-items-center card-choose-login text-dark"
              >
                <Image src={`/assets/images/siswa.png`} fluid />
                <span className="h5 fw-bolder">Siswa</span>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
