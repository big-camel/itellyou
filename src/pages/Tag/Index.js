import React from 'react'
import { List , Modal , Card , PageHeader , Row , Col ,Button , Empty} from 'antd'
import { connect } from 'dva'
import Tag , { TagSelector , TagCreateForm } from '@/components/Tag'
import Loading from '@/components/Loading'
import styles from './Index.less'
import { Link } from 'umi'

class Index extends React.Component {

    state = {
        tagValues:[],
        setTagsing:false
    }

    componentDidMount(){
        const { dispatch } = this.props
        dispatch({
            type:'tag/groupList'
        })
        dispatch({
            type:'user/getTag'
        })
        
    }

    onTagChange = values => {
        this.setState({
            tagValues:values
        })
    }

    onSetTags = () => {
        const { tagValues } = this.state
        const tags = []
        tagValues.forEach(tag => {
            tags.push(tag.key)
        })
        if(tags.length === 0)
            return
        this.setState({
            setTagsing:true
        })
        const { dispatch } = this.props
        dispatch({
            type:'user/setTag',
            payload:{
                tags
            }
        }).then(() => {
            this.setState({
                tagValues:[],
                setTagsing:false
            })
        })
    }

    renderTagGroupList = () => {
        const { groupList,groupLoading } = this.props
        if(!groupList || groupLoading){
            return <Loading />
        }

        return <List 
        grid={{ gutter: 16, column: 4 }}
        dataSource={groupList.data}
        renderItem={item => (
            <List.Item
            key={item.group_id}
            >
            <Card
            title={item.group_name}
            className={styles['tag-card']}
            bordered={false}
            >
                {
                    item.tags.map(tag => (
                        <Tag
                        className={styles['tag-item']}
                        key={tag.tag_id} 
                        href={`/tag/${encodeURIComponent(tag.tag_name)}`}
                        title={tag.tag_name}
                        />
                    ))
                }
                
            </Card>
            </List.Item>
        )}
        />
    }

    render(){
        const { tagValues , setTagsing } = this.state
        const userTag = this.props.userTag || []
        
        return (
            <div className={styles['tag-layout']}>
                { this.props.userCurrent && (<PageHeader title="我的关注" className={styles['tag-header']}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <TagSelector 
                            values={tagValues}
                            onChange={this.onTagChange}
                            placeholder="添加关注标签"
                            />
                        </Col>
                        <Col span={3}>
                            <Button icon="star" loading={setTagsing} type="primary" style={{width:'100%'}} onClick={this.onSetTags} >加关注</Button>
                        </Col>
                    </Row>
                    <div className={styles['tag-me-list']}>
                        {
                            userTag.map(tag => (
                                <Tag 
                                className={styles['tag-item']} 
                                key={tag.tag_id} 
                                href={`/tag/${encodeURIComponent(tag.tag_name)}`} 
                                title={tag.tag_name}
                                />
                            ))
                        }
                        {
                            userTag.length === 0 && (
                                <Empty 
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="您还未关注任何标签哦~"
                                />
                            )
                        }
                    </div>
                </PageHeader>)}
                <PageHeader 
                title="常用标签"
                subTitle={
                    <p>标签不仅能组织和归类你的内容，还能关联相似的内容。<Link to="/tag/list">查看全部</Link></p>
                }
                className={styles['tag-group-list']}>
                    { this.renderTagGroupList() }
                </PageHeader>
            </div>
        )
    }
}
export default connect(({ tag ,user,loading }) => ({
    userTag:user.tag,
    userCurrent:user.current,
    groupList:tag.groupList,
    groupLoading:loading.effects['tag/groupList']
}))(Index)