import {
    Box,
    Button,
    Checkbox,
    Input,
    InputLabel,
    Link,
    MenuItem,
    Modal,
    Select,
} from '@mui/material';
import { domainList, subDomainList } from '../../config';
import React, { useEffect, useState } from 'react';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './quizCriteria.module.scss';
import axios from 'axios';
import { RadioButtonCheckedRounded } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function TopicFormSection({ register, area }) {
    const [domain, setDomain] = useState(domainList[0]);

    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const [questions, setQuestions] = useState([]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
        setQuestions([]);
    };
    const handleClose = () => setOpen(false);

    useEffect(() => {
        loadQuestions();
    }, []);

    function loadQuestions() {
        axios
            .get('http://localhost:4000/api/interactive-objects', {
                params: {
                    limit: 1000,
                },
            })
            .then((res) => {
                const data = res.data.docs;
                if (!!data.length) {
                    setRows(
                        data.map((item) => ({
                            id: item._id,
                            name: item.questionName,
                            type: item.type,
                            domain: item.domainName,
                            subDomain: item.subDomainName,
                            dateModified: new Date(
                                item.createdAt
                            ).toLocaleDateString('en-GB'),
                            hasAnswered: item.isAnswered,
                        }))
                    );
                }
            });
    }

    function handleQuestionSelected(e) {
        const checked = e.target.checked;
        if (checked) {
            setQuestions([...questions, e.target.value]);
        } else {
            setQuestions(questions.filter((q) => q !== e.target.value));
        }
    }

    const columns = [
        {
            field: 'col0',
            headerName: '',
            width: 70,
            renderCell: (params) => (
                <Checkbox value={params.id} onChange={handleQuestionSelected} />
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
    ];

    return (
        <>
            <fieldset
                style={{
                    width: '100%',
                    margin: '2rem 0',
                    border: '1px solid #ced4da',
                    borderRadius: '10px',
                    padding: '1rem 1.2rem',
                }}
            >
                <legend style={{ fontSize: 'medium', fontWeight: 560 }}>
                    Add Topic Form
                </legend>
                <div>
                    <Input
                        label='title'
                        name='title'
                        type='text'
                        style={{ width: '100%', marginBottom: '1.5rem' }}
                        placeholder='Enter Topic Title'
                        {...register(`areas[${area}].topic.title`)}
                    />
                    <div className={styles.flexRow}>
                        <div style={{ width: '45%' }}>
                            <InputLabel id='select-domain'>Domain</InputLabel>
                            <Select
                                label='domain'
                                name='domainId'
                                placeholder='Select Domain'
                                style={{ width: '100%' }}
                                {...register(`areas[${area}].topic.domainId`)}
                                onChange={(e) =>
                                    setDomain(
                                        domainList.find(
                                            (d) => d.id == e.target.value
                                        )
                                    )
                                }
                            >
                                {domainList?.map((domain, idx) => (
                                    <MenuItem key={domain.id} value={domain.id}>
                                        {domain.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div style={{ width: '45%' }}>
                            <InputLabel id='select-sub-domain'>
                                Sub Domain
                            </InputLabel>
                            <Select
                                label='sub domain'
                                name='subDomainId'
                                style={{ width: '100%' }}
                                placeholder='Select Sub Domain'
                                {...register(
                                    `areas[${area}].topic.subDomainId`
                                )}
                            >
                                {subDomainList?.[domain.id]?.map(
                                    (subDomain, idx) => (
                                        <MenuItem
                                            key={subDomain.id}
                                            value={subDomain.id}
                                        >
                                            {subDomain.name}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </div>
                    </div>
                </div>

                <input
                    type='hidden'
                    {...register(`areas[${area}].selectedQuestions`)}
                    value={questions?.join(',') ?? ''}
                />

                <div style={{ margin: '1rem 0' }}>
                    <Button
                        color='error'
                        variant='contained'
                        onClick={handleOpen}
                    >
                        Select Questions
                    </Button>
                </div>
            </fieldset>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <div
                    style={{
                        width: '90%',
                        background: '#fff',
                        margin: '2rem auto',
                    }}
                >
                    <DataGrid
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

                    <div
                        style={{
                            margin: '2rem 0',
                            background: '#eee',
                            padding: '1rem',
                        }}
                    >
                        <Button color='error' onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
