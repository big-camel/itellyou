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
    const dataSource = useSelector(state => state.userArticle ? state.userArticle.list : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['userArticle/list']

    useEffect(() => {
        dispatch({
            type:'userArticle/list',
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
                return <Link to={`/article/${id}`} target="_blank">{text}</Link>
            }
        },
        {
            title:"赞",
            dataIndex:"support",
            key:"support",
        },
        {
            title:"关注",
            dataIndex:"star_count",
            key:"star_count",
        },
        {
            title:"评论",
            dataIndex:"comment_count",
            key:"comment_count",
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
                return <Link to={`/article/${id}/edit`} target="_blank">编辑</Link>
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
        <Layout defaultKey="article">
            {
                renderTable()
            }
        </Layout>
        
    )
}