import { mobile , email } from './service'

export default {
    namespace: 'verify',

    state: {},

    effects: {
        *mobile({ payload }, { call }){
            const response = yield call(mobile,payload)
            return response
        },
        *email({ payload }, { call }){
            const response = yield call(email,payload)
            return response
        }
    }
}