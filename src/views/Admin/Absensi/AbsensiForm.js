import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";

export default function AbsensiForm() {
    const [state, setState] = useState({
        input: {},
        siswa: [
            {
                siswa_id: 1,
                tanggal: '',
                nama: 'Andre',
                h: false,
                i: false,
                s: false
            },
            {
                siswa_id: 2,
                tanggal: '',
                nama: 'Damara',
                h: false,
                i: false,
                s: false
            },
            {
                siswa_id: 3,
                tanggal: '',
                nama: 'Rafli',
                h: false,
                i: false,
                s: false
            },
            {
                siswa_id: 4,
                tanggal: '',
                nama: 'Kenzho',
                h: false,
                i: false,
                s: false
            },
        ]
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [name]: value,
            }
        }))
    }

    return (
        <Row>
            <Col xs={12} md={5} className="mx-auto">
                <Card>
                    <Card.Body className="p-4">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control name="tanggal" onChange={handleChange} value={state.input.tanggal} type="date" />
                            </Form.Group>
                            {
                                state.siswa.map((val, key) => {
                                    return <>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-success">{val.nama}</Form.Label>
                                            <div key={`abs${val.siswa_id}`}>
                                                <Form.Check name={`abs-${val.siswa_id}`} inline label="H" type="radio" />
                                                <Form.Check name={`abs-${val.siswa_id}`} inline label="I" type="radio" />
                                                <Form.Check name={`abs-${val.siswa_id}`} inline label="S" type="radio" />
                                            </div>
                                        </Form.Group>
                                    </>
                                })
                            }

                            <div className="d-grid">
                                <Button className="btn btn-success">Selesai</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}