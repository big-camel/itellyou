import React from 'react'
import Timer from '@/components/Timer'
import { Link } from 'umi'
import getVerb from './utils/getVerb'

export default ({ display , created_time , type , actors , merge_count , target }) => {

    const isSimple = display === "simple"

    const renderUser = () => {
        const components = actors.map(({ id , name },index) => {
            return <span key={id}><Link to={`/user/${id}`}>{name}</Link>{index !== actors.length - 1 ? "、" : ""}</span>
        })
        if(merge_count > actors.length){
            components.push(` 等${merge_count}人`)
        }
        const verb = getVerb("follow",type)
        if(type === "column"){
            const { id , name } = target
            components.push(<span key="column">{verb}<Link to={`/column/${id}`}>{ name }</Link></span>)
        }else if(type === "answer"){
            const { id , question } = target
            components.push(<span key="answer">{verb}<Link to={`/question/${question.id}/answer/${id}`}>{ question.title }</Link></span>)
        }else if(type === "article"){
            const { id , title } = target
            components.push(<span key="column">{verb}<Link to={`/article/${id}`}>{ title }</Link></span>)
        }else if(type === "user"){
            components.push(<span key="user">{verb}</span>)
        }
        
        return components
    }

    if(isSimple) return renderUser()
    
    return (
        <div>
            <div>新增关注<Timer time={new Date(created_time)} /></div>
            <div>
            {
                renderUser()
            }
            </div>
        </div>
    )
}