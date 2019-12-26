import { find , findDraft , deleteDraft , deleteAnswer , revokeDelete , list , vote } from '../services/answer'

export default {
    namespace: 'answer',

    state: {
        ...window.appData.answer
    },

    effects: {
        *list({ payload }, { call , put}){
            const response = yield call(list,payload)
            if(response && response.result){
                yield put({
                    type:'setList',
                    payload:response.data
                })
            }
            return response
        },
        *find({ payload }, { call , put }){
            const response = yield call(find,payload)
            if(response && response.result){
                const detail = response.data
                yield put({
                    type:'setDetail',
                    payload:detail
                })
            }
            return response
        },
        *findDraft({ payload }, { call , put , select}){
            if(!payload){
                const question = yield select(state => state.question)
                const detail = question ? question.detail : null
                if(!detail) return
                payload = {questionId : detail.id}
            }
            const response = yield call(findDraft,payload)
            if(response && response.result){
                yield put({
                    type:'question/setUserAnswer',
                    payload:response.data
                })
            }
            return response
        },
        *deleteDraft({ payload }, { call , put , select }){
            const question = yield select(state => state.question)
            const detail = question ? question.detail : null
            if(!detail) return
            payload.questionId = detail.id
            const response = yield call(deleteDraft,payload)
            if(response && response.result){
                yield put({
                    type:'question/setUserAnswer',
                    payload:{
                        draft:false
                    }
                })
            }
            return response
        },
        *delete({ payload }, { call , put , select }){
            const response = yield call(deleteAnswer,payload)
            if(response , response.result){
                const userAnswer = yield select(state => state.question ? state.question.user_answer : null)
                const answer = yield select(state => state.answer)
                let detail = answer && answer.detail ? {...answer.detail, deleted : true} : null
                if(detail && userAnswer && userAnswer.id === detail.id){
                    yield put({
                        type:'setDetail',
                        payload:detail
                    })
                }else{
                    detail = response.data
                }
                if(userAnswer && userAnswer.id === detail.id){
                    yield put({
                        type:'question/setUserAnswer',
                        payload:{
                            deleted:detail.deleted
                        }
                    })
                }
                const list = answer ? answer.list : null
                if(list){
                    const data = list.data
                    const index = data.findIndex(item => item.id === detail.id)
                    data.splice(index,1,detail)
                    yield put({
                        type:'setList',
                        payload:{ ...list , data , total:list.total-1}
                    })
                }
            }
            return response
        },
        *revoke({ payload }, { call , put , select}){
            const response = yield call(revokeDelete,payload)
            if(response , response.result){
                const userAnswer = yield select(state => state.question ? state.question.user_answer : null)
                const answer = yield select(state => state.answer)
                let detail = answer && answer.detail ? {...answer.detail, deleted : false} : null
                if(detail && userAnswer && userAnswer.id === detail.id){
                    yield put({
                        type:'setDetail',
                        payload:detail
                    })
                }else{
                    detail = response.data
                }
                if(userAnswer && userAnswer.id === detail.id){
                    yield put({
                        type:'question/setUserAnswer',
                        payload:{
                            deleted:detail.deleted
                        }
                    })
                }
                
                const list = answer ? answer.list : null
                if(list){
                    let data = list.data
                    const index = data.findIndex(item => item.id === detail.id)
                    
                    if(index >= 0){
                        data.splice(index,1,detail)
                    }else{
                        data = [detail]
                    }
                    yield put({
                        type:'setList',
                        payload:{ ...list , data,total:list.total+1}
                    })
                }
            }
            return response
        },
        *vote({ payload }, { call , put , select}){
            const response = yield call(vote,payload)
            if(response , response.result){
                const answer = yield select(state => state.answer)
                let detail = answer && answer.detail ? answer.detail : null
                
                if(detail && response.data.id === detail.id){
                    response.data['use_support'] = payload.type === "support" ? !detail.use_support : false
                    response.data['use_oppose'] = payload.type === "oppose" ? !detail.use_oppose : false
                    yield put({
                        type:'setDetail',
                        payload:{...detail,...response.data}
                    })
                }
                const list = yield select(state => state.answer ? state.answer.list : {})
                const dataItem = list.data.find(item => item.id === response.data.id)
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
        setDetail(state,{ payload }){
            return {
                ...state,
                detail:payload
            }
        },
        updateDetail(state,{ payload }){
            return {
                ...state,
                detail:{...state.detail,...payload}
            }
        },
        setDraft(state,{ payload }){
            return {
                ...state,
                draft:payload
            }
        },
        setList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        updateComments(state,{ payload:{ id, value} }){
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex(item => item.id === id)
            if(index >= 0){
                data.splice(index,1,{...data[index],comments:data[index].comments + (value || 1)})
            }
            return {
                ...state,
                list:{...state.list,data}
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
        },
        updateListAll(state,{ payload }){
            let data = state.list ? state.list.data || [] : [];
            data = data.map(item => {
                return {...item,...payload}
            })
            return {
                ...state,
                list:{...state.list,data}
            }
        },
    }
}