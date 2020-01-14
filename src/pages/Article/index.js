import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import { Row, Col } from 'antd'
import ArticleList from "@/components/Article/List"
import styles from './index.less'

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

    return (
        <Row style={{marginLeft:'-8px',marginRight:'-8px'}}>
            <Col xs={24} sm={18} style={{paddingLeft:'8px',paddingRight:'8px'}}>
                <div>
                    <div>
                        <Link to="/article/hot">热门文章</Link>
                        <Link to="/article">最新文章</Link>
                        <Link to="/article/star">我的关注</Link>
                    </div>
                </div>
                <div>
                    <ArticleList offset={offset} limit={limit} dataSource={dataSource} onChange={offset => setOffset(offset)} />
                </div>
            </Col>
            <Col xs={24} sm={6} style={{paddingLeft:'8px',paddingRight:'8px'}}>dfdfsdf</Col>
        </Row>
    )
}
export default ArticleIndex