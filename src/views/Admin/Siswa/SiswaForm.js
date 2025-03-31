import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";

function SiswaForm() {
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

                <h3>Tambah Siswa</h3>
                <Row>
                    <Col xs={12} md={7}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Username</Form.Label>
                                <Col md={8}>
                                    <Form.Control name="uname" value={state.input.uname} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Password</Form.Label>
                                <Col md={8}>
                                    <Form.Control type="password" name="passw" value={state.input.passw} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Konfirmasi Password</Form.Label>
                                <Col md={8}>
                                    <Form.Control type="password" name="passw_konf" value={state.input.passw_konf} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
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
                                    <Link className="btn btn-outline-dark" to={`/office/siswa`}>Batal</Link>
                                </Col>
                            </Row>
                        </Form>

                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </>
}
export default SiswaForm;