import React , { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import { Table, Button } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'
import Timer from '@/components/Timer'

export default () => {

    const [ page , setPage ] = useState(1)
    const limit = 20
    const [ followLoading , setFollowLoading ] = useState({})

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.questionStar ? state.questionStar.list : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['questionStar/list']

    useEffect(() => {
        dispatch({
            type:'questionStar/list',
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

    const onStar = (id,use_star) => {
        setFollowLoading(loading => {
            return {
                ...loading,
                [id]:true
            }
        })
        
        const type = use_star === false ? "follow" : "unfollow"
        dispatch({
            type:`questionStar/${type}`,
            payload:{
                id
            }
        }).then(() => {
            setFollowLoading(loading => {
                return {
                    ...loading,
                    [id]:false
                }
            })
        })
    }

    const columns = [
        {
            title:"标题",
            dataIndex:"name",
            key:"name",
            ellipsis:true,
            width:350,
            render:(_,{ question : { id , title }}) => {
                return <Link to={`/question/${id}`} target="_blank">{title}</Link>
            }
        },
        {
            title:"关注时间",
            dataIndex:"created_time",
            key:"created_time",
            render:(text , { question : { use_star }}) => {
                if(use_star === false) return
                return <Timer time={new Date(text)} />
            }
        },
        {
            title:"",
            dataIndex:"action",
            key:"action",
            render:(_,{ question : { id , use_star }}) => {
                if(use_star === false){
                    return <Button loading={followLoading[id]} onClick={() => onStar(id,use_star)}>关注</Button>
                }
                return <Button loading={followLoading[id]} onClick={() => onStar(id,use_star)}>取消关注</Button>
            }
        }
    ]

    const renderTable = () => {
        if(!dataSource) return <Loading />
        return (
            <Loading loading={loading} >
                <Table 
                rowKey={row => row.question.id} 
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

    return  renderTable()
}