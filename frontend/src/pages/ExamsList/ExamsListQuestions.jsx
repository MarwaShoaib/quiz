import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import styles from './examsList.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
    Info,
    Edit,
    ViewColumn,
    Close,
} from '@mui/icons-material';
import axios from '../../axios';
import { toast } from 'react-toastify';
import DeleteModalContent from '../../components/Modal/DeleteModalContent/DeleteModalContent';
import Modal from '../../components/Modal/Modal';
import { useStore } from '../../store/store';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';

export default function ExamsQuestions(props) {
    const { id: examId } = useParams();
    const { data: state } = useStore();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState();
    const [showModal, setShowModal] = React.useState(false);
    const [activeExam, setActiveExam] = React.useState();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchExamsQuestions();
    }, []);

    const onClickAddExam = () => {
        navigate('/add-exam');
    };

    const onClickEditQuestion = (id = null) => {
        navigate(`/exams/${id ?? selectedRowId}/questions`);
    };
    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onDeleteExam = (id) => {
        openModal();
        setActiveExam(id);
    };

    const onConfirmDelete = async () => {
        closeModal();
        try {
            const res = await axios.delete(`/exams/${activeExam}`);
            console.log(res.data);
            toast.success('Exam deleted successfully');
            await fetchExamsQuestions();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            field: 'student',
            headerName: 'student Name',
            flex: 1,
        },
        {
            field: 'question',
            headerName: 'question Name',
            flex: 0.8,
        },
        {
            field: 'answer',
            headerName: 'answer',
            flex: 1,
        },
        {
            field: 'isSuccess',
            headerName: 'Is Success',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.isSuccess ? (
                            <CheckBox color='success' />
                        ) : (
                            <Close color='error' />
                        )}
                    </div>
                );
            },
        },
    ];

    const fetchExamsQuestions = React.useCallback(async () => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(`/exams/${examId}/questions`);
        const data = res.data;
        console.log(data);
        if (!!data.length) {
            setRows(
                data.map((item) => ({
                    id: item._id,
                    student: item.studentTitle,
                    question: item.questionName,
                    isSuccess: item.isSuccess,
                    answer: item.answer,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
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
                    <h3>Exam Questions</h3>
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
