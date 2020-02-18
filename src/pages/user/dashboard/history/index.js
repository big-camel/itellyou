import React , { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import { Table, Button } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'
import Timer from '@/components/Timer'
import Layout from '../components/Layout'

export default () => {

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.history ? state.history.list : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['history/list']

    useEffect(() => {
        dispatch({
            type:'history/list',
            payload:{
                append:true,
                offset,
                limit
            }
        })
    },[offset, limit, dispatch])

    const renderPage = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>
        }
        if (type === 'next') {
            return <a>下一页</a>
        }
        return originalElement
    }

    const renderUrl = (type,key) => {
        switch(type){
            case "article":return `/article/${key}`
            case "question":return `/question/${key}`
            case "tag":return `/tag/${key}`
            default: return `/${type}/${key}`
        }
    }

    const columns = [
        {
            title:"标题",
            dataIndex:"title",
            key:"title",
            ellipsis:true,
            width:450,
            render:(text,{ data_type , data_key }) => {
                return <Link to={renderUrl(data_type,data_key)} target="_blank">{text}</Link>
            }
        },
        {
            title:"浏览时间",
            dataIndex:"updated_time",
            key:"updated_time",
            render:(text) => {
                return <Timer time={new Date(text)} />
            }
        }
    ]

    const renderFooter = () => {
        if(dataSource && !dataSource.end){
            return <Button loading={loading} onClick={() => setOffset(offset => offset+=limit)}>加载更多</Button>
        }
        return null
    }

    const renderTable = () => {
        if(!dataSource) return <Loading />
        return <Table 
            rowKey={row => row.id} 
            columns={columns}
            dataSource={dataSource.data}
            pagination={false}
            footer={renderFooter}
            />
        
    }

    return (
        <Layout defaultKey="history">
            {
                renderTable()
            }
        </Layout>
    )
}