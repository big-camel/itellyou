import { find , getState , create,search , query ,group,list , addVersion , auditList , auditVersion , getDiffBase} from '@/services/tag'

export default {
    namespace: 'tag',

    state: {
        list:null,
        group:null,
        search:null,
        auditList:null
    },

    effects: {
        *find({ payload }, { call , put }){
            const response = yield call(find,payload)
            yield put({
                type:'updateDetail',
                payload:response.data
            })
            return response
        },
        *getState({ payload }, { call }){
            const response = yield call( getState , payload)
            return response
        },
        *create({ payload }, { call }){
            const response = yield call(create,payload)
            return response
        },
        *query({ payload }, { call , put}){
            const response = yield call(query,payload)
            yield put({
                type:'updateDetail',
                payload:response.data
            })
            return response
        },
        *search({ payload }, { call , put }){
            const { enableCreate , ...params } = payload
            if(payload.w === "") return
            const response = yield call(search,params)
            if(response && response.result){
                const { w } = payload
                const { data } = response
                let searchData = []
                if(enableCreate && data.length === 0 && w.trim() !== ""){
                    searchData.push({
                        id:enableCreate,
                        name:w.trim()
                    })
                }else{
                    searchData = data
                }
                yield put({
                    type:"setSearch",
                    payload:searchData
                })
            }
            return response
        },
        *group({ payload }, { call,put }){
            const response = yield call(group,payload)
            yield put({
                type:'updateGroup',
                payload:response.data || null
            })
        },
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'updateList',
                payload:response.data || []
            })
        },
        *auditList({ payload }, { call , put }){
            const response = yield call(auditList,payload)
            yield put({
                type:'updateAuditList',
                payload:response.data || []
            })
        },
        *auditVersion({ payload }, { call }){
            const response = yield call(auditVersion,payload)
            return response
        }
    },
    reducers:{
        setSearch(state,{ payload }){
            return {
                ...state,
                search:payload
            }
        },
        updateDetail(state,{ payload }){
            const { detail } = state
            if(detail && payload && payload.id !== detail.id) return {...state,detail:payload}
            return {
                ...state,
                detail:{...state.detail,...payload}
            }
        },
        updateList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        replaceItem(state,{ payload : { detail } }){
            const list = state.list
            if(list){
                const data = list.data.concat()
                const index = data.findIndex(item => item.id === detail.id)
                if(index >= 0){
                    const item = data[index]
                    data.splice(index,1,{...item,...detail})
                }
                
                return {
                    ...state,
                    list:{...list,data}
                }
            }
            return {
                ...state
            }
        },
        updateAuditList(state,{ payload }){
            return {
                ...state,
                auditList:payload
            }
        },
        updateGroup(state,{ payload }){
            return {
                ...state,
                group:payload
            }
        },
    }
}