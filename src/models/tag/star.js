import { list ,follow,unfollow } from '@/services/tag/star'

export default {
    namespace: 'tagStar',

    state: {},

    effects: {
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type: 'setList',
                payload: response.data
            })
        },
        *follow({payload:{name , ...payload}}, { call , put }){
            const response = yield call(follow,payload)
            if(response.result){
                yield put({
                    type:'setList',
                    payload:{
                        append:true,
                        end:true,
                        data:[{
                            tag:{
                                id:payload.id,
                                name,
                                use_star:true,
                                star_count:response.data
                            },
                            created_time:new Date()
                        }]
                    }
                })
            }
            return response
        },
        *unfollow({payload:{ name , remove , ...payload }}, { call , put }){
            const response = yield call(unfollow,payload)
            if(response.result){
                const detail = {
                    id:payload.id,
                    name,
                    use_star:false,
                    star_count:response.data
                }
                
                if(remove){
                    yield put({
                        type:'removeItem',
                        payload:{
                            id:payload.id
                        }
                    })
                }else{
                    yield put({
                        type:'replaceItem',
                        payload:detail
                    })
                }
            }
            return response
        }
    },

    reducers:{
        setList(state , {payload:{ append , end , total , data , ...payload }}){
            const key = "list"
            const list = state[key]
            if(!list || !append){
                return {
                    ...state,
                    [key]:{end , total , data , ...payload}
                }
            }
            
            total = list.total
            const dataList = list.data.concat()
            data.forEach(item => {
                const index = dataList.findIndex(child => child.tag.id === item.tag.id)
                if(index < 0){
                    total += 1
                    dataList.push(item)
                }else{
                    const old = dataList[index]
                    dataList.splice(index,1,{...old ,created_time:item.created_time,tag:{...old.tag,...item.tag} })
                }
            })
            return {
                ...state,
                [key]:{...list,end,total,data:dataList}
            }
        },
        removeItem(state , { payload } ){
            const key = "list"
            const list = state[key] ? state[key] : {}
            const data = list.data || [];
            const index = data.findIndex(item => item.tag.id === payload.id)
            if(index >= 0){
                data.splice(index,1)
            }
            return {
                ...state,
                [key]:{...state[key],total:list.total - 1,data}
            }
        },
        replaceItem(state , { payload : { created_time , ...payload} } ){
            const key = "list"
            const list = state[key]
            if(list){
                const data = list.data.concat()
                const index = data.findIndex(item => item.tag.id === payload.id)
                if(index >= 0){
                    const item = data[index]
                    data.splice(index,1,{...item ,tag:{...item.tag,...payload} , created_time })
                }
                
                return {
                    ...state,
                    [key]:{...list,data}
                }
            }
            return {
                ...state
            }
        }
    }
}