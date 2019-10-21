import React from 'react'
import { ContentView } from '@itellyou/itellyou-editor'
/**
 * 文本类文档阅读器
 * 适用于文档、评论、主题
 * 实现为 PureComponent，传入最小集合避免不必要渲染
 */
class Viewer extends React.PureComponent { 
    renderContent() {
        const { content } = this.props
        // Lake 内容为空时，不执行渲染
        if (!content) return <span></span>
        return <ContentView 
            content={content}
            genAnchor={this.props.genAnchor}
            onLoad={this.props.onReady}
        />
    }

    render() {
        return <div>
            {this.renderContent()}
        </div>
    }
}
export default Viewer