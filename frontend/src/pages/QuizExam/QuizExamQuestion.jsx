import { List, ListItem, Radio, RadioGroup, TextField } from '@mui/material';

export default function QuizExamQuestion({ question }) {
    if (!question) return null;

    return (
        <>
            {question.type === 'MCQ' && (
                <>
                    <h3 className='question-text'>
                        {question.parameters.question}
                    </h3>

                    <ul style={{ listStyle: 'none' }}>
                        {question.parameters.answers.map((option, index) => (
                            <>
                                <li key={index}>
                                    <label>
                                        <input
                                            type='radio'
                                            name='answer'
                                            value={option.id}
                                        />
                                        <span style={{ margin: '0 1rem' }}>
                                            {option.text}
                                        </span>
                                        {option.correct && (
                                            <span
                                                style={{ marginLeft: '1rem' }}
                                            >
                                                (correct answer {option.correct}
                                                )
                                            </span>
                                        )}
                                    </label>
                                </li>
                            </>
                        ))}
                    </ul>
                </>
            )}

            {/* Fill the Blank */}
            {(question.type === 'fill-in-the-blank' ||
                question.type === 'FillTheBlank') && (
                <>
                    <h3 className='question-text'>
                        {question.parameters.question}
                    </h3>

                    <TextField
                        type='text'
                        name='answer'
                        data-is-correct={question.parameters.answer}
                    />

                    <span style={{ marginLeft: '1rem' }}>
                        (correct answer {question.parameters.answer})
                    </span>
                </>
            )}

            {question.type === 'true-false' && (
                <>
                    <h3 className='question-text'>
                        {question.parameters.question}
                    </h3>

                    <ul style={{ listStyle: 'none' }}>
                        <li>
                            <label>
                                <input
                                    type='radio'
                                    name='answer'
                                    value={'true'}
                                    data-is-correct={
                                        question.parameters.isCorrect == true
                                    }
                                />
                                <span style={{ margin: '0 1rem' }}>
                                    {'true'.toUpperCase()}
                                </span>
                                <span style={{ margin: '0 1rem' }}>
                                    (correct answer:{' '}
                                    {question.parameters.isCorrect == true
                                        ? 'true'
                                        : 'false'}
                                    )
                                </span>
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type='radio'
                                    name='answer'
                                    value={'false'}
                                    data-is-correct={
                                        question.parameters.isCorrect == false
                                    }
                                />
                                <span style={{ margin: '0 1rem' }}>
                                    {'false'.toUpperCase()}
                                </span>
                            </label>
                        </li>
                    </ul>
                </>
            )}
        </>
    );
}
