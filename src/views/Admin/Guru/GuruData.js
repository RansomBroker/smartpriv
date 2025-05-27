import { Badge, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";
import axios from "axios";

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id" // Corrected: No trailing /api
    : ""; // For development, proxy will be used

function GuruData() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swalProps, setSwalProps] = useState({
    show: false,
    onConfirmHandle: () => {},
  });

  // Fetch guru data
  const fetchGuruData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      // Filter users with level "guru"
      const guruData = response.data.filter((user) => user.level === "guru");
      setDatas(guruData);
    } catch (error) {
      console.error("Error fetching guru data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuruData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/user/${id}`);
      // Refresh data after successful deletion
      fetchGuruData();
      setSwalProps({ show: false });
    } catch (error) {
      console.error("Error deleting guru:", error);
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
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "No HP",
      selector: (row) => row.nohp,
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-1">
          <Badge
            bg="primary"
            role="button"
            onClick={() => navigate(`/office/guru/edit/${row.id}`)}
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
            <h3>Data Guru</h3>
            <div>
              <Link to="/office/guru/add" className="btn btn-outline-dark px-3">
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

export default GuruData;
