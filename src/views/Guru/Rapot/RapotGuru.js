import React, { useEffect, useState } from "react";
import { Card, Table, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const RapotGuru = () => {
  const [bulan, setBulan] = useState("2025-06"); // YYYY-MM format
  const [dataSiswa, setDataSiswa] = useState([]);
  const [mapel, setMapel] = useState("");
  const [formData, setFormData] = useState({});
  const [bab, setBab] = useState("");
  const [rekapRapot, setRekapRapot] = useState([]);

  useEffect(() => {
    axios.get("/api/siswa").then((res) => {
      setDataSiswa(res.data);
    });

    axios.get(`/api/rapot/rekap?bulan=${bulan}`).then((res) => {
      setRekapRapot(res.data);
    });
  }, [bulan]);

  const handleInputChange = (id, nilai) => {
    setFormData({ ...formData, [id]: nilai });
  };

  const handleSubmit = async () => {
    const kirimData = dataSiswa
      .filter((siswa) => formData[siswa.id]) // hanya yang terisi nilai
      .map((siswa) => ({
        userId: siswa.id,
        mapel,
        bab,
        nilai: Number(formData[siswa.id]) || 0,
      }));

    if (kirimData.length === 0) {
      alert("Silakan isi nilai untuk minimal satu siswa.");
      return;
    }

    try {
      await axios.post("/api/rapot", kirimData);
      alert("Data berhasil disimpan!");
      setFormData({});
      setMapel("");
      setBab("");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Lihat Rekap Bulanan</Form.Label>
            <Form.Control
              type="month"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Rekap Kiri */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              Rekap Rapot Bulan{" "}
              {new Date(bulan + "-01").toLocaleString("id", {
                month: "long",
                year: "numeric",
              })}
            </Card.Header>
            <Card.Body>
              {rekapRapot.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Nama Siswa</th>
                      <th>Mapel</th>
                      <th>Bab</th>
                      <th>Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rekapRapot.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.nama}</td>
                        <td>{item.mapel}</td>
                        <td>{item.bab}</td>
                        <td>{item.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>Belum ada data nilai bulan ini.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Form Input Kanan */}
        <Col md={6}>
          <Card>
            <Card.Header>Form Input Nilai Rapot</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Mata Pelajaran</Form.Label>
                <Form.Control
                  type="text"
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bab Pelajaran</Form.Label>
                <Form.Control
                  type="text"
                  value={bab}
                  onChange={(e) => setBab(e.target.value)}
                />
              </Form.Group>

              {dataSiswa.map((siswa) => (
                <Form.Group key={siswa.id} className="mb-3">
                  <Form.Label>{siswa.nama}</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nilai"
                    value={formData[siswa.id] || ""}
                    onChange={(e) =>
                      handleInputChange(siswa.id, e.target.value)
                    }
                  />
                </Form.Group>
              ))}

              <Button
                variant="primary"
                onClick={handleSubmit}
                className="d-block w-100"
              >
                Simpan Nilai Rapot
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RapotGuru;
