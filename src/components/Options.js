import {useQuiz} from "../contexts/QuizContext";

export default function Options() {
    const {questions, dispatch, index, answer} = useQuiz()
    const question = questions.at(index)
    const hasAnswered = answer !== null
    return <div className='options'>
        {question.options.map((option, index) => <button key={option}
                                                         onClick={() => dispatch({type: 'newAnswer', payload: index})}
                                                         disabled={hasAnswered}
                                                         className={`btn btn-option ${index === answer ? 'answer' : ''} ${hasAnswered ? question.correctOption === index ? 'correct' : 'wrong' : ''}`}>
            {option}
        </button>)}
    </div>
}