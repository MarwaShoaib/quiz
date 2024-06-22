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

import styles from './topicsAdd.module.scss';

const TopicsAdd = () => {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();
    const { setFormState } = useStore();

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
        navigate(`/topics`);
    };

    const saveObject = async (data) => {
        const res = await axios.post('http://localhost:4000/api/topics', {
            ...data,
        });
        console.log(data, 'data');
        toast.success('Topic created successfully!');
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
                        <legend>Add Topic Form</legend>
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
                                    Add Topic
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

export default TopicsAdd;
