import { useEffect, useState } from "react";
import { Card, Table, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../../libs/auth";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

function RapotRekapSiswa() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const [semester, setSemester] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set selectedSiswa based on current user
    if (currentUser?.level === "siswa" && currentUser?.id) {
      setSelectedSiswa(currentUser.id.toString());
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.level !== "siswa") {
      fetchSiswaList();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedSiswa) {
      fetchRapotRekap();
    }
  }, [selectedSiswa, semester]);

  const fetchSiswaList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user`);
      const siswa = res.data
        .filter((user) => user.level === "siswa")
        .map((user) => ({
          id: user.id,
          username: user.username,
          name: user.name || user.username,
          kelas: user.kelas,
        }));
      setSiswaList(siswa);

      if (siswa.length > 0 && !selectedSiswa) {
        setSelectedSiswa(siswa[0].id.toString());
      }
    } catch (err) {
      console.error("Gagal ambil data siswa", err);
      setSiswaList([]);
    }
  };

  const fetchRapotRekap = async () => {
    if (!selectedSiswa) return;

    setLoading(true);
    try {
      // Ensure we're using the correct userID and clean any spaces
      let userIdToUse = currentUser?.level === "siswa" ? currentUser.id : selectedSiswa;
      
      // Convert to string and trim any spaces
      userIdToUse = String(userIdToUse).trim();
      
      console.log("Fetching rapot for userID:", userIdToUse, "semester:", semester);
      
      const res = await axios.get(
        `${API_BASE_URL}/api/rapot?userId=${userIdToUse}&semester=${semester}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil data rapot", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body className="p-4">
        <h3>Rekap Rapot Siswa</h3>

        <Form className="row my-4">
          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Pilih Siswa</Form.Label>
            {currentUser?.level === "siswa" ? (
              <Form.Control
                type="text"
                value={`${currentUser.username || currentUser.name || 'Unknown'}`}
                disabled
                readOnly
              />
            ) : (
              <Form.Select
                value={selectedSiswa}
                onChange={(e) => setSelectedSiswa(e.target.value)}
                required
              >
                <option value="">-- Pilih Siswa --</option>
                {siswaList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.username}
                    {siswa.kelas ? ` (${siswa.kelas})` : ""}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Semester</Form.Label>
            <Form.Select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Nilai</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Belum ada data rapot
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.mapel}</td>
                    <td>{item.nilai}</td>
                    <td>{item.catatan || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default RapotRekapSiswa;
