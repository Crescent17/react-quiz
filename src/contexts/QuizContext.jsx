import {createContext, useContext, useEffect, useReducer} from "react";
import Error from "../components/Error";

const SECS_PER_QUESTION = 30;
const QuizContext = createContext()

function QuizProvider({children}) {

    const initialState = {
        questions: [],

        // loading, error, ready, active, finished
        status: 'loading',
        index: 0,
        answer: null,
        points: 0,
        highscore: 0,
        secondsRemaining: null
    }

    function reducer(state, action) {
        switch (action.type) {
            case 'dataReceived':
                return {...state, questions: action.payload, status: 'ready'}
            case 'dataFailed':
                return {...state, status: 'error'}
            case 'start':
                return {...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION}
            case 'newAnswer':
                const question = state.questions.at(state.index)
                return {
                    ...state,
                    answer: action.payload,
                    points: action.payload === question.correctOption ? state.points + question.points : state.points
                }
            case 'nextQuestion':
                return {...state, answer: null, index: state.index + 1}
            case 'restart':
                return {...initialState, questions: state.questions, status: 'ready'}
            case 'finish':
                return {
                    ...state,
                    status: 'finished',
                    highscore: state.points > state.highscore ? state.points : state.highscore
                }
            case 'tick':
                return {
                    ...state,
                    secondsRemaining: state.secondsRemaining - 1,
                    status: state.secondsRemaining === 0 ? 'finished' : state.status
                }
            default:
                throw new Error('Action is unknown')
        }
    }


    const [{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining
    }, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch('http://localhost:8000/questions')
                const data = await res.json();
                dispatch({type: 'dataReceived', payload: data})
            } catch (err) {
                dispatch({type: 'dataFailed'})
            }
        }

        getData()
    }, []);

    const numQuestions = questions.length
    const maxPossiblePoints = questions.reduce((acc, question) => acc + question.points, 0)

    return <QuizContext.Provider
        value={{
            questions,
            status,
            index,
            answer,
            points,
            highscore,
            secondsRemaining,
            dispatch,
            numQuestions,
            maxPossiblePoints
        }}>
        {children}
    </QuizContext.Provider>
}

function useQuiz() {
    const context = useContext(QuizContext)
    if (!context) throw new Error('No access to context')
    return context
}

export {QuizProvider, useQuiz}