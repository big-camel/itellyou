import React from 'react'
// eslint-plugin-react 对 getDerivedStateFromProps 的处理还有 bug，先关掉
// ref: https://github.com/yannickcr/eslint-plugin-react/issues/1759

/* eslint-disable react/no-unused-state */

/**
 * 组件实现为一个非受控组件
 * 标题同时会被顶部的 Title 标题更改，所以会出现需要根据 props 的数据同步 state 的情况
 * 故采用了 getDerivedStateFromProps
 */
class Title extends React.PureComponent {
    state = {
        editing: false,
        title: this.props.title
    }

    getDefaultTitle = () => {
        return '无标题'
    }

    onClick = e => {
        e.preventDefault()
        e.stopPropagation()
    }

    onFocus = e => {
        this.setState({
            editing: true
        })
    }

    handleChange = e => {
        this.setState({
            title: e.target.value
        })
    }
    
    handleKeyDown = e => {
        const code = e.keyCode || e.which
        if(code === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
            e.preventDefault()
            this.props.onSave(this.state.title)
        }
    }
    
    onBlur = () => {
        let title = (this.state.title || "").trim()
        if(title === ""){
            title = this.getDefaultTitle()
        }
        if(title !== this.props.title){
            this.props.onSave(title)
            this.setState({
                editing: false
            })
        }
    }

    static getDerivedStateFromProps(props, state){
        // 保证只有 props 变更时才重新更新 state
        if (state.editing) return null // 非编辑状态，用 props.title 来初始化 state

        if (props.title !== state.title) {
            return {
                title: props.title
            }
        }
        return null
    }

    render(){
        return (
            <div className="lake-title-editor">
                <input 
                type="text" 
                className="lake-title-input"
                value={this.state.title}
                onBlur={this.onBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onFocus={this.onFocus}
                placeholder={this.getDefaultTitle()}
                autoComplete={"off"}
                tabIndex={this.props.tabIndex}
                spellCheck={false}
                onClick={this.onClick}
                maxLength={128}
                />
            </div>
        )
    }
}

export default Title