import React from 'react'
import { Link } from 'umi'

export default (actors,count) => {
    const components = actors.map(({ id , name },index) => {
        return <span key={id}><Link target="_balnk" to={`/user/${id}`}>{name}</Link>{index !== actors.length - 1 ? "、" : ""}</span>
    })
    if(count > actors.length){
        components.push(` 等${count}人`)
    }
    return components
}