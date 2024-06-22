import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ShowQuiz from '../../components/ShowQuiz/ShowQuiz';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './show.module.scss';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import SelectQuestionTypeModal from '../../components/Modal/SelectQuestionTypeModal/SelectQuestionTypeModal';
import Modal from '../../components/Modal/Modal';
import { HdrPlus, More, PlusOne } from '@mui/icons-material';
const Show = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const { id: quizId } = useParams();
    const { data: state, setFormState } = useStore();
    const [question, setQuestion] = useState({
        _id: null,
        parameters: {},
    });
    const SelectFromLibrary = () => {
        navigate('/library');
    };
    const onClickCancel = () => {
        navigate('/');
    };
    const onClickSubmit = async () => {};

    const onClickUseCriteria = () => {
        navigate(`/quizzes/${quizId}/criteria`);
    };
    const selectFromAllQuestions = () => {
        navigate(`/quizzes/${quizId}/select-questions`);
    };
    React.useEffect(() => {
        loadQuestion();
    }, []);
    
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
    return (
        <div className={`container  ${styles.home}`}>
            <p>Questions in {question.quizName}: </p>
            <div className={styles.questionType}>
                <Button variant='outlined' onClick={onClickCancel}>
                    <ClearIcon />
                    <span>cancel</span>
                </Button>
                {/* <Button variant="outlined" onClick={onClickCancel}>
          <PlusOne />
          <span>Add Question</span>
        </Button> */}
                <Button
                    variant='contained'
                    // color='secondary'
                    onClick={onClickUseCriteria}
                >
                    <span>use Criteria</span>
                </Button>
                <Button
                    variant='contained'
                    color='warning'
                    onClick={selectFromAllQuestions}
                >
                    <span>Select from All Questions</span>
                </Button>
                {/* <Button
                    variant='contained'
                    color='info'
                    type='submit'
                    onClick={onClickSubmit}
                >
                    <span>Submit</span>
                </Button> */}
            </div>
            <ShowQuiz />
        </div>
    );
};

export default Show;