import { init } from '@/services/geetest'
export default {
    namespace: 'geetest',

    state: null,

    effects: {
        *init({ payload }, { call }){
            const response = yield call(init,payload)
            return response
        }
    }
}