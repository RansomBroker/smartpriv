import { Badge, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";
import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

function RapotData() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [swalProps, setSwalProps] = useState({
    show: false,
    onConfirmHandle: () => {},
  });

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setCurrentUser(userData);
    }
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
    fetchRapot();
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

  // Get base path for navigation based on user role
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

          <div className="my-5">
            <DataTable
              columns={columns}
              data={datas}
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
