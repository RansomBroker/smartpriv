import React, { useState, useEffect } from "react";
import { Badge, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Pencil, Trash } from "react-bootstrap-icons";

const SoalUjianData = ({ soalList, onEdit, onDelete }) => {
  const { kelas } = useParams(); // Get kelas from URL parameter
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (kelas && soalList) {
      setFilteredData(
        soalList.filter((item) => String(item.kelas) === String(kelas))
      );
    } else {
      setFilteredData([]); // Clear data if no kelas or soalList
    }
  }, [kelas, soalList]);

  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: "Judul Soal",
      selector: (row) => row.judul,
      sortable: true,
      wrap: true,
    },
    {
      name: "Link Soal",
      cell: (row) => (
        <a href={row.link_soal} target="_blank" rel="noopener noreferrer">
          {row.link_soal}
        </a>
      ),
      wrap: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Badge
            pill
            bg="primary"
            onClick={() => onEdit(row)}
            style={{ cursor: "pointer", padding: "0.5em 0.75em" }}
            className="d-flex align-items-center"
          >
            <Pencil size={12} className="me-1" /> Edit
          </Badge>
          <Badge
            pill
            bg="danger"
            onClick={() => onDelete(row.id)}
            style={{ cursor: "pointer", padding: "0.5em 0.75em" }}
            className="d-flex align-items-center"
          >
            <Trash size={12} className="me-1" /> Hapus
          </Badge>
        </div>
      ),
      width: "180px",
      center: true,
    },
  ];

  if (!kelas) {
    return (
      <p className="text-center mt-4 alert alert-info">
        Silakan pilih kelas terlebih dahulu dari daftar di bawah untuk
        menampilkan data soal ujian.
      </p>
    );
  }

  return (
    <Card className="mt-3 mb-3">
      <Card.Header>
        <h5 className="mb-0 py-1">Data Soal Ujian Kelas {kelas}</h5>
      </Card.Header>
      <Card.Body className="p-0 p-md-2">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          persistTableHead
          highlightOnHover
          striped
          dense
          noDataComponent={
            <div className="p-3 text-center">
              Belum ada soal ujian untuk kelas {kelas}.
            </div>
          }
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50]}
        />
      </Card.Body>
    </Card>
  );
};

export default SoalUjianData;
