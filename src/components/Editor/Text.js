import React from 'react'
import Editor from '@itellyou/itellyou-editor'
import Title from './Title'
import '@itellyou/itellyou-editor/lib/index.css'

class Text extends React.PureComponent {

    constructor(){
        super()
        // lake 编辑器器引擎实例，保存以便做精确配置编辑器
        this.engine = null
        this.editorRef = React.createRef()
    }

    handleChange = value => {
        this.props.onChange(value)
    }

    componentDidMount() {
        // 激活 onload，构建编辑器实例，传递一些有用的方法、对象给外部用，方便精细化控制编辑器行为
        if (typeof this.props.onLoad === 'function') {
            const instance = {
                ref: this.editorRef,
                engine: this.engine
            }
            this.props.onLoad(instance)
        }
    }

    render(){
        const { title,onSaveTitle,onSave } = this.props
        return (
            <div id="lark-text-editor" ref={this.editorRef}>
                <Editor 
                lang="zh-cn"
                defaultValue={this.props.defaultValue}
                image={{
                    uploadAction:'http://api-app.itellyou.com/upload/image?type=image'
                }}
                video={{
                    uploadAction:'http://api-app.itellyou.com/upload/video'
                }}
                file={{
                    uploadAction:'http://api-app.itellyou.com/upload/file'
                }}
                onLoad={ engine => {
                    this.engine = engine
                }}
                mention={{
                    action: '/api/users/complete',
                    getDefaultSuggestions: function (){
                        return [{index:0,name:'test1'},{index:1,name:'test2'},{index:1,name:'test3'},{index:2,name:'test4'}]
                    },
                    paramName: 'q'
                }}
                lockedtext={{
                    action: "/api/services/crypto"
                }}
                header={<Title 
                    onSave={onSaveTitle}
                    title={title}
                    key="title-editor"
                    tabIndex={1}
                />}
                onChange={ this.handleChange }
                onSave={onSave}
                />
            </div>
        )
    }
}
export default Text