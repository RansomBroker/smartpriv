import { Badge, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";
import axios from "axios";

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id/api"
    : ""; // For development, proxy will be used

function PrestasiData() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swalProps, setSwalProps] = useState({
    show: false,
    onConfirmHandle: () => {},
  });

  const fetchPrestasi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prestasi`);
      setDatas(response.data);
    } catch (error) {
      console.error("Error fetching prestasi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestasi();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/prestasi/${id}`);
      // Refresh data after successful deletion
      fetchPrestasi();
      setSwalProps({ show: false });
    } catch (error) {
      console.error("Error deleting prestasi:", error);
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

  const columns = [
    {
      name: "No",
      cell: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Nama Siswa",
      selector: (row) => row.user?.name || "-",
      sortable: true,
    },
    {
      name: "Nama Prestasi",
      selector: (row) => row.name || "-",
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-1">
          <Badge
            bg="primary"
            role="button"
            onClick={() => navigate(`/office/prestasi_siswa/edit/${row.id}`)}
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
            <h3>Prestasi Siswa</h3>
            <div>
              <Link
                to="/office/prestasi_siswa/add"
                className="btn btn-outline-dark px-3"
              >
                <Plus /> Add
              </Link>
            </div>
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

export default PrestasiData;
