import { Card, Col, Image, Container, Row } from "react-bootstrap";

function AdminDashboard() {
  return (
    <div className="d-flex flex-column">
      <Row>
        <Col md={12} lg={8}>
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="bg-primary text-white text-center p-3">
                <Card.Body>
                  <h5>Total Siswa</h5>
                  <h3>14</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-warning text-white text-center p-3">
                <Card.Body>
                  <h5>Total Guru</h5>
                  <h3>4</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-success text-white text-center p-3">
                <Card.Body>
                  <h5>Total Kelas</h5>
                  <h3>6</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="w-100 mb-4">
            <Card.Body className="d-flex flex-column">
              <div className="w-full d-flex justify-content-center">
                <img src={`/assets/images/smart_private.png`} width={128} />
              </div>
              <p className="text-center fw-bold mb-1">
                Jl. Raya Kunir 01/03 Kec.Wonodadi Kab.Blitar Kode Pos 66155
              </p>
              <p className="text-center fw-bold">
                Instagram : @smartprivate.blitar
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={4}>
          <div className="w-100 d-flex justify-content-center">
            <img src={`/assets/images/pie.png`} />
          </div>
          <div className="w-100 d-flex justify-content-start mt-3">
            <ul className="w-100">
              <li className="text-primary">
                <div className="d-flex justify-content-between">
                  <span className="text-dark">Test Harian</span>
                  <span className="text-primary">20%</span>
                </div>
              </li>
              <li className="text-warning">
                <div className="d-flex justify-content-between">
                  <span className="text-dark">Tugas</span>
                  <span className="text-warning">20%</span>
                </div>
              </li>
              <li className="text-success">
                <div className="d-flex justify-content-between">
                  <span className="text-dark">Ujian Akhir Periode</span>
                  <span className="text-success">20%</span>
                </div>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
      <p className="fw-bold fs-4">Student Chart</p>
      {/* CHART IMAGE HERE */}
      <Container fluid>
        <Row className="g-4 mb-4">
          <Col>
            <div className="w-100 d-flex justify-content-center">
              <img src={`/assets/images/chart.png`} />
            </div>
          </Col>
          <Col>
            <div className="w-100 d-flex justify-content-center">
              <img src={`/assets/images/peta.png`} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default AdminDashboard;
