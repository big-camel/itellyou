import React, { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import { List, Avatar , Button } from 'antd'
import styles from './index.less'

function Column({ location:{ query } }){

    const [offset,setOffset] = useState(parseInt(query.offset || 0))
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['column/list']
    const limit = parseInt(query.limit || 20)
    const type = query.type || "hot"

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:"column/list",
            payload:{
                type:"hot"
            }
        })
    },[offset, limit, type, dispatch])

    const list = useSelector(state => {
        if(state.column) return state.column.list
    })

    const renderItem = ({ id , path , name , avatar , description , star_count , article_count }) => {
        return (
            <List.Item
            key={id}
            >
                <div>
                    <Link to={`/${path}`}><Avatar src={avatar} /></Link>
                </div>
                <h4 className={styles.title}>
                    <Link to={`/${path}`}>{name}</Link>
                </h4>
                <div>
                    { description }
                </div>
                <div>
                    <span>{ star_count }人关注</span>|<span>{ article_count }篇文章</span>
                </div>
                <div><Button href={`/${path}`}>进入专栏</Button></div>
            </List.Item>
        )
    }

    const renderList = () => {
        return (
            <List 
            grid={{ gutter: 16, column: 4 }}
            loading={loading}
            dataSource={list ? list.data : []}
            renderItem={renderItem}
            />
        )
    }

    return (
        <div>
            { renderList() }
            <div>
                <Button onClick={() => { setOffset(offset + limit) }}>换一换</Button>
                <Button href="/column/apply">申请专栏</Button>
            </div>
        </div>
    )
}
export default Column