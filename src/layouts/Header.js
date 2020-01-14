import React, { Component } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import GlobalHeader from '@/components/GlobalHeader'

class Header extends Component{
    
    onUserMenuClick = ({ key }) => {
        if (key === 'userCenter') {
            router.push('/user')
            return
        }
        else if(key === 'logout'){
            const { dispatch } = this.props
            dispatch({
                type:'user/logout'
            })
        } else if(key === 'userDraft'){
            router.push('/user/draft')
            return
        }
    }

    onActionMenuClick = ({ key }) => {
        switch(key){
            case 'question':
                router.push('/question/new')
                break;
            case 'article':
                router.push('/article/new')
                break;
        }
    }

    render(){
        return (
            <GlobalHeader 
            onUserMenuClick={this.onUserMenuClick}
            onActionMenuClick={this.onActionMenuClick}
            {...this.props}
            />
        )
    }
}
export default connect(({ user }) => ({
    me:user.me
}))(Header)