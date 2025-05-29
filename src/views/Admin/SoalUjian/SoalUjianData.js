import { Badge, Card, Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";
import { useAuth } from "../../../libs/auth";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : ""; // For development, proxy will be used

export default function SoalUjianData() {
  const { kelas } = useParams();
  const { user, loading: userLoading } = useAuth();
  const [datas, setDatas] = useState([]);
  const [swalProps, setSwalProps] = useState({});
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allData = await response.json();
      const filteredData = allData.filter(
        (item) => String(item.kelas) === String(kelas)
      );
      setDatas(filteredData);
    } catch (error) {
      console.error("Could not fetch data: ", error);
      setDatas([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kelas]);

  const submitDelete = async (idToDelete) => {
    if (!idToDelete) {
      console.error("Delete aborted: ID is missing.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/soal/${idToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSwalProps({
          show: true,
          title: "Sukses",
          text: "Data berhasil dihapus",
          icon: "success",
        });
        fetchData();
        setItemToDeleteId(null);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Gagal menghapus data" }));
        setSwalProps({
          show: true,
          title: "Error",
          text: errorData.message || "Gagal menghapus data",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setSwalProps({
        show: true,
        title: "Error",
        text: "Terjadi kesalahan saat menghapus data",
        icon: "error",
      });
    }
  };

  const handleConfirmDelete = (id) => {
    setItemToDeleteId(id);
    setSwalProps({
      show: true,
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      onConfirm: () => submitDelete(id),
      onClose: () => {
        setSwalProps({});
        setItemToDeleteId(null);
      },
      onCancel: () => {
        setSwalProps({});
        setItemToDeleteId(null);
      },
    });
  };

  let columns = [
    {
      name: "No",
      cell: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Judul",
      selector: (row) => row.judul,
      sortable: true,
    },
    {
      name: "Link",
      cell: (row) => (
        <a href={row.link_soal} target="_blank" rel="noopener noreferrer">
          {row.link_soal}
        </a>
      ),
      grow: 2,
    },
  ];

  if (user && user.level !== "siswa") {
    columns.push({
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-1">
          <Link
            to={`${basePath}/soal_ujian/${kelas}/edit/${row.id}`}
            className="btn btn-sm btn-warning"
          >
            <Pencil />
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleConfirmDelete(row.id)}
          >
            <Trash />
          </Button>
        </div>
      ),
      width: "120px",
    });
  }

  if (userLoading) {
    return <p>Loading user information...</p>;
  }

  if (!user) {
    return <p>User not authenticated. Please login.</p>;
  }

  // Determine basePath for links based on user level
  let basePath = "/office"; // Default for admin
  if (user.level === "guru") {
    basePath = "/guru";
  }
  // Siswa level does not have add/edit/delete, so no basePath needed for them in this context

  return (
    <>
      <SweetAlert2
        {...swalProps}
        didClose={() => {
          setSwalProps({});
        }}
      />
      <Card>
        <Card.Body className="p-4">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <h3>Soal Ujian Kelas {kelas}</h3>
            {user.level !== "siswa" && (
              <div>
                <Link
                  to={`${basePath}/soal_ujian/${kelas}/add`}
                  className="btn btn-outline-dark px-3"
                >
                  <Plus /> Tambah Soal
                </Link>
              </div>
            )}
          </div>

          <div className="my-3">
            <DataTable
              columns={columns}
              data={datas}
              progressPending={dataLoading}
              persistTableHead
              pagination
              highlightOnHover
              striped
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
