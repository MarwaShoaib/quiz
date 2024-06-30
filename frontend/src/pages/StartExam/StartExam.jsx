import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import QuestionList from "../../components/QuestionList/QuestionList";
import { Button, Checkbox } from "@mui/material";
import {
  RadioButtonCheckedRounded,
  Delete,
  CheckBox,
  Info,
  Edit,
  ViewColumn,
} from '@mui/icons-material';
import CountdownTimer from './CountdownTimer';
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./startExam.module.scss";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import axios from '../../axios';
import SelectQuestionTypeModal from "../../components/Modal/SelectQuestionTypeModal/SelectQuestionTypeModal";
import ConfirmModalContent from '../../components/Modal/ConfirmModalContent/ConfirmModalContent';
import Modal from "../../components/Modal/Modal";
import { toast } from 'react-toastify';
const StartExam = (props) => {

  const navigate = useNavigate();
  const { data: state, setFormState } = useStore();
  const [rows, setRows] = React.useState([]);
  const params = useParams();
  const [question, setQuestion] = useState({
    _id: null,
    parameters: {},
  });
  const { id: quizId } = useParams();
  const [quiz, setQuiz] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const [questions, setQuestions] = React.useState([]);
  const [activeQuestion, setActiveQuestions] = React.useState({
    _id: null,
  });
  const [selectedRowId, setSelectedRowId] = React.useState();
  const [studentsList, setStudents] = React.useState([]);
  const [activeStudent, setActiveStudent] = React.useState({
    _id: null,
  });

  React.useEffect(() => {
    loadQuestion();
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
    if (!!data.length) {
      setRows(
        data.map((item) => ({
          id: item._id,
          name: item.questionName,
          type: item.type,
          subDomain: item.subDomainName,
          complexity: item.complexity,

        }))
      );
    }
    setQuestions([...data.filter((x) => x.parameters)]);
    console.log(data);
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

  //   React.useEffect(() => {
  //     loadQuestion();
  // }, []);

  async function loadQuestion() {
    const { data } = await axios.get(
      `http://localhost:4000/api/interactive-quizs/${params.id}`
    );
    if (data) {
      console.log(data);
      setQuestion(data);
    }
    console.log(data.quizName)
  }
  const columns = [
    // {
    //     field: 'col0',
    //     headerName: '',
    //     width: 70,
    //     renderCell: (params) => (
    //         <Checkbox
    //             checked={params.id == selectedRowId}
    //             value={params.id}
    //             onChange={(e) => {
    //                 console.log(e.target.value);
    //                 setSelectedRowId(e.target.value);
    //             }}
    //         />
    //     ),
    // },
    {
      field: 'name',
      headerName: 'Title',
      width: 200,
      renderCell: (params) => {
        return <Link to={`/create/${params.id}`}>{params.row.name}</Link>;
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 200,
    },
    {
      field: 'subDomain',
      headerName: 'Sub Domain',
      width: 200,
    },
    {
      field: 'complexity',
      headerName: 'Complixety',
      width: 150,
    }

  ];
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
      // name: activeStudent.exam,
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
  const onTimeUp = () => {
    return;

    setQuestions((prev) =>
      prev.map((q) => {
        q.canNotBeAnswered = true;

        return q;
      })
    );
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
      <div >
        <div className={`container  ${styles.home}`}>
          <p>quiz name : {question.quizName}</p>
          <p>student name : {question.quizName}</p>
          <p>user id : {question.quizName}</p>

          <DataGrid
            loading={loading}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            baseCheckbox={RadioButtonCheckedRounded}
            slots={{ toolbar: GridToolbar }}
          />
        </div>
        <div className={styles.tabsWrapper}>
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
    </div>
  );
};

export default StartExam;
