import React, { useEffect } from 'react'
import { useDispatch , useSelector } from 'dva'
import { List } from 'antd'
import styles from './Answer.less'
import Loading from '@/components/Loading'
import Article from '@/components/Article'

function AnswerView({question_id , answer_id , title}){

    const dispatch = useDispatch()
    const detail = useSelector(state => state.answer ? state.answer.detail : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects["answer/find"]

    useEffect(() => {
        if(question_id && answer_id){
            dispatch({
                type:"answer/find",
                payload:{
                    question_id,
                    id:answer_id
                }
            })
        }
    },[question_id, answer_id, dispatch])

    const renderItem = item => {
        return <Article key={item.id} data={item} />
    }
    if(loading) return <Loading />
    const data = detail ? [detail] : []
    return (
        <div className={styles['answer-list']}>
            <List 
            header={title && <h2 className={styles["answer-title"]}>{title}</h2>}
            dataSource={data}
            renderItem={renderItem}
            itemLayout="vertical"
            />
        </div>
    )
}
export default AnswerView