import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";

function PrestasiData() {
    const [datas, setDatas] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [swalProps, setSwalProps] = useState({
        show: false,
        onConfirmHandle: {},
    });

    // Simulasi pengambilan role user dari localStorage atau API
    useEffect(() => {
        const role = localStorage.getItem("user_role"); // "admin" atau "guru"
        setUserRole(role);
        fetchPrestasi(role);
    }, []);

    const fetchPrestasi = async (role) => {
        try {
            let response;
            if (role === "admin") {
                response = await fetch("/api/prestasi"); // Admin lihat semua data
            } else {
                response = await fetch("/api/prestasi/guru"); // Guru hanya lihat data miliknya
            }
            const result = await response.json();
            setDatas(result);
        } catch (error) {
            console.error("Error fetching prestasi:", error);
        }
    };

    const submitDelete = (id) => {
        console.log(`Menghapus prestasi dengan ID: ${id}`);
    };

    const handleConfirmDelete = (id) => {
        setSwalProps({
            show: true,
            title: "Konfirmasi",
            text: "Yakin akan hapus data ini?",
            icon: "question",
            showCancelButton: true,
            onConfirmHandle: () => submitDelete(id),
        });
    };

    const columns = [
        {
            name: "No",
            cell: (row, index) => index + 1,
        },
        {
            name: "Nama Siswa",
            selector: (row) => row.nama_siswa,
        },
        {
            name: "Prestasi",
            selector: (row) => row.prestasi,
        },
        {
            name: "Aksi",
            cell: (row) => (
                <div className="d-flex gap-1">
                    <Badge>
                        <Pencil />
                    </Badge>
                    <Badge onClick={() => handleConfirmDelete(row.id)} bg="danger">
                        <Trash />
                    </Badge>
                </div>
            ),
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
                            <Link to={`/office/prestasi_siswa/add`} className="btn btn-outline-dark px-3">
                                <Plus /> Add
                            </Link>
                        </div>
                    </div>

                    <div className="my-5">
                        <DataTable columns={columns} data={datas} persistTableHead />
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default PrestasiData;
