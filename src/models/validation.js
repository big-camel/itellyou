import { sendMobileCode } from '@/services/validation'
export default {
    namespace: 'validation',

    state: {},

    effects: {
        *sendMobileCode({ payload }, { call }){
            const response = yield call(sendMobileCode,payload)
            return response
        }
    }
}