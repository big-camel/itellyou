import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import { Row, Col , Button } from 'antd'
import { MoreList } from '@/components/List'
import Question from '@/components/Question'
import GroupUser from './components/GroupUser'

function Index({ location:{ query } , match:{ params }}){

    const [offset,setOffset] = useState(parseInt(query.offset || 0))
  
    const limit = parseInt(query.limit || 20)
    const type = params.type || "default"

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.question ? state.question.list : null)
    
    useEffect(() => {
        dispatch({
            type:'question/list',
            payload:{
                append:offset > 0,
                offset,
                limit,
                type,
                child:1
            }
        })
    },[offset, limit, type, dispatch])

    const renderItem = item => {
        return (
            <MoreList.Item
            key={item.id}
            >
                <Question data={item} />
            </MoreList.Item>
        )
    }

    const renderList = () => {
        return (
            <MoreList 
            renderItem={renderItem}
            dataSource={dataSource}
            offset={offset}
            limit={limit}
            onChange={offset => setOffset(offset)}
            />
        )
    }

    return (
        <Row gutter={16}>
            <Col span={18}>
                <div>
                    <Button icon="edit">提问题</Button>
                    <div>
                        <Link to="/question/hot">热门回答</Link>
                        <Link to="/question/reward">悬赏问答</Link>
                        <Link to="/question">最新问答</Link>
                        <Link to="/question/star">我的关注</Link>
                    </div>
                </div>
                <div>
                    { renderList() }
                </div>
            </Col>
            <Col span={6}>
                <GroupUser />
            </Col>
        </Row>
    )
}
export default Index