import React from 'react'
import { PageHeader , List , Icon , Card , Button } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'
import { connect } from 'dva'
import styles from './List.less'

class TagList extends React.Component {

    state = {
        loading:{},
        size:20,
        page:1,
    }

    componentWillMount(){
        const { location:{ query } } = this.props
        const { page } = query
        this.setState({
            page: parseInt(page || 1)
        })
    }

    componentDidMount(){
        this.getListData()
    }

    onSetTag = tag => {
        const { dispatch , list} = this.props
        const { loading } = this.state
        loading[tag.tag_id] = true
        this.setState({
            loading
        })
        dispatch({
            type:`user/${!tag.star ? 'setTag' : 'delTag'}`,
            payload:{
                tags:[tag.tag_id]
            }
        }).then(res => {
            loading[tag.tag_id] = false
            this.setState({
                loading
            })
            if(res.result){
                const dataList = list.data.map(itemTag => {
                    if(itemTag.tag_id === tag.tag_id){
                        itemTag.star_count = tag.star ? itemTag.star_count - 1 : itemTag.star_count + 1
                        itemTag.star = !tag.star
                    }
                    return itemTag
                })
                dispatch({
                    type:'tag/updateList',
                    payload:{
                        ...list,
                        data:dataList
                    }
                })
            }
        })
    }

    getListData = () => {
        const { dispatch } = this.props
        const { page , size } = this.state
        dispatch({
            type:'tag/list',
            payload:{
                page,
                size
            }
        })
    }

    onPageChange = page => {
        this.setState({
            page
        },
        ()=>{
            this.getListData()
        })
    }

    renderTagList = () => {
        const { list,listLoading } = this.props
        const { loading } = this.state
        if(!list || listLoading){
            return <Loading />
        }
        return <List 
        grid={{ gutter: 16, column: 4 }}
        pagination={{
            onChange:this.onPageChange,
            current:list.page,
            pageSize:list.size,
            total:list.total,
            itemRender:(page,type) => {
                let pageText = page
                if(type === "prev")
                    pageText = "上一页"
                else if(type === "next")
                    pageText = "下一页"
                else if(type === "jump-prev" || type === "jump-next")
                    pageText = <Icon type="ellipsis" />
                return (
                    <Link to={`/tag/list?page=${page}`}>{pageText}</Link>
                )
            }
        }}
        dataSource={list.data}
        renderItem={tag => (
            <List.Item
            key={tag.tag_id}
            >
                <Card
                title={
                    <Link to={`/tag/${encodeURIComponent(tag.tag_name)}`}>{tag.iocn}{tag.tag_name}</Link>
                }
                className={styles['tag-card']}
                actions={
                    [
                        <Button icon="star" loading={loading[tag.tag_id]} type={tag.star ? "primary" : "default"} size="small" onClick={()=>{
                            this.onSetTag(tag)
                        }}>{ tag.star ? "已关注" : "加关注"}</Button>,
                        <span className={styles['star-number']}><strong>{tag.star_count}</strong>关注</span>
                    ]
                }
                >
                    {
                        (tag.tag_summary || tag.tag_summary === "") || "目前还没有关于这个标签的解释"
                    }
                    
                </Card>
            </List.Item>
        )}
        />
    }

    render() {
        return (
            <PageHeader 
                title="标签"
                subTitle={
                    <p>标签不仅能组织和归类你的内容，还能关联相似的内容。<Link to="/tag">查看常用</Link></p>
                }
                className={styles['tag-list']}
                >
                    {this.renderTagList()}
            </PageHeader>
        )
    }
}
export default connect(({ tag ,user,loading }) => ({
    list:tag.list,
    userTag:user.tag,
    listLoading:loading.effects['tag/list']
}))(TagList)