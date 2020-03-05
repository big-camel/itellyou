import React from 'react'
import Follow from './Follow'
import Like from './Like'
import Comment from './Comment'
import Answer from './Answer'

export default ({ display , dataSource:{action , ...item }}) => {
    display = display || "simple"
    const getAction = () => {
        switch(action){
            case "follow": return <Follow display={display} {...item} />
            case "like": return <Like display={display} {...item} />
            case "comment": return <Comment display={display} {...item} />
            case "answer": return <Answer display={display} {...item} />
        }
    }

    return getAction()
}