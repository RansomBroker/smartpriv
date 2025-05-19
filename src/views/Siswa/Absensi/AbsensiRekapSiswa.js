import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";

export function AbsensiRekapSiswa() {
    const [datas, setDatas] = useState([]);
    const [selectedBulan, setSelectedBulan] = useState('2025-05');

    const bulanLabel = {
        "2025-04": "April 2025",
        "2025-05": "Mei 2025"
    };

    useEffect(() => {
        let newData = [];
        for (let i = 1; i <= 31; i++) {
            newData.push({
                tanggal: i,
                h: false,
                i: false,
                s: false,
            });
        }
        setDatas(newData);
    }, [selectedBulan]);

    return (
        <div className="p-4">
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select value={selectedBulan} onChange={(e) => setSelectedBulan(e.target.value)}>
                        <option value="">Pilih Bulan Rekap</option>
                        {Object.entries(bulanLabel).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <h3 className="fw-bolder">Absensi Siswa Bulan Ini</h3>
            <Row>
                <Col md="5">
                    <Table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>H</th>
                                <th>I</th>
                                <th>S</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((v, k) => (
                                <tr key={k}>
                                    <td>{v.tanggal}</td>
                                    <td><Form.Check name={`abs-${v.tanggal}`} inline type="checkbox" /></td>
                                    <td><Form.Check name={`abs-${v.tanggal}`} inline type="checkbox" /></td>
                                    <td><Form.Check name={`abs-${v.tanggal}`} inline type="checkbox" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md="7">
                    <Card className="mb-2">
                        <Card.Body>
                            <div className="d-flex flex-column align-items-center">
                                <h5>Total Hadir</h5>
                                <span>5</span>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="mb-2">
                        <Card.Body>
                            <div className="d-flex flex-column align-items-center">
                                <h5>Total Izin</h5>
                                <span>5</span>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="d-flex flex-column align-items-center">
                                <h5>Total Sakit</h5>
                                <span>5</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
