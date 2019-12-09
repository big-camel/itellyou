import React from 'react'
import { MiniEditor } from '@itellyou/itellyou-editor'

class Common extends React.PureComponent {

    constructor(){
        super()
        this.editorRef = React.createRef()
    }

    onEngineLoaded = engine => {
        this.props.onLoad({
            ref: this.editorRef,
            engine
        })
    }

    renderEditor(){
        const { defaultValue , onChange , onSave , ot} = this.props
        return <MiniEditor
        defaultValue={defaultValue}
        onChange={onChange}
        onSave={onSave}
        onLoad={this.onEngineLoaded}
        ot={ot}
        save={true}
        />
    }

    render(){
        return <div ref={this.editorRef}>
            { 
                this.renderEditor()
            }
        </div>
    }
}

export default Common