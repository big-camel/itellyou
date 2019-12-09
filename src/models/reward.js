import { findConfig } from '@/services/reward'
export default {
    namespace: 'reward',

    state: {
        ...window.appData.reward
    },
    effects: {
        *findConfig({ payload }, { call , put }){
            const response = yield call(findConfig,payload)
            if(response.reuslt){
                yield put({
                    type: 'setConfig',
                    payload: response.data
                })
            }
            return response
        }
    },
    reducers:{
        setConfig(state,{ payload }){
            return {
                ...state,
                config:payload
            }
        }
    }
}