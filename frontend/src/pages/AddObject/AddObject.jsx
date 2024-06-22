import React, { useState } from 'react';
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
    domainList,
    languageList,
    subDomainList,
    getDomainName,
    getSubDomainName,
    comlixetyList,
} from '../../config';
import axios from '../../axios';
import { toast } from 'react-toastify';

import styles from './addObject.module.scss';
const generateQuestionsList = () => {
    return {};
};
const AddObject = () => {
    const [questionList, setquestionsList] = React.useState([]);
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
    const [topics, setTopics] = React.useState([]);
    const [activeTopic, selectTopic] = React.useState({
        _id: 0,
        title: '',
    });

    const [subDomain, setSubDomain] = React.useState(null);

    const getQuestionTypes = async () => {
        const res = await axios.get('interactive-object-types');
        setInteractiveObjectTypes(res.data);
        const types = res.data.map((item) => item.typeName);
        setTypes(types);
    };

    const getTopics = async () => {
        const res = await axios.get(
            'http://localhost:4000/api/topics?paginate=false'
        );
        setTopics(res.data);
    };

    React.useEffect(() => {
        getQuestionTypes();
        getTopics();
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
        const savedQuestion = await saveObject(data);
        setFormState({ savedQuestion, ...data });
        const { type } = values;
        if (type === 'MCQ') {
            navigate(
                `/add-question/${savedQuestion._id}/multiple-choice/manual`
            );
        } else if (type === 'true-false') {
            navigate(`/add-question/${savedQuestion._id}/true-false/manual`);
        } else if (type === 'fill-in-the-blank' || type === 'FillTheBlank') {
            navigate(
                `/add-question/${savedQuestion._id}/fill-in-the-blank/manual`
            );
        } else if (type === 'drag-the-words' || type === 'DragTheWords') {
            navigate('/add-question/drag-the-words/manual');
        } else if (values.questionType === 'essay-question') {
            navigate('/add-question/essay-question/manual');
        }
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

        const id = await saveObject(data);
        const selectedTypeObject = interactiveObjectTypes.find(
            (item) => item.typeName === values.type
        );
        setFormState({ id, ...data, labels: selectedTypeObject.labels });
        navigate('/scan-and-upload');
    };

    const saveObject = async (data) => {
        const res = await axios.post('/interactive-objects', {
            ...data,
            isAnswered: 'g', // g, y , r
            parameters: {},
        });
        toast.success('Question createed successfully!');
        return res.data;
    };

    return (
        <div className={styles['add-question']}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend>Add Question Object</legend>
                    <div>
                        <Input
                            label='title'
                            name='questionName'
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
                                    <option key={domain.id} value={domain.id}>
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
                                onChange={(e) => setSubDomain(e.target.value)}
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
                            <Select
                                label='topic'
                                name='topicId'
                                register={register}
                                errors={errors}
                                value={activeTopic._id}
                                onChange={(e) => {
                                    selectTopic(
                                        topics.find(
                                            (topic) =>
                                                topic._id == e.target.value
                                        )
                                    );
                                }}
                            >
                                {topics.length > 0 &&
                                    topics
                                        .filter(
                                            (t) => t.subDomainId === subDomain
                                        )
                                        .map((topic, idx) => (
                                            <option key={idx} value={topic._id}>
                                                {topic.title}
                                            </option>
                                        ))}
                            </Select>
                            <input
                                type='hidden'
                                hidden
                                name='topicTitle'
                                value={activeTopic.title || ''}
                            />
                        </div>
                        <div className={styles.row}>
                            <Input
                                label='answerDuration'
                                name='answerDuration'
                                register={register}
                                errors={errors}
                                type='number'
                            />

                            <Select
                                label='complexity'
                                name='complexity'
                                register={register}
                                errors={errors}
                            >
                                {comlixetyList.map((type, idx) => (
                                    <option key={idx} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
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
                                label='question type'
                                name='type'
                                register={register}
                                errors={errors}
                            >
                                {types.map((type, idx) => (
                                    <option key={idx} value={type}>
                                        {type}
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
                                Manual Form
                            </Button>
                            <Button
                                variant='contained'
                                onClick={onClickExcelFile}
                                startIcon={<InsertDriveFileIcon />}
                            >
                                Excel File
                            </Button>
                            <Button
                                variant='contained'
                                onClick={handleSubmit(onSubmitOcr)}
                                startIcon={<ScannerIcon />}
                            >
                                Scan and Upload
                            </Button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default AddObject;
