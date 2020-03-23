import React, { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'dva'
import { List } from 'antd'
import styles from './Answer.less'
import { MoreList } from '@/components/List'
import Answer from '@/components/Answer'

function AnswerList({ question_id , exclude , title , ...props}){

    const page = parseInt(props.page || 1)
    const limit = parseInt(props.size || 20)
    const [ offset , setOffset ] = useState((page - 1) * limit)
    const dispatch = useDispatch()
    const list = useSelector(state => state.answer ? state.answer.list : null)
    
    useEffect(() => {
        if(question_id){
            dispatch({
                type:"answer/list",
                payload:{
                    question_id,
                    offset,
                    limit,
                    append:offset > 0
                }
            })
        }
    },[offset, limit, question_id, dispatch])

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
        return <Answer key={item.id} data={item} />
    }
    
    return (
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
                <MoreList
                header={renderHeader()}
                dataSource={{...list,data:answers}}
                renderItem={renderItem}
                offset={offset}
                limit={limit}
                onChange={offset => setOffset(offset)}
                />
            </div>
    )
}
export default AnswerList