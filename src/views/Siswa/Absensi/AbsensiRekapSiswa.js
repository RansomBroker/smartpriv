import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";

export function AbsensiRekapSiswa() {

    const [datas, setDatas] = useState([])

    useEffect(() => {
        let newData = []
        for (let i = 1; i <= 31; i++) {
            newData.push({
                tanggal: i,
                h: false,
                i: false,
                s: false,
            })
        }
        setDatas(newData)
    }, [])

    return (
        <div className="p-4">
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
                            {
                                (datas.map((v, k) => {
                                    return <tr>
                                        <td>{v.tanggal}</td>
                                        <td>
                                            <Form.Check name={`abs-${v.tgl}`} inline type="checkbox" />
                                        </td>
                                        <td>
                                            <Form.Check name={`abs-${v.tgl}`} inline type="checkbox" />
                                        </td>
                                        <td>
                                            <Form.Check name={`abs-${v.tgl}`} inline type="checkbox" />
                                        </td>
                                    </tr>
                                }))
                            }
                        </tbody>
                    </Table>
                </Col>
                <Col md="7">
                    <Card>
                        <Card.Body>
                            <div className="d-flex flex-column align-items-center">
                                <h5>Total Hadir</h5>
                                <span>5</span>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
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
    )
}