import { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";

export function PrestasiRekapSiswa() {
    const [datas, setDatas] = useState([
        {
            nama_prestasi: "Juara 1 Lomba Matematika",
            tingkat: "Kabupaten",
            tahun: 2024,
            keterangan: "Perwakilan sekolah",
        },
        {
            nama_prestasi: "Juara 2 Lomba Cerdas Cermat",
            tingkat: "Kecamatan",
            tahun: 2023,
            keterangan: "",
        },
        {
            nama_prestasi: "Peserta Olimpiade Sains",
            tingkat: "Nasional",
            tahun: 2022,
            keterangan: "Finalis",
        },
    ]);

    const fetchPrestasiSiswa = async () => {
        try {
            const response = await fetch("/api/prestasi/siswa");
            if (response.ok) {
                const result = await response.json();
                if (Array.isArray(result) && result.length > 0) {
                    setDatas(result);
                }
            }
        } catch (error) {
            console.error("Error fetching prestasi siswa:", error);
            // Tetap lanjutkan dengan dummy kalau error
        }
    };

    useEffect(() => {
        fetchPrestasiSiswa();
    }, []);

    return (
        <div className="p-4">
            <h3 className="fw-bolder mb-4">Rekap Prestasi Saya</h3>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead className="text-center">
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Prestasi</th>
                                        <th>Tingkat</th>
                                        <th>Tahun</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {datas.length > 0 ? (
                                        datas.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.nama_prestasi}</td>
                                                <td>{item.tingkat}</td>
                                                <td>{item.tahun}</td>
                                                <td>{item.keterangan || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>Belum ada data prestasi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PrestasiRekapSiswa;
