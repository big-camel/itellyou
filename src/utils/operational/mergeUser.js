import React from 'react'
import { Link } from 'umi'

export default (actors,count) => {
    actors = actors || []
    const components = actors.map(({ id , path , name },index) => {
        return <span key={id}><Link target="_balnk" to={`/${path}`}>{name}</Link>{index !== actors.length - 1 ? "、" : ""}</span>
    })
    if(count > actors.length){
        components.push(` 等${count}人`)
    }
    return components
}