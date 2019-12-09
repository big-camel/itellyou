import { set , del } from '@/pages/Question/services/star'

export default {
    namespace: 'star',

    state: {
    },

    effects: {
        *set({ payload }, { call }){
            const response = yield call( set , payload )
            return response
        },
        *del({ payload }, { call }){
            const response = yield call( del , payload )
            return response
        }
    },
    reducers:{
    }
}