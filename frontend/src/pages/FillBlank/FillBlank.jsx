import React, { useState } from 'react';
import styles from './fillBlank.module.scss';
import {
    Button,
    CircularProgress,
    FormControl,
    TextField,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import QuestionForm from '../../components/FillBlank/QuestionForm/QuestionForm';
import axios from '../../axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/store';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';

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

const generateFillBlankQuestion = () => {
    return {
        title: '',
        options: [
            {
                id: uuidv4(),
                title: '',
                correct: false,
                tip: '',
                showTip: false,
            },
        ],
    };
};

const FillBlankForm = () => {
    const [question, setQuestion] = useState({
        _id: null,
        parameters: {},
    });
    const [parameters, setParameters] = React.useState(question?.parameters);
    const location = useLocation();
    const params = useParams();
    const [showForm, setShowForm] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const { data: state } = useStore();
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: question.parameters ?? {},
    });

    React.useEffect(() => {
        loadQuestion();
    }, []);

    async function loadQuestion() {
        const { data } = await axios.get(
            `http://localhost:4000/api/interactive-objects/${params.id}`
        );

        if (data) {
            console.log(data);
            setQuestion(data);
            const { parameters } = data;
            // setParameters(parameters);
        }
    }

    const handleEditQuestionParam = (param, value) => {
        setParameters((prevState) => ({ ...prevState, [param]: value }));
    };

    const onClickNew = () => {
        setShowForm(true);
        setParameters(generateFillBlankQuestion());
    };

    const handleFormSubmit = async (values) => {
        // event.preventDefault();

        console.log(state);
        const data = {
            ...state,
            ...question,
            isAnswered: 'g',
            parameters: values,
        };
        console.log(data);
        try {
            setLoading(true);
            const { id } = params;
            await axios.patch(`/interactive-objects/${id}`, {
                ...data,
            });
            toast.success('Question updated successfully!');
            setTimeout(() => {
                // navigate("/");
            }, 2000);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return showForm ? (
        <div className='container'>
            <div className={styles.header}>Fill The Blank</div>
            <div className={styles['image-box']}>
                <img
                    src='/assets/question-bg-2.jpg'
                    alt='question background'
                />
            </div>

            <h3 style={{ margin: '1rem 0' }}>
                {question.questionName} - {question.parameters?.question}
            </h3>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                    <TextField
                        label='Answer'
                        variant='outlined'
                        name='answer'
                        sx={styleSheet.objectName}
                        {...register('answer')}
                        errors={errors}
                    />
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
        </div>
    ) : (
        <div className='container'>
            <Button
                variant='contained'
                size='large'
                startIcon={<AddIcon />}
                onClick={onClickNew}
            >
                New
            </Button>
        </div>
    );
};

export default FillBlankForm;
