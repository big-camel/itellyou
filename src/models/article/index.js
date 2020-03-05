import { list , find , view , vote } from '@/services/article/index'

export default {
    namespace: 'article',

    state: {
        ...window.appData.article
    },

    effects: {
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'setList',
                payload:response.data || {}
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
        setList(state,{ payload : { end , total , data , ...payload} }){
            const list = state.list
            if(!list){
                return {
                    ...state,
                    list:{end , total , data , ...payload}
                }
            }
            const dataList = list.data.concat()
            data.forEach(item => {
                if(!dataList.find(child => child.id === item.id)){
                    dataList.push(item)
                }
            })
            return {
                ...state,
                list:{...list,end,total,data:dataList}
            }
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
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex(item => item.id === payload.id)
            if(index >= 0){
                data.splice(index,1,{...data[index],...payload})
            }
            return {
                ...state,
                list:{...state.list,data}
            }
        }
    }
}