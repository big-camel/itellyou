import { post } from '@/services/report'
export default {
    namespace: 'report',

    state: {
        ...window.appData.report
    },
    effects: {
        *post({ payload }, { call , put }){
            const response = yield call(post,payload)
            return response
        }
    },
    reducers:{
    }
}