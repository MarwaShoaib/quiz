import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { useForm } from 'react-hook-form';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ScannerIcon from '@mui/icons-material/Scanner';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { Button } from '@mui/material';
import {
    ownerList,
    comlixetyList,
    domainList,
    languageList,
    subDomainList,
    getDomainName,
    getSubDomainName,
} from '../../config';
import axios from '../../axios';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import Modal from '../../components/Modal/Modal';
import AddQuestionModal from '../../components/Modal/AddQuestionModal/AddQuestionModal';

import styles from './addQuiz.module.scss';

const AddQuiz = () => {
    const { data: state } = useStore();
    const [showModal, setShowModal] = React.useState(false);
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();
    const { setFormState } = useStore();
    const [types, setTypes] = React.useState([]);
    const [interactiveObjectTypes, setInteractiveObjectTypes] = React.useState(
        []
    );

    const getQuestionTypes = async () => {
        const res = await axios.get('interactive-object-types');
        setInteractiveObjectTypes(res.data);
        const types = res.data.map((item) => item.typeName);
        setTypes(types);
    };

    React.useEffect(() => {
        getQuestionTypes();
    }, []);

    const onClickExcelFile = () => {
        window.open('/excel-file', '_blank');
    };

    const onSubmit = async (values) => {
        const data = {
            ...values,
            domainName: getDomainName(values.domainId),
            subDomainName: getSubDomainName(
                values.domainId,
                values.subDomainId
            ),
        };
        const id = await saveObject(data);
        setFormState({ id, ...data });
        console.log();
        console.log(values, 'values');
        // const { type } = values;
        // if (type === "MCQ") {
        //   navigate("/add-question/multiple-choice/manual");
        // } else if (type === "true-false") {
        //   navigate("/add-question/true-false/manual");
        // } else if (type === "fill-in-the-blank") {
        //   navigate("/add-question/fill-in-the-blank/manual");
        // } else if (type === "drag-the-words") {
        //   navigate("/add-question/drag-the-words/manual");
        // } else if (values.questionType === "essay-question") {
        //   navigate("/add-question/essay-question/manual");
        // }
    };

    const onSelect = async (values) => {
        const data = {
            ...values,
            domainName: getDomainName(values.domainId),
            subDomainName: getSubDomainName(
                values.domainId,
                values.subDomainId
            ),
        };
        const id = await saveObject(data);
        setFormState({ id, ...data });
    };
    const onSubmitOcr = async (values) => {
        const data = {
            ...values,
            domainName: getDomainName(values.domainId),
            subDomainName: getSubDomainName(
                values.domainId,
                values.subDomainId
            ),
        };

        const id = await saveObjec(data);
        setFormState({ id, ...data });
        console.log();
        console.log(values, 'values');
    };

    const saveObject = async (data) => {
        const res = await axios.post('/interactive-quizs', {
            ...data,
        });
        console.log(data, 'data');
        toast.success('Quiz created successfully!');
        console.log(res.data);
        onClickAddQuestion(res.data._id);
        return res.data;
    };
    const saveObjec = async (data) => {
        const res = await axios.post('/interactive-quizs', {
            ...data,
        });
        console.log(data, 'data');
        toast.success('Quiz created successfully!');
        console.log(res.data);
        
        onClickAutoCreate(res.data._id);
        return res.data;
    };
    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);
    const onAddObject = async () => {
        navigate('/add-question');
        // const data = {
        //   ...state,
        //   domainName: getDomainName(state.domainId),
        //   subDomainName: getSubDomainName(state.domainId, state.subDomainId),
        // };
        // const id = await saveObject(data);
        // setFormState({ id, ...data });

        // console.log(state.domainId)
        // if (state.type === "MCQ") {
        //   navigate("/add-question/multiple-choice/manual");
        // } else if (state.type === "true-false") {
        //   navigate("/add-question/true-false/manual");
        // } else if (state.type === "fill-in-the-blank") {
        //   navigate("/add-question/fill-in-the-blank/manual");
        // } else if (state.type === "drag-the-words") {
        //   navigate("/add-question/drag-the-words/manual");
        // } else if (state.type === "essay-question") {
        //   navigate("/add-question/essay-question/manual");
        // }
    };

    const SelectFromLibrary = () => {
        navigate('/library');
    };
    const onClickCancel = () => {
        navigate('/');
    };

    const onClickAutoCreate = (id) => {
        window.open(`/quizzes/${id}/criteria`, '_blank');
    };
    const onClickAddQuestion = (id) => {
        window.open(`/edit-quiz-list/${id}`, '_blank');
    };
    return (
        <>
            <Modal show={showModal} handleClose={closeModal}>
                <AddQuestionModal
                    handleClose={closeModal}
                    onAddNewObject={onAddObject}
                    onSelectFromLibrary={SelectFromLibrary}
                />
            </Modal>
            <div className={styles['add-question']}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <legend>Add Quiz Form</legend>
                        <div>
                            <Input
                                label='title'
                                name='quizName'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                            <div className={styles.row}>
                                <Select
                                    label='object owner'
                                    name='objectOwner'
                                    register={register}
                                    errors={errors}
                                >
                                    {ownerList.map((item, idx) => (
                                        <option key={idx} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    label='domain'
                                    name='domainId'
                                    register={register}
                                    errors={errors}
                                >
                                    {domainList?.map((domain, idx) => (
                                        <option
                                            key={domain.id}
                                            value={domain.id}
                                        >
                                            {domain.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className={styles.row}>
                                <Select
                                    label='sub domain'
                                    name='subDomainId'
                                    register={register}
                                    errors={errors}
                                >
                                    {subDomainList?.[watch().domainId]?.map(
                                        (subDomain, idx) => (
                                            <option
                                                key={subDomain.id}
                                                value={subDomain.id}
                                            >
                                                {subDomain.name}
                                            </option>
                                        )
                                    )}
                                </Select>
                                <Input
                                    label='Total grade'
                                    name='totalGrade'
                                    register={register}
                                    errors={errors}
                                />
                                <Input
                                    label='The pass score'
                                    name='ThePassScore'
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                            <div className={styles.row}>
                                <Input
                                    label='Quiz schedule'
                                    name='quizSchedule'
                                    type='datetime-local'
                                    value='2024-06-01T09:00'
                                    register={register}
                                    errors={errors}
                                />
                                <Input
                                    label='Quiz Duration'
                                    name='quizDuration'
                                    type='time'
                                    value='09:00'
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                            <div className={styles.row}>
                                <Select
                                    label='language'
                                    name='language'
                                    register={register}
                                    errors={errors}
                                >
                                    {languageList.map((item, idx) => (
                                        <option key={idx} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    label='complexity'
                                    name='complexity'
                                    register={register}
                                    errors={errors}
                                >
                                    {comlixetyList.map((item, idx) => (
                                        <option key={idx} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className={styles.actions}>
                                <Button
                                    variant='contained'
                                    startIcon={<DesignServicesIcon />}
                                    type='submit'
                                >
                                    Add Questions
                                </Button>
                                <Button
                                    variant='contained'
                                 //   onClick={onClickExcelFile}
                                    onClick={handleSubmit(onSubmitOcr)}
                                    startIcon={<InsertDriveFileIcon />}
                                >
                                    Auto Create
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={onClickCancel}
                                >
                                    <ClearIcon />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </>
    );
};

export default AddQuiz;
