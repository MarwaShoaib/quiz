import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { useForm } from 'react-hook-form';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ScannerIcon from '@mui/icons-material/Scanner';
import Input from '../../../components/Input/Input';
import Select from '../../../components/Select/Select';
import { Button } from '@mui/material';
import {
    ownerList,
    comlixetyList,
    domainList,
    languageList,
    subDomainList,
    getDomainName,
    getSubDomainName,
} from '../../../config';
import axios from '../../../axios';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import Modal from '../../../components/Modal/Modal';
import AddQuestionModal from '../../../components/Modal/AddQuestionModal/AddQuestionModal';

import styles from './StudentsAdd.module.scss';

const StudentsAdd = () => {
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
        };
        const id = await saveObject(data);
        setFormState({ id, ...data });
        console.log();
        console.log(values, 'values');
        navigate(`/students`);
    };

    const saveObject = async (data) => {
        const res = await axios.post('http://localhost:4000/api/students', {
            ...data,
        });
        console.log(data, 'data');
        toast.success('Student created successfully!');
        return res.data;
    };

    const onClickCancel = () => {
        navigate('/students');
    };
    return (
        <>
            <div className={styles['add-question']}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <legend>Add Student Form</legend>
                        <div>
                            <Input
                                label='name'
                                name='name'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                            <Input
                                label='User ID'
                                name='user-id'
                                type='text'
                                register={register}
                                errors={errors}
                            />

                            <div className={styles.actions}>
                                <Button
                                    variant='contained'
                                    startIcon={<DesignServicesIcon />}
                                    type='submit'
                                >
                                    Add Student
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

export default StudentsAdd;
