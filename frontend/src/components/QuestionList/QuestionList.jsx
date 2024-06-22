import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import styles from './questionList.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
} from '@mui/icons-material';
import Modal from '../Modal/Modal';
import DeleteModalContent from '../Modal/DeleteModalContent/DeleteModalContent';
import axios from '../../axios';
import { toast } from 'react-toastify';
import { useStore } from '../../store/store';

export default function DataQuestionList(props) {
    const location = useLocation();
    const params = useParams();
    const { data: state } = useStore();
    const { id } = params;
    const navigate = useNavigate();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState();
    const [showModal, setShowModal] = React.useState(false);
    const [activeQuestion, setActiveQuestion] = React.useState();

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onDeleteQuestion = (id) => {
        openModal();
        setActiveQuestion(id);
    };
    const onConfirmDelete = async () => {
        closeModal();

        removeQuestionInList(activeQuestion);
    };
    const removeQuestionInList = async (qid) => {
        const loaderId = toast.loading('Removing...');
        const res = await axios
            .delete(`/removeQuestionFromQuiz/${id}/${qid}`)
            .catch((err) => {
                toast.update(loaderId, {
                    render: 'an error occurred',
                    type: 'error',
                    isLoading: false,
                });
            });
        if (!res || !res.data) {
            {
                toast.update(loaderId, {
                    render: 'an error occurred',
                    type: 'error',
                    isLoading: false,
                });
            }
            return;
        }

        toast.update(loaderId, {
            render: 'Questions removed ...',
            type: 'success',
            isLoading: false,
        });
        fetchData(id);
    };

    const renderColorStatus = (status) => {
        let color = { backgroundColor: 'black' };
        if (status === 'g') {
            color = { backgroundColor: 'green' };
        } else if (status === 'y') {
            color = { backgroundColor: 'yellow' };
        } else if (status === 'r') {
            color = { backgroundColor: 'red' };
        }
        return color;
    };

    const columns = [
        {
            field: 'col0',
            headerName: '',
            width: 70,
            renderCell: (params) => (
                <Checkbox
                    checked={params.id == selectedRowId}
                    value={params.id}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setSelectedRowId(e.target.value);
                    }}
                />
            ),
        },
        {
            field: 'name',
            headerName: 'Title',
            width: 200,
            renderCell: (params) => {
                return <Link to={`/show/${params.id}`}>{params.row.name}</Link>;
            },
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 200,
        },
        {
            field: 'domain',
            headerName: 'Domain',
            width: 200,
        },
        {
            field: 'subDomain',
            headerName: 'Sub Domain',
            width: 200,
        },
        {
            field: 'dateModified',
            headerName: 'Date Modified',
            width: 150,
        },
        {
            field: 'hasAnswered',
            headerName: 'Has Answered',
            width: 150,
            renderCell: (params) => {
                return (
                    <div
                        className={styles['circular-status']}
                        style={renderColorStatus(params.row.hasAnswered)}
                    ></div>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => {
                return (
                    <IconButton
                        aria-label='delete'
                        color='error'
                        onClick={() => onDeleteQuestion(params.id)}
                    >
                        <Delete />
                    </IconButton>
                );
            },
        },
    ];

    const fetchQuestions = React.useCallback(async () => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(
            `/questionInQuize/66053cf9a4fa64136ce6e60f`
        );
        const data = res.data;
        console.log(data);
        if (!!data.length) {
            setRows(
                data.map((item) => ({
                    id: item._id,
                    name: item.questionName,
                    type: item.type,
                    domain: item.domainName,
                    subDomain: item.subDomainName,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                    hasAnswered: item.isAnswered,
                }))
            );
        }
        setLoading(false);
    }, []);
    const fetchData = React.useCallback(async (id) => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(`/questionInQuize/${id}`);
        console.log(res.data);
        const data = res.data;
        console.log(data);
        if (!!data.length) {
            setRows(
                data.map((item) => ({
                    id: item._id,
                    name: item.questionName,
                    type: item.type,
                    domain: item.domainName,
                    subDomain: item.subDomainName,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                    hasAnswered: item.isAnswered,
                }))
            );
        }
        setLoading(false);
    }, []);
    React.useEffect(() => {
        if (location.pathname.includes('/edit-quiz-list/')) {
            const { id } = params;
            fetchData(id);
        } else {
            fetchQuestions();
        }
    }, []);

    const onClickAddQuiz = () => {
        navigate('/add-quiz');
    };

    const onClickEditQuestion = () => {
        navigate(`/edit/${selectedRowId}`);
    };

    return (
        <>
            <Modal show={showModal} handleClose={closeModal}>
                <DeleteModalContent
                    handleClose={closeModal}
                    onDelete={onConfirmDelete}
                    title='Confirm Delete'
                    message='Are you sure to delete this question?'
                />
            </Modal>
            <div className={styles.table}>
                {/* <div className={styles.actions}>
          <Button variant="contained" onClick={onClickAddQuiz}>
            Add Quiz
          </Button>
          <Button variant="contained" onClick={onClickEditQuestion}>
            Edit
          </Button>
        </div> */}
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
