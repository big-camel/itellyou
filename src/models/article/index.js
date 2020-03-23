import { list , related , find , view , vote } from '@/services/article/index'
import { setList, replaceItem } from '@/utils/model'

export default {
    namespace: 'article',

    state: {
        ...window.appData.article
    },

    effects: {
        *list({ payload : { append , ...payload} }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'setList',
                payload:{...response.data || {} , append }
            })
        },
        *related({ payload : { append , ...payload}}, { call,put }){
            const response = yield call(related,payload)
            yield put({
                type:'setRelated',
                payload:{append , ...response.data || {}}
            })
        },
        *find({ payload }, { call,put }){
            const response = yield call(find,payload)
            if(response && response.result){
                yield put({
                    type:'updateDetail',
                    payload:response.data
                })
            }
            return response
        },
        *view({ payload }, { call }){
            const response = yield call( view , payload )
            return response
        },
        *vote({ payload }, { call , put , select}){
            const response = yield call(vote,payload)
            if(response && response.result){
                const article = yield select(state => state.article)
                let detail = article && article.detail ? article.detail : null
                
                if(detail && response.data.id === detail.id){
                    response.data['use_support'] = payload.type === "support" ? !detail.use_support : false
                    response.data['use_oppose'] = payload.type === "oppose" ? !detail.use_oppose : false
                    yield put({
                        type:'updateDetail',
                        payload:{...detail,...response.data}
                    })
                }
                const list = yield select(state => state.article ? state.article.list : null)
                const dataItem = list ? list.data.find(item => item.id === response.data.id) : null
                if(dataItem){
                    response.data['use_support'] = payload.type === "support" ? !dataItem.use_support : false
                    response.data['use_oppose'] = payload.type === "oppose" ? !dataItem.use_oppose : false
                }
                yield put({
                    'type':'updateListItem',
                    payload:response.data
                })
            }
            return response
        }
    },
    reducers:{
        updateDetail(state,{ payload }){
            return {
                ...state,
                detail:{...state.detail,...payload}
            }
        },
        setList(state,{ payload }){
            return setList("list",payload,state)
        },
        setRelated(state,{ payload }){
            return setList("related",payload,state)
        },
        updateComments(state,{ payload:{ id, value} }){
            const { detail } = state
            if(detail && detail.id === id){
                return { ...state , detail:{...detail,comments:detail.comments + (value || 1)}}
            }
            return {
                ...state
            }
        },
        updateListItem(state,{ payload }){
            return replaceItem("list",payload,state)
        }
    }
}