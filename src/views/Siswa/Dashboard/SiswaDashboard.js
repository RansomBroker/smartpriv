import { Card, Col, Dropdown, Image, Row } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
function SiswaDashboard() {
    return (
        <div>

            <div className="w-100 p-4">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <h1>Welcome, <span className="fw-bolder">Student</span></h1>
                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="rounded-pill">
                            <Person />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="/">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Row>
                    <Col md="6">
                        <Card>
                            <Card.Body className="align-items-center text-center">
                                <Image src={`/assets/images/smart_private.png`} fluid />
                                <p>Jl. Raya Kunir  01/03 Kec.Wonodadi Kab.Blitar Kode Pos 66155<br />
                                    Instagram : @smartprivate.blitar</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="6" className="my-auto">
                        <Card>
                            <Card.Body style={{ margin: `2rem 0` }}>
                                <Row>
                                    <Col>
                                        <Card className="border-0 bg-grey">
                                            <Card.Body>
                                                <div className="d-flex flex-row justify-content-center gap-4 align-items-center">
                                                    <div><Image src={`/assets/images/siswa_.png`} fluid style={{ maxWidth: '4rem' }} /></div>
                                                    <h5>Soal Ujian</h5>
                                                </div>
                                                <Link to={`/siswa/soal_ujian`} className="stretched-link" />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card className="border-0 bg-grey">
                                            <Card.Body>
                                                <div className="d-flex flex-row justify-content-center gap-4 align-items-center">
                                                    <div><Image src={`/assets/images/guru_.png`} fluid style={{ maxWidth: '4rem' }} /></div>
                                                    <h5>Rekap Absen</h5>
                                                    <Link to={`/siswa/absensi`} className="stretched-link" />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div className="d-flex flex-row justify-content-between align-items-center">



                </div>
            </div>
        </div>
    )
}
export default SiswaDashboard;