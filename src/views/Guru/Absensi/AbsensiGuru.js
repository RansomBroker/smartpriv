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

export default function AbsensiGuru() {
  const { user } = useAuth();
  const [state, setState] = useState({
    input: {
      tanggal: new Date().toISOString().slice(0, 10),
    },
    siswa: [], // For the form
    absensi: {},
  });

  // State for Rekap
  const [selectedMonthYear, setSelectedMonthYear] = useState(
    getCurrentYearMonth()
  );
  const [allPresensiDataByGuru, setAllPresensiDataByGuru] = useState([]);
  const [rekapGuruData, setRekapGuruData] = useState({ rekapTable: [] });
  const [siswaForForm, setSiswaForForm] = useState([]); // Renamed from state.siswa for clarity with rekap logic

  // Fetch siswa for form (existing logic, populates siswaForForm)
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/user`)
      .then((response) => {
        const siswaData = response.data.filter((u) => u.level === "siswa");
        setSiswaForForm(
          siswaData.map((s) => ({ siswa_id: s.id, nama: s.name }))
        );
      })
      .catch((error) => {
        console.error("Error fetching student data for form:", error);
      });
  }, []);

  // Fetch presensi data relevant to this guru
  useEffect(() => {
    if (user && user.id) {
      // Fetch whenever user.id is available, month selection will filter later
      axios
        .get(`${API_BASE_URL}/api/presensi`)
        .then((response) => {
          const filteredForGuru = response.data.filter(
            (p) => p.absentById === user.id
          );
          setAllPresensiDataByGuru(filteredForGuru);
        })
        .catch((error) => {
          console.error("Error fetching presensi data for guru:", error);
          setAllPresensiDataByGuru([]);
        });
    }
  }, [user]); // Re-fetch if user changes

  // Calculate Rekap for Guru when data or selections change
  useEffect(() => {
    if (selectedMonthYear && allPresensiDataByGuru.length > 0) {
      const [year, month] = selectedMonthYear.split("-").map(Number);

      const presensiForMonth = allPresensiDataByGuru.filter((p) => {
        const presensiDate = new Date(p.absensiDate);
        return (
          presensiDate.getFullYear() === year &&
          presensiDate.getMonth() + 1 === month
        );
      });

      // Group by student (userId)
      const groupedByStudent = presensiForMonth.reduce((acc, p) => {
        const studentId = p.user?.id || p.userId;
        const studentName = p.user?.name || "Nama Tidak Diketahui";
        if (!studentId) return acc;

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

      setRekapGuruData({ rekapTable: Object.values(groupedByStudent) });
    } else {
      setRekapGuruData({ rekapTable: [] });
    }
  }, [selectedMonthYear, allPresensiDataByGuru]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update state for the form input (tanggal)
    if (name === "tanggal") {
      setState((prevState) => ({
        ...prevState,
        input: { ...prevState.input, [name]: value },
      }));
    } else {
      // For other inputs if any - though not present in current form
      // This part might need adjustment if other direct form inputs are added to `state.input`
    }
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
      alert("User data not available. Cannot submit absensi.");
      return;
    }

    const payload = siswaForForm.map((s) => ({
      userId: s.siswa_id,
      status: state.absensi[s.siswa_id] || "H",
      absentById: user.id,
      absensiDate: new Date(state.input.tanggal).toISOString(),
    }));

    axios
      .post(`${API_BASE_URL}/api/presensi`, payload)
      .then((response) => {
        alert("Absensi berhasil disimpan!");
        setState((prevState) => ({
          ...prevState,
          absensi: {},
        }));
        // Re-fetch presensi data for rekap
        if (user && user.id) {
          axios
            .get(`${API_BASE_URL}/api/presensi`)
            .then((res) => {
              const filteredForGuru = res.data.filter(
                (p) => p.absentById === user.id
              );
              setAllPresensiDataByGuru(filteredForGuru); // This will trigger rekap calculation
            })
            .catch((err) =>
              console.error("Error re-fetching presensi data for guru:", err)
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
            <Form.Label>Lihat Rekap Bulanan (Guru)</Form.Label>
            <Form.Control
              type="month"
              value={selectedMonthYear}
              onChange={(e) => setSelectedMonthYear(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Kolom Kiri: Rekap */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header as="h5">
              Rekap Absensi Bulan:{" "}
              {new Date(selectedMonthYear + "-01").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Card.Header>
            <Card.Body>
              {rekapGuruData.rekapTable.length > 0 ? (
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
                    {rekapGuruData.rekapTable.map((item) => (
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
                  Tidak ada data absensi untuk bulan yang dipilih atau Anda
                  belum menginput absensi pada bulan ini.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Kolom Kanan: Form Absensi (existing) */}
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Form Input Absensi Harian</Card.Header>
            <Card.Body className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Absensi</Form.Label>
                  <Form.Control
                    name="tanggal"
                    onChange={handleChange}
                    value={state.input.tanggal}
                    type="date"
                  />
                </Form.Group>
                {siswaForForm.length === 0 && (
                  <p>Tidak ada data siswa untuk diabsen.</p>
                )}
                {siswaForForm.map((val) => (
                  <Form.Group key={val.siswa_id} className="mb-3">
                    <Form.Label className="text-success">{val.nama}</Form.Label>
                    <div>
                      <Form.Check
                        name={`abs-${val.siswa_id}`}
                        inline
                        label="H"
                        type="radio"
                        onChange={() => handleAbsensiChange(val.siswa_id, "H")}
                        checked={
                          state.absensi[val.siswa_id] === "H" ||
                          !state.absensi[val.siswa_id]
                        }
                      />
                      <Form.Check
                        name={`abs-${val.siswa_id}`}
                        inline
                        label="I"
                        type="radio"
                        onChange={() => handleAbsensiChange(val.siswa_id, "I")}
                        checked={state.absensi[val.siswa_id] === "I"}
                      />
                      <Form.Check
                        name={`abs-${val.siswa_id}`}
                        inline
                        label="S"
                        type="radio"
                        onChange={() => handleAbsensiChange(val.siswa_id, "S")}
                        checked={state.absensi[val.siswa_id] === "S"}
                      />
                    </div>
                  </Form.Group>
                ))}
                <div className="d-grid">
                  <Button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={siswaForForm.length === 0}
                  >
                    Selesai Input Absensi
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
