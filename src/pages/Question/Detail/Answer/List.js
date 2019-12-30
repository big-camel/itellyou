import React, { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'dva'
import { List } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import Item from './Item'
import styles from './Answer.less'
import Loading from '@/components/Loading'

function AnswerList({ questionId , exclude , title , ...props}){

    const [ page , setPage ] = useState(props.page || 1)
    const [ limit , setLimit ] = useState(props.size || 1)
    const [ offset , setOffset ] = useState((page - 1) * limit)
    const [ loading , setLoading ] = useState(false)
    const dispatch = useDispatch()
    const list = useSelector(state => state.answer ? state.answer.list : null)
    
    useEffect(() => {
        if(questionId){
            dispatch({
                type:"answer/list",
                payload:{
                    questionId,
                    offset,
                    limit
                }
            }).then(() => {
                setLoading(false)
            })
        }
    },[offset, limit, questionId, dispatch])

    if(!list) return <Loading />

    let data = list ? list.data || [] : []

    const adopts = []
    const answers = []
    data.forEach(item => {
        if(!item || item.deleted) return
        if(exclude && (Array.isArray(exclude) && exclude.indexOf(item.id) >= 0 || exclude === item.id)) return
        if(item.adopted === true){
            adopts.push(item)
        }else{
            answers.push(item)
        }
    })

    const renderHeader = () => {
        if(title) return <h2 className={styles["answer-title"]}>{title}</h2>
        return <h2 className={styles["answer-title"]}>{adopts.length > 0 ? "其它 " : ""}{list ? list.total : 0} 个回答</h2>
    }

    const renderItem = item => {
        return <Item questionId={questionId} dispatch={dispatch} item={item} />
    }
    
    return (
        
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => {
                setLoading(true)
                setOffset(offset + limit)
            }}
            hasMore={!loading && !list.end}
            useWindow={true}
            >
            <div className={styles['answer-list']}>
                {
                    adopts.length > 0 && (
                            <List 
                            header={<h2 className={styles["answer-title"]}>已采纳答案</h2>}
                            dataSource={adopts}
                            renderItem={renderItem}
                            itemLayout="vertical"
                            />
                    )
                }
                <List 
                header={renderHeader()}
                dataSource={answers}
                renderItem={renderItem}
                itemLayout="vertical"
                />
            </div>
            {
                loading && <Loading />
            }
            </InfiniteScroll>
    )
}
export default AnswerList