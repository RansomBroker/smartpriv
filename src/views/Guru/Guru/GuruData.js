import { useState, useEffect } from "react";
import { Badge, Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Pencil, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";

function GuruData() {
    const [datas, setDatas] = useState([]);
    const [swalProps, setSwalProps] = useState({
        show: false,
        onConfirmHandle: {},
    });

    // Ambil ID guru yang login dari localStorage
    const loggedInGuruId = localStorage.getItem("guru_id");

    useEffect(() => {
        fetch("/api/guru") // Ambil semua data guru dari API
            .then((res) => res.json())
            .then((data) => {
                // Filter hanya data guru yang sesuai dengan ID login
                const filteredData = data.filter((guru) => guru.id === loggedInGuruId);
                setDatas(filteredData);
            })
            .catch((err) => console.error("Error fetching:", err));
    }, []);

    const columns = [
        {
            name: "No",
            cell: (row, index) => index + 1,
        },
        {
            name: "Nama",
            selector: (row) => row.nama,
        },
        {
            name: "No HP",
            selector: (row) => row.no_hp,
        },
        {
            name: "Alamat",
            selector: (row) => row.alamat,
        },
        {
            name: "Aksi",
            cell: (row) => (
                <div className="d-flex gap-1">
                    <Badge><Pencil /></Badge>
                </div>
            ),
        },
    ];

    return (
        <>
            <SweetAlert2 {...swalProps} onConfirm={swalProps.onConfirmHandle} />
            <Card>
                <Card.Body className="p-4">
                    <h3>Data Guru</h3>
                    <DataTable columns={columns} data={datas} persistTableHead />
                </Card.Body>
            </Card>
        </>
    );
}

export default GuruData;
