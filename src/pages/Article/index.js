import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import { Row, Col } from 'antd'
import Article from "@/components/Article"
import { MoreList } from '@/components/List'
import styles from './index.less'
import HotColumn from './components/HotColumn'
import HotTag from './components/HotTag'

function ArticleIndex({ location:{ query } , match:{ params }}) {

    const [offset,setOffset] = useState(parseInt(query.offset || 0))
    const limit = parseInt(query.limit || 20)
    const type = params.type || "default"

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.article ? state.article.list : null)
    
    useEffect(() => {
        dispatch({
            type:'article/list',
            payload:{
                offset,
                limit,
                type
            }
        })
    },[offset, limit, type, dispatch])

    const renderItem = item => {
        return (
            <MoreList.Item
            key={item.id}
            >
                <Article 
                data={item} 
                authorSize="small"
                />
            </MoreList.Item>
        )
    }

    return (
        <Row >
            <Col xs={24} sm={18}>
                <div>
                    <div>
                        <Link to="/article">最新文章</Link>
                        <Link to="/article/hot">热门文章</Link>
                        <Link to="/article/star">我的关注</Link>
                    </div>
                </div>
                <div>
                    <MoreList 
                    renderItem={renderItem}
                    offset={offset} 
                    limit={limit} 
                    dataSource={dataSource} 
                    onChange={offset => setOffset(offset)} 
                    />
                </div>
            </Col>
            <Col xs={24} sm={6}>
                <HotColumn />
                <HotTag />
            </Col>
        </Row>
    )
}
export default ArticleIndex