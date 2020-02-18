import React , { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import { Table } from 'antd'
import Layout from '../components/Layout'
import Loading from '@/components/Loading'
import { Link } from 'umi'

export default () => {

    const [ page , setPage ] = useState(1)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.userQuestion ? state.userQuestion.list : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['userQuestion/list']

    useEffect(() => {
        dispatch({
            type:'userQuestion/list',
            payload:{
                offset:(page - 1) * limit,
                limit
            }
        })
    },[page, limit, dispatch])

    const renderPage = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>
        }
        if (type === 'next') {
            return <a>下一页</a>
        }
        return originalElement
    }

    const columns = [
        {
            title:"标题",
            dataIndex:"title",
            key:"title",
            ellipsis:true,
            width:350,
            render:(text,{ id }) => {
                return <Link to={`/question/${id}`} target="_blank">{text}</Link>
            }
        },
        {
            title:"回答",
            dataIndex:"answers",
            key:"answers",
            render:(text,{ adopted}) => {
                if(adopted){
                    return `${text} 已解决`
                }
                return text
            }
        },
        {
            title:"关注",
            dataIndex:"star",
            key:"star",
        },
        {
            title:"评论",
            dataIndex:"comments",
            key:"comments",
        },
        {
            title:"状态",
            dataIndex:"status",
            key:"status",
            render:(_,{ published , draft_version , version }) => {
                if(draft_version > version) return "未更新"
                if(published){
                    return "已发布"
                }
                return "未发布"
            }
        },
        {
            dataIndex:"action",
            key:"action",
            render:(_,{ id }) => {
                return <Link to={`/question/${id}/edit`} target="_blank">编辑</Link>
            }
        }
    ]

    const renderTable = () => {
        if(!dataSource) return <Loading />
        return (
            <Loading loading={loading} >
                <Table 
                rowKey={row => row.id} 
                columns={columns}
                dataSource={dataSource.data}
                pagination={{
                    onChange:page => {
                        setPage(page)
                    },
                    current:page,
                    itemRender:renderPage,
                    hideOnSinglePage:true,
                    pageSize:limit,
                    total:dataSource ? dataSource.total : 0
                }}
                />
            </Loading>
        )
    }

    return (
        <Layout defaultKey="question">
            {
                renderTable()
            }
        </Layout>
        
    )
}