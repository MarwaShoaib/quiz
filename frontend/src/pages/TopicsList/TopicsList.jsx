import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import styles from './topicList.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
    Info,
    Edit,
} from '@mui/icons-material';
import axios from '../../axios';
import { toast } from 'react-toastify';
import DeleteModalContent from '../../components/Modal/DeleteModalContent/DeleteModalContent';
import Modal from '../../components/Modal/Modal';
import { useStore } from '../../store/store';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';

export default function TopicsList(props) {
    const { data: state } = useStore();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState();
    const [showModal, setShowModal] = React.useState(false);
    const [activeTopic, setActiveTopic] = React.useState();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchTopics();
    }, []);

    const onClickAddTopic = () => {
        navigate('/add-topic');
    };

    const onClickEditQuestion = (id = null) => {
        navigate(`/edit-topic/${id ?? selectedRowId}`);
    };
    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onDeleteTopic = (id) => {
        openModal();
        setActiveTopic(id);
    };

    const onConfirmDelete = async () => {
        closeModal();
        try {
            const res = await axios.delete(`/topics/${activeTopic}`);
            console.log(res.data);
            toast.success('Topic deleted successfully');
            await fetchTopics();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            renderCell: (params) => {
                return params.row.name;
            },
        },
        {
            field: 'subDomain',
            headerName: 'Sub Domain',
            flex: 0.8,
        },
        // {
        //     field: 'questionCount',
        //     headerName: 'Questions Count',
        //     flex: 1,
        // },
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
                            onClick={() => onDeleteTopic(params.id)}
                        >
                            <Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    const fetchTopics = React.useCallback(async () => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(`/topics`);
        const data = res.data;
        console.log(data.docs);
        if (!!data.docs.length) {
            setRows(
                data.docs.map((item) => ({
                    id: item._id,
                    name: item.title,
                    subDomain: item.subDomainName,
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
                    <h3>Topics</h3>
                </div>
                <div className={styles.actions}>
                    <Button variant='contained' onClick={onClickAddTopic}>
                        Add Topic
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
