import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";

export default function AbsensiGuru() {
    const [state, setState] = useState({
        input: {},
        siswa: [
            { siswa_id: 1, tanggal: '', nama: 'Azkayla', h: false, i: false, s: false },
            { siswa_id: 2, tanggal: '', nama: 'Fia Nur', h: false, i: false, s: false },
            { siswa_id: 3, tanggal: '', nama: 'Rafli', h: false, i: false, s: false },
            { siswa_id: 4, tanggal: '', nama: 'Kenzho', h: false, i: false, s: false },
        ]
    });

    const [selectedBulan, setSelectedBulan] = useState('');
    const [selectedSiswa, setSelectedSiswa] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [name]: value,
            }
        }));
    };

    const bulanLabel = {
        "2025-04": "April 2025",
        "2025-05": "Mei 2025"
    };

    const siswaLabel = {
        "siswa1": "Azkayla",
        "siswa2": "Fia Nur",
        "siswa3": "Rafli",
        "siswa4": "Kenzho"
    };

    return (
        <>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Select onChange={(e) => setSelectedBulan(e.target.value)} value={selectedBulan}>
                        <option value="">Lihat Rekap Bulanan</option>
                        {Object.entries(bulanLabel).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select onChange={(e) => setSelectedSiswa(e.target.value)} value={selectedSiswa}>
                        <option value="">Pilih Siswa untuk Rekap</option>
                        {Object.entries(siswaLabel).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                {/* Kolom Kiri: Rekap */}
                <Col md={6}>
                    {selectedBulan && (
                        <Card className="mb-3">
                            <Card.Body>
                                <h5>Rekap Absensi Bulan {bulanLabel[selectedBulan]}</h5>
                                <p>Total Hadir: 78</p>
                                <p>Total Izin: 12</p>
                                <p>Total Sakit: 6</p>
                            </Card.Body>
                        </Card>
                    )}
                    {selectedSiswa && (
                        <Card>
                            <Card.Body>
                                <h5>Rekap Absensi {siswaLabel[selectedSiswa]}</h5>
                                <p>Hadir: 22 hari</p>
                                <p>Izin: 3 hari</p>
                                <p>Sakit: 1 hari</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>

                {/* Kolom Kanan: Form Absensi */}
                <Col md={6}>
                    <Card>
                        <Card.Body className="p-4">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control name="tanggal" onChange={handleChange} value={state.input.tanggal} type="date" />
                                </Form.Group>
                                {state.siswa.map((val) => (
                                    <Form.Group key={val.siswa_id} className="mb-3">
                                        <Form.Label className="text-success">{val.nama}</Form.Label>
                                        <div>
                                            <Form.Check name={`abs-${val.siswa_id}`} inline label="H" type="radio" />
                                            <Form.Check name={`abs-${val.siswa_id}`} inline label="I" type="radio" />
                                            <Form.Check name={`abs-${val.siswa_id}`} inline label="S" type="radio" />
                                        </div>
                                    </Form.Group>
                                ))}
                                <div className="d-grid">
                                    <Button className="btn btn-success">Selesai</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
