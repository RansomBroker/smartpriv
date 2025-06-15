import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../libs/auth";

// Ganti sesuai base URL API Anda
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export default function AbsensiGuru() {
  const { user } = useAuth();

  // Form state
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [siswaForForm, setSiswaForForm] = useState([]);
  const [absensi, setAbsensi] = useState({});

  // Rekap state
  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentYearMonth());
  const [allPresensiData, setAllPresensiData] = useState([]);
  const [rekapGuruData, setRekapGuruData] = useState({ rekapTable: [] });

  // Ambil data siswa untuk form manual
  useEffect(() => {
    if (!user?.id) return;

    // Atur endpoint sesuai API Anda
    axios
      .get(`${API_BASE_URL}/api/user`, { params: { level: "siswa" } })
      .then((res) => {
        const list = res.data.filter((u) => u.level === "siswa");
        setSiswaForForm(list.map((s) => ({ siswa_id: s.id, nama: s.name })));
      })
      .catch((err) => {
        console.error("Gagal mengambil data siswa:", err);
        setSiswaForForm([]);
      });
  }, [user]);

  // Ambil semua data presensi untuk rekap
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/presensi`)
      .then((res) => setAllPresensiData(res.data))
      .catch((err) => {
        console.error("Gagal mengambil data presensi:", err);
        setAllPresensiData([]);
      });
  }, []);

  // Hitung rekap berdasarkan semua data presensi dan bulan
  useEffect(() => {
    if (!selectedMonthYear) {
      setRekapGuruData({ rekapTable: [] });
      return;
    }

    const [year, month] = selectedMonthYear.split("-").map(Number);
    const presensiForMonth = allPresensiData.filter((p) => {
      const d = new Date(p.absensiDate);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const grouped = presensiForMonth.reduce((acc, p) => {
      const sid = p.userId;
      const name = p.user?.name || "Nama Tidak Diketahui";
      acc[sid] = acc[sid] || { studentId: sid, studentName: name, hadir: 0, izin: 0, sakit: 0 };
      if (p.status === "H") acc[sid].hadir++;
      if (p.status === "I") acc[sid].izin++;
      if (p.status === "S") acc[sid].sakit++;
      return acc;
    }, {});

    setRekapGuruData({ rekapTable: Object.values(grouped) });
  }, [allPresensiData, selectedMonthYear]);

  const handleAbsensiChange = (sid, status) => {
    setAbsensi((prev) => ({ ...prev, [sid]: status }));
  };

  const handleSubmit = () => {
    if (!tanggal || !user?.id) {
      alert("Tanggal atau user belum benar.");
      return;
    }

// Ambil hanya siswa yang diisi statusnya
const siswaTerisi = siswaForForm.filter((s) => absensi[s.siswa_id]);
if (siswaTerisi.length === 0) {
  alert("Silakan isi absensi minimal untuk satu siswa.");
  return;
}

const payload = siswaTerisi.map((s) => ({
  userId: s.siswa_id,
  status: absensi[s.siswa_id],
  absentById: user.id,
  absensiDate: new Date(tanggal).toISOString(),
}));
    axios
      .post(`${API_BASE_URL}/api/presensi`, payload)
      .then(() => {
        alert("Absensi berhasil disimpan!");
        setAbsensi({});
        return axios.get(`${API_BASE_URL}/api/presensi`);
      })
      .then((res) => setAllPresensiData(res.data))
      .catch((err) => {
        console.error("Gagal simpan/re-fetch presensi:", err);
        alert("Terjadi error, silakan coba lagi.");
      });
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Lihat Rekap Bulanan</Form.Label>
            <Form.Control
              type="month"
              value={selectedMonthYear}
              onChange={(e) => setSelectedMonthYear(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Rekap */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Rekap Absensi Bulan {new Date(selectedMonthYear + "-01").toLocaleString("default", { month: "long", year: "numeric"})}</Card.Header>
            <Card.Body>
              {rekapGuruData.rekapTable.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Nama Siswa</th>
                      <th>Hadir</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rekapGuruData.rekapTable.map((r) => (
                      <tr key={r.studentId}>
                        <td>{r.studentName}</td>
                        <td>{r.hadir}</td>
                        <td>{r.izin}</td>
                        <td>{r.sakit}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>Belum ada data presensi pada bulan ini.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Form Input Manual */}
        <Col md={6}>
          <Card>
            <Card.Header>Form Absensi Harian Manual</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              </Form.Group>
              {siswaForForm.map((s) => (
                <Form.Group key={s.siswa_id} className="mb-3">
                  <Form.Label>{s.nama}</Form.Label>
                  <div>
                    <Form.Check inline label="H" type="radio" name={`abs-${s.siswa_id}`} onChange={() => handleAbsensiChange(s.siswa_id, "H")} checked={absensi[s.siswa_id] === "H"} />
                    <Form.Check inline label="I" type="radio" name={`abs-${s.siswa_id}`} onChange={() => handleAbsensiChange(s.siswa_id, "I")} checked={absensi[s.siswa_id] === "I"} />
                    <Form.Check inline label="S" type="radio" name={`abs-${s.siswa_id}`} onChange={() => handleAbsensiChange(s.siswa_id, "S")} checked={absensi[s.siswa_id] === "S"} />
                  </div>
                </Form.Group>
              ))}
              <Button variant="success" onClick={handleSubmit} className="d-block w-100">Simpan Absensi</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
