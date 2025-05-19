import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { Save } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function GuruForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        input: {
            username: "",
            password: "",
            password_confirmation: "",
            nama_user: "",
            nohp: "",
            alamat: "",
            level: "guru"
        }
    });

    // Fetch guru data if in edit mode
    useEffect(() => {
        if (isEdit) {
            const fetchGuruData = async () => {
                try {
                    const response = await axios.get(`/api/user/${id}`);
                    const guruData = response.data;
                    setState(prev => ({
                        input: {
                            ...prev.input,
                            username: guruData.username,
                            nama_user: guruData.name,
                            nohp: guruData.nohp,
                            alamat: guruData.alamat
                        }
                    }));
                } catch (error) {
                    console.error('Error fetching guru data:', error);
                    setError('Gagal mengambil data guru');
                }
            };
            fetchGuruData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            input: {
                ...prev.input,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validate password confirmation
            if (!isEdit && state.input.password !== state.input.password_confirmation) {
                setError("Password dan konfirmasi password tidak sesuai");
                return;
            }

            const payload = { ...state.input };
            // Transform nama_user to name
            payload.name = payload.nama_user;
            delete payload.nama_user;
            
            // Remove password_confirmation from payload
            delete payload.password_confirmation;
            
            // Remove password if empty in edit mode
            if (isEdit && !payload.password) {
                delete payload.password;
            }

            if (isEdit) {
                await axios.put(`/api/user/${id}`, payload);
            } else {
                await axios.post('/api/user', payload);
            }

            navigate('/office/guru');
        } catch (error) {
            console.error('Error saving guru:', error);
            setError(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Card.Body className="p-4">
                <h3>{isEdit ? 'Edit Guru' : 'Tambah Guru'}</h3>
                
                {error && (
                    <Alert variant="danger" className="mt-3">
                        {error}
                    </Alert>
                )}

                <Row>
                    <Col xs={12} md={7}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Username</Form.Label>
                                <Col md={8}>
                                    <Form.Control 
                                        name="username" 
                                        value={state.input.username} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={isEdit}
                                    />
                                </Col>
                            </Form.Group>

                            {!isEdit && (
                                <>
                                    <Form.Group as={Row} className="mb-2">
                                        <Form.Label column md={4}>Password</Form.Label>
                                        <Col md={8}>
                                            <Form.Control 
                                                type="password" 
                                                name="password" 
                                                value={state.input.password} 
                                                onChange={handleChange} 
                                                required={!isEdit}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2">
                                        <Form.Label column md={4}>Konfirmasi Password</Form.Label>
                                        <Col md={8}>
                                            <Form.Control 
                                                type="password" 
                                                name="password_confirmation" 
                                                value={state.input.password_confirmation} 
                                                onChange={handleChange} 
                                                required={!isEdit}
                                            />
                                        </Col>
                                    </Form.Group>
                                </>
                            )}

                            {isEdit && (
                                <Form.Group as={Row} className="mb-2">
                                    <Form.Label column md={4}>Password Baru (Opsional)</Form.Label>
                                    <Col md={8}>
                                        <Form.Control 
                                            type="password" 
                                            name="password" 
                                            value={state.input.password} 
                                            onChange={handleChange}
                                            placeholder="Kosongkan jika tidak ingin mengubah password"
                                        />
                                    </Col>
                                </Form.Group>
                            )}

                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Nama</Form.Label>
                                <Col md={8}>
                                    <Form.Control 
                                        name="nama_user" 
                                        value={state.input.nama_user} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>No HP</Form.Label>
                                <Col md={8}>
                                    <Form.Control 
                                        name="nohp" 
                                        value={state.input.nohp} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2">
                                <Form.Label column md={4}>Alamat</Form.Label>
                                <Col md={8}>
                                    <Form.Control 
                                        as="textarea" 
                                        name="alamat" 
                                        value={state.input.alamat} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Col>
                            </Form.Group>

                            <Row>
                                <Col md={{ span: 8, offset: 4 }}>
                                    <Button 
                                        type="submit" 
                                        className="me-2" 
                                        disabled={loading}
                                    >
                                        <Save /> {loading ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                    <Link 
                                        className="btn btn-outline-dark" 
                                        to="/office/guru"
                                    >
                                        Batal
                                    </Link>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default GuruForm;