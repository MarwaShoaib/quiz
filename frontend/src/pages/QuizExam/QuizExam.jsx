import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import styles from './quizExam.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
    Info,
    Edit,
    Check,
    Close,
    Error,
} from '@mui/icons-material';
import axios from '../../axios';
import { toast } from 'react-toastify';
import DeleteModalContent from '../../components/Modal/DeleteModalContent/DeleteModalContent';
import Modal from '../../components/Modal/Modal';
import { useStore } from '../../store/store';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import ConfirmModalContent from '../../components/Modal/ConfirmModalContent/ConfirmModalContent';
import QuizExamQuestion from './QuizExamQuestion';
import QuizExamQuestionSection from './QuizExamQuestionSection';

export default function QuizSelectQuestions(props) {
    const { id: quizId } = useParams();
    const [quiz, setQuiz] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const navigate = useNavigate();

    const [questions, setQuestions] = React.useState([]);
    const [activeQuestion, setActiveQuestions] = React.useState({
        _id: null,
    });

    const [studentsList, setStudents] = React.useState([]);
    const [activeStudent, setActiveStudent] = React.useState({
        _id: null,
    });

    React.useEffect(() => {
        fetchQuestions();
        fetchStudents();
    }, []);

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onConfirmDelete = async () => {
        closeModal();
        showResultView();
    };

    const fetchQuiz = async () => {
        const res = await axios
            .get(`/interactive-quizs/${quizId}`)
            .catch((err) => {
                toast.error('Error fetching quiz');
            });

        if (!res) toast.error('Error fetching quiz');
        return res.data;
    };

    const fetchQuestions = React.useCallback(async () => {
        const quizResponse = await fetchQuiz();

        if (!quizResponse) return;

        setQuiz(quizResponse);

        setLoading(true);
        const res = await axios.get(`/questionInQuize/${quizId}`);

        if (!res || !res.data) {
            toast.error('error loading questions');
            return;
        }

        console.log(res.data);

        const data = res.data;
        console.log(data);
        setQuestions([...data.filter((x) => x.parameters)]);
        // console.log(data);
        setLoading(false);
    }, []);

    const fetchStudents = React.useCallback(async () => {
        setLoading(true);
        const res = await axios.get(`/students`, { params: { limit: 500 } });

        if (!res || !res.data) {
            toast.error('error loading students');
            return;
        }

        const data = res.data.docs;
        setStudents(data);
        setLoading(false);
    }, []);

    const answerQuestion = (answer) => {
        if (answer === 'good') {
            setQuestions((prev) =>
                prev.map((q) => {
                    if (q._id === activeQuestion._id) {
                        return { ...q, isAnswerCorrect: true };
                    }
                    return q;
                })
            );
        } else if (answer === 'bad') {
            setQuestions((prev) =>
                prev.map((q) => {
                    if (q._id === activeQuestion._id) {
                        return { ...q, isAnswerCorrect: false };
                    }
                    return q;
                })
            );
        }

        selectNextQuestion();
    };

    const selectNextQuestion = () => {
        const index = questions.findIndex((q) => q._id === activeQuestion._id);

        if (index + 1 < questions.length) {
            setActiveQuestions(questions[index + 1]);
        }
    };

    const onTimeUp = () => {
        return;

        setQuestions((prev) =>
            prev.map((q) => {
                q.canNotBeAnswered = true;

                return q;
            })
        );
    };

    const onFinishAttempt = () => {
        // check if all questions was answered
        const unansweredQuestions = questions.filter(
            (q) => q.isAnswerCorrect === undefined
        );

        if (unansweredQuestions.length) {
            return openModal();
        }

        if (!activeStudent?._id) {
            return toast.error('Please select student');
        }

        // show result
        showResultView();
    };

    const calculateResult = () => {
        const answered = questions.filter(
            (q) => q.isAnswerCorrect === true
        ).length;
        const notAnswered = questions.filter(
            (q) => q.isAnswerCorrect !== true
        ).length;
        const total = answered + notAnswered;

        return {
            isPassed: answered > notAnswered,
            percentage: Math.round((answered / total) * 100),
        };
    };

    const showResultView = () => {
        setActiveQuestions({ _id: 'result' });

        // save exam results
        const calculatedResult = calculateResult();
        const data = {
            name: activeStudent.exam,
            studentId: activeStudent._id,
            studentName: activeStudent.name,
            quizId: quiz._id,
            quizTitle: quiz.quizName,
            isPassed: calculatedResult.isPassed,
            successPercentage: calculatedResult.percentage,
            questionList: questions.map((q) => ({
                questionId: q._id,
                questionName: q.questionName,
                studentId: activeStudent._id,
                studentTitle: activeStudent.name,
                answer: q.answerValue,
                isSuccess: q.isAnswerCorrect,
            })),
        };

        // save exam results
        axios
            .post('/exams', data)
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onAnswerQuestion = (q, isCorrect, answerValue) => {
        if (!q) return;

        setQuestions((prev) =>
            prev.map((question) => {
                if (question._id === q._id) {
                    question.isAnswerCorrect = isCorrect;
                    question.answerValue = answerValue;
                }

                return question;
            })
        );

        selectNextQuestion();
    };

    const onSelectStudent = (student) => {
        setActiveStudent(student);
    };

    return (
        <div style={{ padding: '1rem 2rem' }}>
            <Modal show={showModal} handleClose={closeModal}>
                <ConfirmModalContent
                    handleClose={closeModal}
                    onDelete={onConfirmDelete}
                    title='Exit Exam'
                    message='Are you sure to exit this exam?'
                />
            </Modal>

            <div className={styles.tabsWrapper}>
                <div className={styles.tabs}>
                    <div
                        className={`${styles.tab}`}
                        onClick={() => setActiveQuestions({ _id: null })}
                    >
                        <div className={styles.number}>-</div>
                        <div
                            className={`${styles.status} ${
                                activeQuestion._id === null ? styles.active : ''
                            }`}
                        ></div>
                    </div>
                    {questions.map((question, index) => (
                        <div
                            className={`${styles.tab}`}
                            key={question._id}
                            onClick={() => setActiveQuestions(question)}
                        >
                            <div className={styles.number}>{index + 1}</div>
                            <div
                                className={`${styles.status} ${
                                    activeQuestion._id === question._id
                                        ? styles.active
                                        : ''
                                } ${
                                    question.isAnswerCorrect
                                        ? styles.correct
                                        : question.isAnswerCorrect === false
                                        ? styles.notCorrect
                                        : ''
                                } `}
                            >
                                {question.isAnswerCorrect === true && <Check />}
                                {question.isAnswerCorrect === false && (
                                    <Error />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    {questions.length && (
                        <CountdownTimer
                            minutesLeft={questions?.reduce(
                                (a, c) => (a += Number(c.answerDuration)),
                                0
                            )}
                            onTimeUp={onTimeUp}
                        />
                    )}

                    <button onClick={onFinishAttempt}>Finish attempt</button>
                </div>
            </div>

            <div className={styles.questionsWrapper}>
                <QuizExamQuestionSection
                    questions={questions}
                    question={activeQuestion}
                    onAnswer={onAnswerQuestion}
                    studentsList={studentsList}
                    onSelectStudent={onSelectStudent}
                    activeStudent={activeStudent}
                />
            </div>
        </div>
    );
}
