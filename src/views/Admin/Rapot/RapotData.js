import { Badge, Card, Col, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

function RapotData() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [swalProps, setSwalProps] = useState({
    show: false,
    onConfirmHandle: () => {},
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setCurrentUser(userData);
    }
  }, []);

  useEffect(() => {
    fetchRapot();
  }, []);

  const fetchRapot = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/rapot`);
      setDatas(response.data);
    } catch (error) {
      console.error("Error fetching rapot:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/user?level=siswa`)
      .then((res) => setSiswaList(res.data))
      .catch((err) => console.error("Gagal mengambil data siswa:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/rapot/${id}`);
      fetchRapot();
      setSwalProps({ show: false });
    } catch (error) {
      console.error("Error deleting rapot:", error);
    }
  };

  const handleConfirmDelete = (id) => {
    setSwalProps({
      show: true,
      title: "Konfirmasi",
      text: "Yakin akan hapus data ini?",
      icon: "question",
      showCancelButton: true,
      onConfirmHandle: () => handleDelete(id),
    });
  };

  const filteredData = selectedSiswaId
    ? datas.filter((d) => d.user?.id === selectedSiswaId)
    : [];

  const handleCetakPDF = () => {
    const doc = new jsPDF();
    const siswa = siswaList.find((s) => s.id === selectedSiswaId);
    const data = filteredData;

    doc.setFontSize(16);
    doc.text(`Rekap Nilai - ${siswa?.name || "-"}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["No", "Mapel", "Nilai", "Semester"]],
      body: data.map((d, i) => [i + 1, d.mapel, d.nilai, d.semester]),
    });

    doc.save(`rapot_${siswa?.name}.pdf`);
  };

  const basePath = currentUser?.level === "guru" ? "/guru" : "/office";

  const columns = [
    {
      name: "No",
      cell: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Nama Siswa",
      selector: (row) => row.user?.name || row.user?.username || "-",
      sortable: true,
    },
    {
      name: "Mapel",
      selector: (row) => row.mapel || "-",
      sortable: true,
    },
    {
      name: "Nilai",
      selector: (row) => row.nilai || "-",
    },
    {
      name: "Semester",
      selector: (row) => row.semester || "-",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-1">
          <Badge
            bg="primary"
            role="button"
            onClick={() => navigate(`${basePath}/rapot_siswa/edit/${row.id}`)}
          >
            <Pencil />
          </Badge>
          <Badge
            bg="danger"
            role="button"
            onClick={() => handleConfirmDelete(row.id)}
          >
            <Trash />
          </Badge>
        </div>
      ),
      width: "100px",
    },
  ];

  return (
    <>
      <SweetAlert2 {...swalProps} onConfirm={swalProps.onConfirmHandle} />
      <Card>
        <Card.Body className="p-4">
          <div className="d-flex flex-row justify-content-between">
            <h3>Data Rapot Siswa</h3>
            <Link
              to={`${basePath}/rapot_siswa/add`}
              className="btn btn-outline-dark px-3"
            >
              <Plus /> Tambah
            </Link>
          </div>

          <Row className="my-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pilih Siswa</Form.Label>
                <Form.Select
                  value={selectedSiswaId}
                  onChange={(e) => setSelectedSiswaId(e.target.value)}
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button
                variant="danger"
                onClick={handleCetakPDF}
                disabled={!selectedSiswaId}
              >
                Cetak Rekap PDF
              </Button>
            </Col>
          </Row>

          <div className="my-4">
            <DataTable
              columns={columns}
              data={filteredData}
              persistTableHead
              progressPending={loading}
              pagination
              highlightOnHover
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default RapotData;
