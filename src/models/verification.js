import { sendMobileCode } from '@/services/verification'
export default {
    namespace: 'verification',

    state: {},

    effects: {
        *sendMobileCode({ payload }, { call }){
            const response = yield call(sendMobileCode,payload)
            return response
        }
    }
}