import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../libs/auth";

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : ""; // For development, proxy will be used

// Helper to get current YYYY-MM
const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

export default function AbsensiAdmin() {
  const { user } = useAuth();
  const [state, setState] = useState({
    input: {
      tanggal: new Date().toISOString().slice(0, 10),
    },
    siswa: [],
    absensi: {},
  });

  // State for Rekap
  const [selectedMonthYear, setSelectedMonthYear] = useState(
    getCurrentYearMonth()
  );
  const [guruList, setGuruList] = useState([]);
  const [selectedGuruIdForRekap, setSelectedGuruIdForRekap] = useState("");
  const [allPresensiData, setAllPresensiData] = useState([]);
  const [rekapAdminData, setRekapAdminData] = useState({
    namaGuru: "",
    rekapTable: [],
  });

  // Fetch siswa for form (existing logic)
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/user`)
      .then((response) => {
        const siswaData = response.data.filter((u) => u.level === "siswa");
        setState((prevState) => ({
          ...prevState,
          siswa: siswaData.map((s) => ({ siswa_id: s.id, nama: s.name })),
        }));
      })
      .catch((error) => {
        console.error("Error fetching student data for form:", error);
      });
  }, []);

  // Fetch guru list for rekap dropdown
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/user`)
      .then((response) => {
        const gurus = response.data.filter((u) => u.level === "guru");
        setGuruList(gurus);
      })
      .catch((error) => {
        console.error("Error fetching guru data:", error);
      });
  }, []);

  // Fetch all presensi data when selectedMonthYear changes (or on mount initially for current month)
  useEffect(() => {
    if (selectedMonthYear) {
      axios
        .get(`${API_BASE_URL}/api/presensi`)
        .then((response) => {
          setAllPresensiData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching presensi data:", error);
          setAllPresensiData([]); // Clear on error
        });
    }
  }, [selectedMonthYear]); // Re-fetch if month/year changes

  // Calculate Rekap when data or selections change
  useEffect(() => {
    if (
      selectedMonthYear &&
      selectedGuruIdForRekap &&
      allPresensiData.length > 0 &&
      guruList.length > 0
    ) {
      const [year, month] = selectedMonthYear.split("-").map(Number);
      const selectedGuru = guruList.find(
        (g) => g.id === parseInt(selectedGuruIdForRekap)
      );

      const presensiForGuruAndMonth = allPresensiData.filter((p) => {
        const presensiDate = new Date(p.absensiDate);
        return (
          p.absentById === parseInt(selectedGuruIdForRekap) &&
          presensiDate.getFullYear() === year &&
          presensiDate.getMonth() + 1 === month
        );
      });

      // Group by student (userId)
      const groupedByStudent = presensiForGuruAndMonth.reduce((acc, p) => {
        const studentId = p.user?.id || p.userId; // Prefer p.user.id if available
        const studentName = p.user?.name || "Nama Tidak Diketahui";
        if (!studentId) return acc; // Skip if no student id

        acc[studentId] = acc[studentId] || {
          studentId,
          studentName,
          hadir: 0,
          izin: 0,
          sakit: 0,
        };
        if (p.status === "H") acc[studentId].hadir++;
        if (p.status === "I") acc[studentId].izin++;
        if (p.status === "S") acc[studentId].sakit++;
        return acc;
      }, {});

      setRekapAdminData({
        namaGuru: selectedGuru ? selectedGuru.name : "Guru Tidak Diketahui",
        rekapTable: Object.values(groupedByStudent),
      });
    } else {
      setRekapAdminData({ namaGuru: "", rekapTable: [] }); // Reset if no selection or data
    }
  }, [selectedMonthYear, selectedGuruIdForRekap, allPresensiData, guruList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      input: {
        ...prevState.input,
        [name]: value,
      },
    }));
  };

  const handleAbsensiChange = (siswaId, status) => {
    setState((prevState) => ({
      ...prevState,
      absensi: {
        ...prevState.absensi,
        [siswaId]: status,
      },
    }));
  };

