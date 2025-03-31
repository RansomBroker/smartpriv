import { Card, Col, Image, Row } from "react-bootstrap";

function AdminDashboard() {
  return (
    <div className="d-flex flex-column">
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
      <p className="fw-bold fs-4">Student Chart</p>
      {/* CHART IMAGE HERE */}
    </div>
  );
}
export default AdminDashboard;
