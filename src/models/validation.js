import { sendCode } from '@/services/validation'
export default {
    namespace: 'validation',

    state: {},

    effects: {
        *sendCode({ payload }, { call }){
            const response = yield call(sendCode,payload)
            return response
        }
    }
}