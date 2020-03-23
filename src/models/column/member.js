import { list } from '@/services/column/member'
import { setList, removeItem , replaceItem} from '@/utils/model'

export default {
    namespace: 'columnMember',

    state: {},

    effects: {
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type: 'setList',
                payload: response.data
            })
            return response
        }
    },

    reducers:{
        setList(state , { payload }){
            return setList("list",payload,state)
        },
        removeItem(state , { payload } ){
            return removeItem("list",payload.id,state)
        },
        replaceItem(state , { payload } ){
            return replaceItem("list",payload,state)
        }
    }
}