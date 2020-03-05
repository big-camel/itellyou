import React from 'react'
import Timer from '@/components/Timer'
import { Link } from 'umi'
import mergeUser from './utils/mergeUser'
import getVerb from './utils/getVerb'


export default ({ display , created_time , type , actors , merge_count , target }) => {
  
    const isSimple = display === "simple"
    const renderUser = () => {
        const components = mergeUser(actors,merge_count)
        components.push(<span key="text">{ getVerb("answer",type) }</span>)
        if(!isSimple){
            components.push(<span> · <Timer time={new Date(created_time)} /></span>)
        }
        return components
    }

    const renderQuestion = () => {
        const { description , question : { id , title } } = target
        if(isSimple){
            return <Link to={`/question/${id}`}>{ title }</Link>
        }
        return <div>
            { description }
            <div>
                { title }
            </div>
        </div>
    }

    const renderContent = () => {
        switch(type){
            case "question":return renderQuestion()
        }
    }
    
    return (
        <div>
            <div>{ renderUser() }</div>
            {
                renderContent()
            }
        </div>
    )
}