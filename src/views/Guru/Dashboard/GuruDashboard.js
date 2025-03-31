import { Button, Card, Col, Dropdown, Image, Row } from "react-bootstrap";
import { Mortarboard, Person } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
function GuruDashboard() {
    return (
        <div>

            <div className="w-100 p-4">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <h1>Welcome, <span className="fw-bolder">Guru</span></h1>
                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="rounded-pill">
                            <Person/>
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
                            <Card.Body className="py-4">
                                <Row>
                                    <Col>
                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div><Image src={`/assets/images/siswa_.png`} fluid style={{ maxWidth: '4rem' }} /></div>
                                            <div className="d-flex flex-column text-center">
                                                <h5>Total Siswa</h5>
                                                <h3>4</h3>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="w-100 align-items-center my-auto">
                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div><Image src={`/assets/images/guru_.png`} fluid style={{ maxWidth: '4rem' }} /></div>
                                            <div className="d-flex flex-column text-center">
                                                <h5>Total Guru</h5>
                                                <h3>2</h3>
                                            </div>
                                        </div>
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
export default GuruDashboard;