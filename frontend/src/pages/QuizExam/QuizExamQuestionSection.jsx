import {
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import QuizExamQuestion from './QuizExamQuestion';

export default function QuizExamQuestionSection({
    questions,
    question,
    onAnswer,
    studentsList,
    activeStudent,
    onSelectStudent,
}) {
    const answerQuestion = () => {
        let answer = document.querySelector('input[name="answer"]');
        if (question.type === 'MCQ' || question.type === 'true-false') {
            // get which answer input is checked
            answer = document.querySelector('input[name="answer"]:checked');
        }

        // validate if question answer was correct
        let correct = false;
        if (question.type === 'MCQ') {
            const correctAnswer = question.parameters?.answers?.find(
                (a) => a.correct
            );
            correct = answer.value === correctAnswer.id;
        } else if (question.type === 'true-false') {
            correct =
                answer.value ===
                (question.parameters.isCorrect ? 'true' : 'false');
        } else if (
            question.type === 'fill-in-the-blank' ||
            question.type === 'FillTheBlank'
        ) {
            correct = answer.value === question.parameters.answer;
        }

        onAnswer(question, correct, answer.value);
    };

    console.log(question._id);

    return (
        <>
            {!question._id && (
                <>
                    <h4>Questions list</h4>
                    <p>Please Answer all your quiz questions</p>

                    <div style={{ width: '60%' }}>
                        <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                                Select Student
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Select Student'
                                placeholder='Select Student'
                                name='student'
                                required
                                style={{ width: '100%', margin: '1.2rem 0' }}
                                value={activeStudent?._id ?? ''}
                                onChange={(e) =>
                                    onSelectStudent({
                                        _id: e.target.value,
                                        exam: document.querySelector(
                                            '#examName'
                                        )?.value,
                                        name: studentsList.find(
                                            (x) => x._id == e.target.value
                                        )?.name,
                                    })
                                }
                            >
                                {studentsList &&
                                    studentsList.map((item, idx) => (
                                        <MenuItem
                                            key={item._id}
                                            value={String(item._id)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                </>
            )}
            {question._id === 'result' && (
                <>
                    <h4>Quiz Result</h4>
                    <h5 style={{ color: 'teal' }}>
                        Questions Answered correct:{' '}
                        {
                            questions.filter((q) => q.isAnswerCorrect === true)
                                .length
                        }{' '}
                        (
                        {
                            questions.filter((q) => q.isAnswerCorrect === true)
                                .length
                        }{' '}
                        / {questions.length})
                    </h5>
                    <h5 style={{ color: 'red' }}>
                        Questions Answered Wrong:{' '}
                        {
                            questions.filter((q) => q.isAnswerCorrect === false)
                                .length
                        }{' '}
                        (
                        {
                            questions.filter((q) => q.isAnswerCorrect === false)
                                .length
                        }{' '}
                        / {questions.length})
                    </h5>
                    <h5 style={{ color: 'gray' }}>
                        Questions not answered:{' '}
                        {
                            questions.filter(
                                (q) => q.isAnswerCorrect === undefined
                            ).length
                        }{' '}
                        (
                        {
                            questions.filter(
                                (q) => q.isAnswerCorrect === undefined
                            ).length
                        }{' '}
                        / {questions.length})
                    </h5>
                </>
            )}
            {!!question._id && (
                <>
                    <QuizExamQuestion question={question} />

                    {!question.canNotBeAnswered &&
                        question.isAnswerCorrect === undefined &&
                        question._id !== 'result' && (
                            <div className='actions'>
                                <button
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        transition:
                                            'background-color 0.3s ease',
                                        margin: '2rem 0',
                                    }}
                                    onClick={answerQuestion}
                                >
                                    save answer
                                </button>
                                {/* <button
                            onClick={() => answerQuestion('good')}
                        >
                            correct
                        </button>
                        <button
                            onClick={() => answerQuestion('bad')}
                        >
                            not correct
                        </button> */}
                            </div>
                        )}
                </>
            )}
        </>
    );
}
