import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import styles from './topicsEdit.module.scss';

const TopicsEdit = () => {
    const params = useParams();
    const { id: topicId } = params;
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm({
        defaultValues: async () => fetchData(),
    });
    const { setFormState } = useStore();

    const fetchData = async () => {
        const res = await axios.get(`/topics/${topicId}`).catch((err) => {
            if (err.response.status === 404) {
                navigate('/topics');
                toast.error('Topic not found');
                return;
            }
        });

        if (!res || !res.data) return null;

        console.log(res.data);
        return {
            ...res.data,
        };
    };

    React.useEffect(() => {}, []);

    const onSubmit = async (values) => {
        const data = {
            ...values,
            domainName: getDomainName(values.domainId),
            subDomainName: getSubDomainName(
                values.domainId,
                values.subDomainId
            ),
        };
        await saveObject(data);
        setFormState({ id: topicId, ...data });
        console.log();
        console.log(values, 'values');
        navigate(`/topics`);
    };

    const saveObject = async (data) => {
        const res = await axios.put('/topics/' + topicId, {
            ...data,
        });
        console.log(data, 'data');
        toast.success('Topic updated successfully!');
        return res.data;
    };

    const onClickCancel = () => {
        navigate('/topics');
    };
    return (
        <>
            <div className={styles['add-question']}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <legend>Edit Topic Form</legend>
                        <div>
                            <Input
                                label='title'
                                name='title'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                            <div className={styles.row}>
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
                            </div>

                            <div className={styles.actions}>
                                <Button
                                    variant='contained'
                                    startIcon={<DesignServicesIcon />}
                                    type='submit'
                                >
                                    Update Topic
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

export default TopicsEdit;
