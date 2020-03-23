import { recommends , writer , answerer } from './service'
import { setList } from '@/utils/model'
export default {
    namespace: 'explore',

    state: {
        ...window.appData.explore
    },
    effects: {
        *recommends({ payload : { append , ...payload } }, { call , put }){
            const response = yield call(recommends,payload)
            if(response && response.result){
                yield put({
                    type:'setRecommends',
                    payload:response.data
                })
            }
            return response
        },
        *writer({ payload : { append , ...payload } }, { call , put }){
            const response = yield call(writer,payload)
            if(response && response.result){
                yield put({
                    type:'setWriter',
                    payload:response.data
                })
            }
            return response
        },
        *answerer({ payload : { append , ...payload } }, { call , put }){
            const response = yield call(answerer,payload)
            if(response && response.result){
                yield put({
                    type:'setAnswerer',
                    payload:response.data
                })
            }
            return response
        }
    },
    reducers:{
        setRecommends(state,{ payload }){
            return setList("recommends",payload,state)
        },
        setWriter(state,{ payload }){
            return setList("writer",payload,state)
        },
        setAnswerer(state,{ payload }){
            return setList("answerer",payload,state)
        },
    }
}