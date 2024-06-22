import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import styles from './studentsEdit.module.scss';

const StudentsEdit = () => {
    const params = useParams();
    const { id: studentId } = params;
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
        const res = await axios.get(`/students/${studentId}`).catch((err) => {
            if (err.response.status === 404) {
                navigate('/students');
                toast.error('Student not found');
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
        };
        await saveObject(data);
        setFormState({ id: studentId, ...data });
        console.log();
        console.log(values, 'values');
        navigate(`/students`);
    };

    const saveObject = async (data) => {
        const res = await axios.put('/students/' + studentId, {
            ...data,
        });
        console.log(data, 'data');
        toast.success('Student updated successfully!');
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
                        <legend>Edit Student Form</legend>
                        <div>
                            <Input
                                label='name'
                                name='name'
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
                                    Update Student
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

export default StudentsEdit;
