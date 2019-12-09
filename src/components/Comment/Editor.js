import React from 'react'

class Editor extends React.Component {

    onEditorLoad = editor => {
        this.editor = editor
    }

    onEditorChange = content => {
        this.setState({
            content
        })
    }

    render(){
        return <Editor
        local={!this.question_id}
        onLoad={this.onEditorLoad}
        onDocLoad={this.onDocLoad}
        onChange={this.onEditorChange}
        onSaveBefore={this.onSaveBefore}
        onSaveAfter={this.onSaveAfter}
        onReverted={this.onReverted}
        onPublished={this.onPublished}
        />
    }
}
export default Editor