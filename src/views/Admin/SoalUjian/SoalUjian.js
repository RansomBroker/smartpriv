import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function SoalUjian() {

    const kelas = [1,2,3,4,5,6];

    return (<>

        <Row className="p-4">
            {
                kelas.map((v) => {
                    return <Col xs={6} md={4} className="my-4">
                        <Card>
                            <Card.Body>
                                <h3 className="fw-bold text-center my-5">{v}</h3>
                                <Link to={`/office/soal_ujian/${v}`} className="stretched-link"  />
                            </Card.Body>
                        </Card>
                    </Col>
                })
            }
        </Row>

    </>);
}
export default SoalUjian;