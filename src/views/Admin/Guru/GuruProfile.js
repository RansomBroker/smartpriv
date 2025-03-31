import { useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";

function GuruProfile() {

    const {id} = useParams;
    const [state, setState] = useState({
        input: {}
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

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return <>
        <Card>
            <Card.Body className="p-4">

                <h3>Data Guru</h3>
                <Row className="align-items-center">
                    <Col xs={12} md={7}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Nama</Form.Label>
                                <Col md={8}>
                                    <Form.Control name="nama" value={state.input.nama} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>No HP</Form.Label>
                                <Col md={8}>
                                    <Form.Control name="no_hp" value={state.input.no_hp} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Alamat</Form.Label>
                                <Col md={8}>
                                    <Form.Control as="textarea" name="alamat" value={state.input.alamat} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Row>
                                <Col md={{ span: 8, offset: 4 }}>
                                    <Button type="submit" className="me-2"><Save /> Simpan</Button>
                                    <Link className="btn btn-outline-dark" to={`/office/guru`}>Batal</Link>
                                </Col>
                            </Row>
                        </Form>

                    </Col>
                    <Col xs={12} md={5}>
                        <Image src={'/assets/images/guru_profile.png'} fluid />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </>
}
export default GuruProfile;