import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import styles from './studentsList.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
    Info,
    Edit,
} from '@mui/icons-material';
import axios from '../../../axios';
import { toast } from 'react-toastify';
import DeleteModalContent from '../../../components/Modal/DeleteModalContent/DeleteModalContent';
import Modal from '../../../components/Modal/Modal';
import { useStore } from '../../../store/store';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';

export default function StudentsList(props) {
    const { data: state } = useStore();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState();
    const [showModal, setShowModal] = React.useState(false);
    const [activeStudent, setActiveStudent] = React.useState();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchStudents();
    }, []);

    const onClickAddStudent = () => {
        navigate('/add-student');
    };

    const onClickEditQuestion = (id = null) => {
        navigate(`/edit-student/${id ?? selectedRowId}`);
    };
    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onDeleteStudent = (id) => {
        openModal();
        setActiveStudent(id);
    };

    const onConfirmDelete = async () => {
        closeModal();
        try {
            const res = await axios.delete(`/students/${activeStudent}`);
            console.log(res.data);
            toast.success('Student deleted successfully');
            await fetchStudents();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        // {
        //     field: 'id',
        //     headerName: 'ID',
        //     flex: 0.5,
        // },
        {
            field: 'user_id',
            headerName: 'User ID',
            flex: 0.5,
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            aria-label='edit'
                            color='info'
                            onClick={() => onClickEditQuestion(params.id)}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            aria-label='delete'
                            color='error'
                            onClick={() => onDeleteStudent(params.id)}
                        >
                            <Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    const fetchStudents = React.useCallback(async () => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(`/students`);
        const data = res.data;
        console.log(data.docs);
        if (!!data.docs.length) {
            setRows(
                data.docs.map((item) => ({
                    id: item._id,
                    name: item.name,
                    user_id: item.user_id,
                }))
            );
        }
        setLoading(false);
    }, []);

    return (
        <>
            <Modal show={showModal} handleClose={closeModal}>
                <DeleteModalContent
                    handleClose={closeModal}
                    onDelete={onConfirmDelete}
                />
            </Modal>

            <div className={styles.actionsWrapper}>
                <div>
                    <h3>Students</h3>
                </div>
                <div className={styles.actions}>
                    <Button variant='contained' onClick={onClickAddStudent}>
                        Add Student
                    </Button>
                </div>
            </div>

            <div className={styles.table}>
                <DataGrid
                    loading={loading}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    baseCheckbox={RadioButtonCheckedRounded}
                    slots={{ toolbar: GridToolbar }}
                />
            </div>
        </>
    );
}
