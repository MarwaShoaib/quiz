import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuestionList from "../../components/QuestionList/QuestionList";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./quizList.module.scss";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import axios from '../../axios';
import SelectQuestionTypeModal from "../../components/Modal/SelectQuestionTypeModal/SelectQuestionTypeModal";
import Modal from "../../components/Modal/Modal";
const QuizList = (props) => {
  
  const navigate = useNavigate();
  const { data: state, setFormState } = useStore();
  const {id: quizId} = useParams();
  const params = useParams();
  const [question, setQuestion] = useState({
    _id: null,
    parameters: {},
});
  const selectFromAllQuestions = () => {
      navigate(`/quizzes/${quizId}/select-questions`)
  };
  const SelectFromLibrary = () => {
    navigate("/library")
  };
  const onClickCancel = () => {
    navigate("/");
  };
  const onAddObject = async () => {
    navigate("/add-question");
  }
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
        <Button variant="outlined" onClick={onClickCancel}>
          <ClearIcon />
          <span>cancel</span>
        </Button>
        <Button variant="contained" color="info"  onClick={onAddObject}>
          <span>Add new Question</span>
        </Button>
        {/* <Button variant="contained" color="info"  onClick={SelectFromLibrary}>
          <span>Select from Q-Bank</span>
        </Button> */}
        <Button variant="contained" color="info"  onClick={selectFromAllQuestions}>
          <span>Select from Q-Bank</span>
        </Button>
      </div>
      <QuestionList />
    </div>
  );
};

export default QuizList;
