import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrueFalse from './components/TrueFalse/TrueFalse';
import Navbar from './components/Navbar/Navbar';
import Show from './components/Show/Show';
// import FillBlank from "./components/FillBlank/FillBlank";
import MultipleChoice from './components/MultipleChoice/MultipleChoice';
import Bulk from './components/MultipleChoice/Bulk/Bulk';
import 'iframe-resizer/js/iframeResizer.contentWindow'; // add this
import Footer from './components/Footer/Footer';
// import EditQuestion from "./components/Question/EditQuestion/EditQuestion";
import Test from './pages/Test/Test';
import ExcelFile from './components/ExcelFile/ExcelFile';
import MultipleChoiceForm from './pages/MultipleChoiceForm/MultipleChoiceForm';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import Home from './pages/Home/Home';
import AddObject from './pages/AddObject/AddObject';
import AddQuiz from './pages/AddQuiz/AddQuiz';
import QuizList from './pages/QuizList/QuizList';
import HomeForLibrary from './pages/HomeForLibrary/HomeForLibrary';
import HomForQuizManagement from './pages/HomForQuizManagement/HomForQuizManagement';
import HomForQuizRoom from './pages/HomForQuizRoom/HomForQuizRoom';
import TrueFalseForm from './pages/TrueFalseForm/TrueFalseForm';
import FillBlank from './pages/FillBlank/FillBlank';
import EditQuestion from './pages/EditQuestion/EditQuestion';
import DragTheWords from './pages/DragTheWords/DragTheWords';
import EditObject from './pages/EditObject/EditObject';
import EditQuiz from './pages/EditQuiz/EditQuiz';
import EssayQuestion from './pages/Essay-Question/EssayQuestion';
import ScanAndUpload from './pages/ScanAndUpload/ScanAndUpload';
import Test2 from './pages/Test/Test2';
import TopicsList from './pages/TopicsList/TopicsList';
import TopicsAdd from './pages/TopicsAdd/TopicsAdd';
import TopicsEdit from './pages/TopicsEdit/TopicsEdit';
import QuizSelectQuestions from './pages/QuizSelectQuestions/QuizSelectQuestions';
import QuizExam from './pages/QuizExam';
import QuizCriteria from './pages/QuizCriteria/QuizCriteria';
import StudentsList from './pages/Students/StudentsList';
import StudentsAdd from './pages/Students/StudentsAdd';
import StudentsEdit from './pages/Students/StudentsEdit';
import ExamsList from './pages/ExamsList';
import QuizExamsList from './pages/QuizList/QuizExamsList/QuizExamsList';
import ExamsQuestions from './pages/ExamsList/ExamsListQuestions';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Navbar />
                    <ToastContainer autoClose={2000} closeButton={true} />
                    <Routes>
                        <Route path='/' Component={Home} />
                        <Route path='/true-false' Component={TrueFalse} />
                        <Route path='/fill-blank' Component={FillBlank} />
                        <Route
                            path='/multiple-choice'
                            Component={MultipleChoice}
                        />
                        <Route path='/show/:id' Component={Show} />
                        <Route path='/bulk' Component={Bulk} />
                        <Route path='/add-question' Component={AddObject} />
                        <Route path='/add-quiz' Component={AddQuiz} />
                        <Route path='/quiz-list' Component={QuizList} />
                        <Route
                            path='/edit-quiz-list/:id'
                            Component={QuizList}
                        />
                        <Route path='/library' Component={HomeForLibrary} />
                        <Route path='/quiz-management' Component={HomForQuizManagement} />
                        <Route path='/quiz-room' Component={HomForQuizRoom} />
                        <Route
                            path='/scan-and-upload'
                            Component={ScanAndUpload}
                        />
                        <Route
                            path='/add-question/:id/multiple-choice/manual'
                            Component={MultipleChoiceForm}
                        />
                        <Route
                            path='/add-question/drag-the-words/manual'
                            Component={DragTheWords}
                        />
                        <Route
                            path='/add-question/:id/true-false/manual'
                            Component={TrueFalseForm}
                        />
                        <Route
                            path='/add-question/:id/fill-in-the-blank/manual'
                            Component={FillBlank}
                        />
                        <Route
                            path='/add-question/filltheblanks/manual/:id'
                            Component={FillBlank}
                        />
                        <Route
                            path='/add-question/essay-question/manual'
                            Component={EssayQuestion}
                        />

                        <Route path='/dragthewords' Component={DragTheWords} />
                        <Route
                            path='/dragthewords/:id'
                            Component={DragTheWords}
                        />
                        {/* <Route path="/edit/:id" Component={EditQuestion} /> */}
                        <Route path='/edit/:id' Component={EditObject} />
                        <Route path='/editQuiz/:id' Component={EditQuiz} />
                        <Route
                            path='/edit-question/:id'
                            Component={MultipleChoiceForm}
                        />
                        <Route path='/excel-file' Component={ExcelFile} />
                        <Route path='/test' Component={Test} />
                        <Route path='/test2' Component={Test2} />

                        <Route path='/topics' Component={TopicsList} />
                        <Route path='/add-topic' Component={TopicsAdd} />
                        <Route path='/edit-topic/:id' Component={TopicsEdit} />

                        <Route path='/students' Component={StudentsList} />
                        <Route path='/add-student' Component={StudentsAdd} />
                        <Route
                            path='/edit-student/:id'
                            Component={StudentsEdit}
                        />

                        <Route path='/exams' Component={ExamsList} />
                        <Route
                            path='/exams/:id/questions'
                            Component={ExamsQuestions}
                        />

                        <Route
                            path='/quizzes/:id/select-questions'
                            Component={QuizSelectQuestions}
                        />

                        <Route path='/quizzes/:id/exam' Component={QuizExam} />

                        <Route
                            path='/quizzes/:id/criteria'
                            Component={QuizCriteria}
                        />

                        <Route
                            path='/quizzes/:id/exams-list'
                            Component={QuizExamsList}
                        />
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
