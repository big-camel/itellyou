import { find } from '@/services/path'
export default {
    namespace: 'path',

    state: {
        ...window.appData.path
    },
    effects: {
        *find({ payload : { reducer , ...payload } }, { call , put }){
            const response = yield call(find,payload)
            const { result , data  } = response || {}
            if(result && reducer !== false){
                yield put({
                    type:"setDetail",
                    payload:data
                })
            }
            return response
        }
    },
    reducers:{
        setDetail(state,{ payload }){
            return {
                ...state,
                detail:{...state.detail,...payload}
            }
        }
    }
}