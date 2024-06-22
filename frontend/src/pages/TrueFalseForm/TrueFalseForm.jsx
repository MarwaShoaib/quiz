import {
    Box,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import styles from './trueFalseForm.module.scss';
import { Form, useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const styleSheet = {
    objectName: {
        position: 'relative',
        marginBottom: '2rem',
        width: '100%',
    },
    option: {
        // position: "relative",
        width: '90%',
    },
    btn: {
        display: 'flex',
        gap: '.5rem',
    },
    deleteBtn: {},
    box: {
        marginTop: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    treeItem: {
        '.MuiTreeItem-label': {
            fontSize: '1.4rem !important',
            padding: '1rem 0',
        },
    },
};

const TrueFalseForm = () => {
    const params = useParams();
    const [question, setQuestion] = useState({ _id: params.id });
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: question.parameters ?? {},
    });

    useEffect(() => {
        loadQuestion();
    }, []);

    const onSubmitForm = async (data) => {
        // log

        const parameters = {
            ...question.parameters,
            ...data,
            isCorrect: data.isCorrect === 'true',
        };

        const res = await axios
            .patch(
                `http://localhost:4000/api/interactive-objects/${question._id}`,
                {
                    ...question,
                    isAnswered: 'g', // g, y , r
                    parameters,
                }
            )
            .catch((err) => err);

        if (!res || !res.data) {
            toast.error('not updated');
            return;
        }

        toast.success('updated');
    };

    async function loadQuestion() {
        const { data } = await axios.get(
            `http://localhost:4000/api/interactive-objects/${params.id}`
        );

        if (data) {
            console.log(data);
            setQuestion(data);
        }
    }

    return (
        <>
            <Box
                sx={{
                    height: '200px',
                    width: '100%',
                    my: 2,
                    overflow: 'hidden',
                }}
            >
                <img
                    src='/assets/question-bg-1.jpg'
                    alt='question background'
                    style={{
                        postion: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                    }}
                />
            </Box>

            <h3 style={{ margin: '1rem 0' }}>
                {question.questionName} - {question.parameters?.question}
            </h3>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div>
                    <TextField
                        label='Question'
                        variant='outlined'
                        name='question'
                        sx={styleSheet.objectName}
                        {...register('question')}
                        errors={errors}
                    />
                </div>
                <div className={styles.option}>
                    <FormControl>
                        <RadioGroup
                            {...register('isCorrect')}
                            errors={errors}
                            aria-labelledby='demo-radio-buttons-group-label'
                            name='isCorrect'
                            row
                        >
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label='True'
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label='False'
                            />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div style={{ margin: '1rem auto' }}>
                    <button
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease',
                        }}
                        type='submit'
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
};

export default TrueFalseForm;
