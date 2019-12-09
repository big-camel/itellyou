import React from 'react'
class Home extends React.Component{

    render(){
        const reg = /^[\da-zA-Z_\-]{0,}$/
        console.log(reg.test("abd.img"))
        return (
            <div style={{textAlign:'center',margin:'20px 0'}}>
                <h2>This is Home</h2>
            </div>
        )
    }
}

export default Home