const handleSubmit = () => {
  if (!state.input.tanggal) {
    alert("Silakan pilih tanggal terlebih dahulu.");
    return;
  }
  if (!user || user.id === undefined) {
    alert("User data tidak tersedia.");
    return;
  }

  // Cek apakah semua siswa sudah dipilih status absensinya
  const siswaBelumDipilih = state.siswa.filter(
    (s) => !state.absensi[s.siswa_id]
  );

  if (siswaBelumDipilih.length > 0) {
    const namaBelumDipilih = siswaBelumDipilih.map((s) => s.nama).join(", ");
    alert(`Silakan isi status absensi untuk: ${namaBelumDipilih}`);
    return;
  }

  const payload = state.siswa.map((s) => ({
    userId: s.siswa_id,
    status: state.absensi[s.siswa_id],
    absentById: user.id,
    absensiDate: new Date(state.input.tanggal).toISOString(),
  }));

  axios
    .post(`${API_BASE_URL}/api/presensi`, payload)
    .then((response) => {
      alert("Absensi berhasil disimpan!");
      setState((prevState) => ({
        ...prevState,
        absensi: {}, // reset
      }));
      if (selectedMonthYear === getCurrentYearMonth()) {
        axios
          .get(`${API_BASE_URL}/api/presensi`)
          .then((res) => setAllPresensiData(res.data))
          .catch((err) =>
            console.error("Error re-fetching presensi data:", err)
          );
      }
    })
    .catch((error) => {
      console.error("Error submitting absensi:", error);
      alert("Gagal menyimpan absensi. Silakan coba lagi.");
    });
};

  return (
    <>
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Lihat Rekap Bulanan (Admin)</Form.Label>
            <Form.Control
              type="month"
              value={selectedMonthYear}
              onChange={(e) => setSelectedMonthYear(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Pilih Guru untuk Rekap</Form.Label>
            <Form.Select
              onChange={(e) => setSelectedGuruIdForRekap(e.target.value)}
              value={selectedGuruIdForRekap}
            >
              <option value="">Pilih Guru</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Kolom Kiri: Rekap */}
        <Col md={6}>
          {selectedMonthYear &&
          selectedGuruIdForRekap &&
          rekapAdminData.namaGuru ? (
            <Card className="mb-3">
              <Card.Header as="h5">
                Rekap Absensi Bulan:{" "}
                {new Date(selectedMonthYear + "-01").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Card.Header>
              <Card.Body>
                <h6>Guru: {rekapAdminData.namaGuru}</h6>
                {rekapAdminData.rekapTable.length > 0 ? (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Nama Siswa</th>
                        <th>Total Hadir (H)</th>
                        <th>Total Izin (I)</th>
                        <th>Total Sakit (S)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rekapAdminData.rekapTable.map((item) => (
                        <tr key={item.studentId}>
                          <td>{item.studentName}</td>
                          <td>{item.hadir}</td>
                          <td>{item.izin}</td>
                          <td>{item.sakit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>
                    Tidak ada data absensi untuk guru dan bulan yang dipilih.
                  </p>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="mb-3">
              <Card.Body>
                <p>Pilih bulan/tahun dan guru untuk melihat rekap.</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Kolom Kanan: Form Absensi (existing) */}
{/* Kolom Kanan: Input Absensi Harian Manual */}
<Col md={6}>
  <Card className="mb-3">
    <Card.Header as="h5">Input Absensi Harian</Card.Header>
    <Card.Body>
      <Form.Group className="mb-3">
        <Form.Label>Pilih Tanggal</Form.Label>
        <Form.Control
          type="date"
          name="tanggal"
          value={state.input.tanggal}
          onChange={handleChange}
        />
      </Form.Group>

      <Table striped bordered responsive size="sm">
        <thead>
          <tr>
            <th>Nama Siswa</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
{state.siswa.map((s) => (
  <tr key={s.siswa_id}>
    <td>{s.nama}</td>
    <td>
      <select
        value={state.absensi[s.siswa_id] || ""}
        onChange={(e) => handleAbsensiChange(s.siswa_id, e.target.value)}
      >
        <option value="">-- Pilih Status --</option>
        <option value="H">Hadir</option>
        <option value="I">Izin</option>
        <option value="S">Sakit</option>
      </select>
    </td>
  </tr>
))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={handleSubmit}>
        Simpan Absensi
      </Button>
    </Card.Body>
  </Card>
</Col>
      </Row>
    </>
  );
}
