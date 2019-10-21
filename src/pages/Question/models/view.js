import { view } from '@/services/question/view'

export default {
    namespace: 'view',

    state: {
    },

    effects: {
        *view({ payload }, { call }){
            const response = yield call( view , payload )
            return response
        }
    },
    reducers:{
    }
}