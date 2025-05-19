import {
  Card,
  Col,
  Row,
  Container,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Data untuk Student Chart (Bar Chart)
const studentData = [
  { year: "2021", siswaLaki: 2, siswaPerempuan: 1 },
  { year: "2022", siswaLaki: 2, siswaPerempuan: 3 },
  { year: "2023", siswaLaki: 3, siswaPerempuan: 4 },
  { year: "2024", siswaLaki: 5, siswaPerempuan: 5 },
  { year: "2025", siswaLaki: 7, siswaPerempuan: 10 },
];

// Data untuk Pie Chart Penilaian Siswa
const penilaianData = [
  { name: "Test Harian", value: 20 },
  { name: "Tugas", value: 20 },
  { name: "Ujian Akhir Periode", value: 60 },
];

const COLORS_PENILAIAN = ["#0088FE", "#FFBB28", "#00C49F"];

// Data untuk Pie Chart Persebaran Lokasi
const lokasiData = [
  { name: "Kabupaten Blitar", value: 70 },
  { name: "Kota Blitar", value: 30 },
];

const COLORS_LOKASI = ["#FF8042", "#00C49F"];

function AdminDashboard() {
  return (
        <div className="d-flex flex-column">
          
   {/* Kotak Jumlah Siswa / Guru / Kelas */}
   <Row className="g-4 mb-4">
  <Col md={3} style={{ flexBasis: "21.8%" }}>  {/* 2.5 dari 12 = 20.8% */}
  <Card style={{ backgroundColor: "#d7c8f6", padding: "10px" }} className="text-center rounded-4">
    <Card.Body>
      <h6 className="fw-bold mb-1">Siswa</h6>
      <h3 className="fw-bold">12</h3>
    </Card.Body>
  </Card>
</Col>
<Col md={3} style={{ flexBasis: "21.8%" }}>  {/* 2.5 dari 12 = 20.8% */}
  <Card style={{ backgroundColor: "#ffe7a9", padding: "10px" }} className="text-center rounded-4">
    <Card.Body>
      <h6 className="fw-bold mb-1">Guru</h6>
      <h3 className="fw-bold">3</h3>
    </Card.Body>
  </Card>
</Col>
<Col md={3} style={{ flexBasis: "21.8%" }}>  {/* 2.5 dari 12 = 20.8% */}
  <Card style={{ backgroundColor: "#ffb3b3", padding: "10px" }} className="text-center rounded-4">
    <Card.Body>
      <h6 className="fw-bold mb-1">Kelas</h6>
      <h3 className="fw-bold">6</h3>
    </Card.Body>
  </Card>
</Col>
      </Row>

      {/* Bagian Logo, Alamat, dan Diagram Penilaian */}
      <Row>
        <Col md={12} lg={8}>
          <Card className="w-100 mb-4">
            <Card.Body className="d-flex flex-column">
              <div className="w-100 d-flex justify-content-center mb-3">
                <img
                  src={`/assets/images/smart_private.png`}
                  width={200} // >>> diperbesar logo nya
                  alt="Smart Private"
                />
              </div>
              <p className="text-center fw-bold mb-1 fs-5">
                Jl. Raya Kunir 01/03 Kec.Wonodadi Kab.Blitar Kode Pos 66155
              </p>
              <p className="text-center fw-bold fs-6">
                Instagram : @smartprivate.blitar
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={4}>
          <Card className="w-200 mb-5">
            <Card.Body>
              <h5 className="text-center fw-bold mb-4">Diagram Penilaian Siswa</h5>
              <ResponsiveContainer width="100%" height={245}> {/* kecilin height */}
                <PieChart>
                  <Pie
                    data={penilaianData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70} // <<< kecilin ukuran pie
                    fill="#8884d8"
                    label
                  >
                    {penilaianData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PENILAIAN[index % COLORS_PENILAIAN.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

{/* Bagian Student Chart */}
<p className="fw-bold fs-4 mt-4">Student Chart</p>
<Container fluid>
  <Row className="g-4 mb-4">
    <Col md={12} lg={6}>
      <Card className="w-100">
        <Card.Body>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={studentData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis ticks={[0, 2, 4, 6]} domain={[0, 6]} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="siswaLaki" fill="#0095FF" name="Siswa Laki-laki" radius={[4, 4, 0, 0]} />
              <Bar dataKey="siswaPerempuan" fill="#FF6E8E" name="Siswa Perempuan" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Col>

          {/* Bagian Persebaran Lokasi */}
          <Col md={12} lg={6}>
            <Card className="w-100">
              <Card.Body>
                <h5 className="text-center fw-bold mb-4">Persebaran Lokasi</h5>
                <ResponsiveContainer width="100%" height={225}> {/* height dikecilin */}
                  <PieChart>
                    <Pie
                      data={lokasiData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60} // <<< kecilin ukuran pie
                      fill="#8884d8"
                      label
                    >
                      {lokasiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_LOKASI[index % COLORS_LOKASI.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
