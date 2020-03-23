import { list ,follow,unfollow } from '@/services/column/star'
import { setList, removeItem , replaceItem} from '@/utils/model'

export default {
    namespace: 'columnStar',

    state: {},

    effects: {
        *list({ payload : { append , ...payload } }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type: 'setList',
                payload: {append,...response.data}
            })
        },
        *follow({ payload }, { call , put }){
            const response = yield call(follow,payload)
            if(response.result){
                yield put({
                    type:'replaceItem',
                    payload:{
                        id:payload.id,
                        use_star:true,
                        star_count:response.data,
                        created_time:new Date()
                    }
                })
                yield put({
                    type:'column/updateDetail',
                    payload:{
                        id:payload.id,
                        use_star:true,
                        star_count:response.data
                    }
                })
            }
            return response
        },
        *unfollow({payload:{ name , ...payload }}, { call , put }){
            const response = yield call(unfollow,payload)
            if(response.result){
                const detail = {
                    id:payload.id,
                    use_star:false,
                    star_count:response.data
                }
                yield put({
                    type:'replaceItem',
                    payload:detail
                })
                yield put({
                    type:'column/updateDetail',
                    payload:detail
                })
            }
            return response
        }
    },

    reducers:{
        setList(state , { payload } ){
            return setList("list",payload,state,(child,item) => {
                return child.column.id === item.column.id
            })
        },
        removeItem(state , { payload } ){
            return removeItem("list",payload.id,state,item => {
                return item.column.id === payload.id
            })
        },
        replaceItem(state , { payload:{ created_time , ...payload }} ){
            return replaceItem("list",payload,state,item => {
                return item.column.id === payload.id
            },item => {
                return {...item ,column:{...item.column,...payload} , created_time }
            })
        }
    }
}