import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";

function PrestasiForm() {

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

                <h3>Tambah Data Prestasi Siswa</h3>
                <Row>
                    <Col xs={12} md={7}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Nama</Form.Label>
                                <Col md={8}>
                                    <Form.Control name="nama_siswa" value={state.input.nama_siswa} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Prestasi</Form.Label>
                                <Col md={8}>
                                    <Form.Control as="textarea" name="prestasi" value={state.input.prestasi} onChange={handleChange} required />
                                </Col>
                            </Form.Group>
                            <Row>
                                <Col md={{ span: 8, offset: 4 }}>
                                    <Button type="submit" className="me-2"><Save /> Simpan</Button>
                                    <Link className="btn btn-outline-dark" to={`/office/prestasi_siswa`}>Batal</Link>
                                </Col>
                            </Row>
                        </Form>

                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </>
}
export default PrestasiForm;