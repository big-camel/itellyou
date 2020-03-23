import { info } from '@/services/bank'
export default {
    namespace: 'bank',

    state: {
        ...window.appData.bank
    },
    effects: {
        *info({ payload }, { call , put }){
            const response = yield call(info,payload)
            const { result , data  } = response || {}
            if(result){
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