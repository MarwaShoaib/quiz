import React, { useState } from 'react';
import styles from './multipleChoiceForm.module.scss';
import { Button, CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import QuestionForm from '../../components/MultipleChoice/QuestionForm/QuestionForm';
import axios from '../../axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/store';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import QuestionNameHeader from '../../components/QuestionNameHeader/QuestionNameHeader';

const generateMultipleChoiceQuestion = () => {
    return {
        question: '',
        answers: [
            {
                id: uuidv4(),
                title: '',
                correct: false,
                tip: '',
                showTip: false,
            },
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

const MultipleChoiceForm = (props) => {
    const [question, setQuestion] = useState({
        _id: null,
        parameters: {},
    });
    const [parameters, setParameters] = React.useState(
        question?.parameters ?? {}
    );
    const { id: quizId } = useParams();
    const location = useLocation();
    const params = useParams();
    const [showForm, setShowForm] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const { data: state } = useStore();
    const navigate = useNavigate();
    const [renderFromModal, setRenderFromModal] = React.useState(false);

    const appendIdToAnswers = (parameters) => {
        const newAnswers = parameters?.answers.map((ans) => ({
            ...ans,
            id: uuidv4(),
        }));
        const newParameters = { ...parameters, answers: newAnswers };
        return newParameters;
    };

    const fetchData = async (id) => {
        const res = await axios.get(`/interactive-objects/${id}`);
        console.log(res.data);
        const { parameters } = res.data;
        const newParameters = appendIdToAnswers(parameters);
        setParameters(newParameters);
    };

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
            const newParameters = appendIdToAnswers(parameters);
            setParameters(newParameters);
        }
    }

    const handleEditQuestionParam = (param, value) => {
        setParameters((prevState) => ({ ...prevState, [param]: value }));
    };

    const onClickNew = () => {
        setShowForm(true);
        setParameters([generateMultipleChoiceQuestion()]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(state);
        const data = {
            ...state,
            ...question,
            isAnswered: 'g',
            parameters,
        };
        console.log(data);
        const { id } = params;
        try {
            setLoading(true);
            if (location.pathname.includes('/edit-question/')) {
                await axios.patch(`/interactive-objects/${id}`, {
                    ...data,
                });
                toast.success('Question updated successfully!');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                console.log(data);
                // await axios.post(`/interactive-objects`, {
                //   ...state,
                //   isAnswered: "g", // g, y , r
                //   parameters,
                // });
                await axios.patch(`/interactive-objects/${id}`, {
                    ...state,
                    ...question,
                    isAnswered: 'g', // g, y , r
                    parameters,
                });
                if (props.onSubmit) {
                    props.onSubmit();
                } else {
                    toast.success('Question update successfully!');
                    setTimeout(() => {
                        // setShowForm(false);
                    }, 2000);
                }
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
        navigate(`/quizzes/${quizId}/select-questions`);
    };

    return showForm ? (
        <>
            <form className='container' onSubmit={handleSubmit}>
                {!renderFromModal && (
                    <>
                        <QuestionNameHeader>Multiple Choice</QuestionNameHeader>
                        <div className={styles['image-box']}>
                            <img
                                src='/assets/question-bg-2.jpg'
                                alt='question background'
                            />
                        </div>
                    </>
                )}

                <h3 style={{ margin: '1rem 0' }}>
                    {question.questionName} - {question.parameters?.question}
                </h3>

                <QuestionForm
                    question={parameters}
                    handleEditQuestionParam={handleEditQuestionParam}
                    renderFromModal={renderFromModal}
                />
                <div className={styles['submit-box']}>
                    <Button
                        type='submit'
                        variant='contained'
                        size='large'
                        disabled={loading}
                    >
                        <span>Submit</span>
                        {loading && <CircularProgress />}
                    </Button>
                </div>
            </form>
        </>
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

export default MultipleChoiceForm;
