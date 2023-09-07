export default function Options({question, dispatch, answer}) {
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