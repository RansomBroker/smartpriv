import { Badge, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";
import axios from "axios";

function SiswaData() {
    const navigate = useNavigate();
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [swalProps, setSwalProps] = useState({
        show: false,
        onConfirmHandle: () => {}
    });

    // Fetch siswa data
    const fetchSiswaData = async () => {
        try {
            const response = await axios.get('/api/user');
            // Filter users with level "siswa"
            const siswaData = response.data.filter(user => user.level === "siswa");
            setDatas(siswaData);
        } catch (error) {
            console.error('Error fetching siswa data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSiswaData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/user/${id}`);
            // Refresh data after successful deletion
            fetchSiswaData();
            setSwalProps({ show: false });
        } catch (error) {
            console.error('Error deleting siswa:', error);
        }
    };

    const handleConfirmDelete = (id) => {
        setSwalProps({
            show: true,
            title: 'Konfirmasi',
            text: 'Yakin akan hapus data ini?',
            icon: 'question',
            showCancelButton: true,
            onConfirmHandle: () => handleDelete(id)
        });
    };

    const columns = [
        {
            name: 'No',
            cell: (row, index) => (index + 1),
            width: '70px'
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Nama',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Kelas',
            selector: row => row.kelas || '-',
            sortable: true
        },
        {
            name: 'No HP',
            selector: row => row.nohp
        },
        {
            name: 'Alamat',
            selector: row => row.alamat
        },
        {
            name: 'Aksi',
            cell: (row) => (
                <div className="d-flex gap-1">
                    <Badge 
                        bg="primary" 
                        role="button" 
                        onClick={() => navigate(`/office/siswa/edit/${row.id}`)}
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
            width: '100px'
        }
    ];

    return (
        <>
            <SweetAlert2 {...swalProps} onConfirm={swalProps.onConfirmHandle} />
            <Card>
                <Card.Body className="p-4">
                    <div className="d-flex flex-row justify-content-between">
                        <h3>Data Siswa</h3>
                        <div>
                            <Link to="/office/siswa/add" className="btn btn-outline-dark px-3">
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

export default SiswaData;