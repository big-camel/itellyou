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
        if (key === 'questionNew') {
            router.push('/question/new')
            return
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
    currentUser:user.current
}))(Header)