import React from 'react'
import { Menu, Popover, Icon, Avatar } from 'antd'
import Link from 'umi/link'
import classnames from 'classnames'
import Container from '@/components/Container'
import TopSearch from '@/components/Header/Search'
import logo from '@/assets/logo.svg'
import './index.less'

function Header({ me , onLogout , ...props }){

    const userMenu = (
        <div className='user-menu'>
            {me ? 
            <div className={classnames('user-info','clearfix')}>
                <span className='user-info-name'>{me.name}</span>
                <span className='user-info-login'>{me.login}</span>
            </div> : null
            }
            <Menu>
                <Menu.Divider />
                <Menu.Item key="userCenter"><Link to="/user/dashboard"><Icon type="user" />个人中心</Link></Menu.Item>
                <Menu.Item key="userSetting"><Link to="/user/settings/profile"><Icon type="setting" />账户设置</Link></Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" onClick={onLogout}><Icon type="logout" />退出</Menu.Item>
            </Menu>
        </div>
    )
    
    const editMenu = (
        <Menu>
          <Menu.Item key="question"><Link to="/question/new"><Icon type="question" />提问</Link></Menu.Item>
          <Menu.Item key="article"><Link to="/article/new"><Icon type="setting" />写文章</Link></Menu.Item>
        </Menu>
    )

    const { location } = props
    const query  = location ? location.query || {} : {}
    return (
        <header className="header">
            <Container>
                <React.Fragment>
                    <div className="logo">
                        <a href="/"><img src={logo} alt="" /></a>
                    </div>
                    <nav className='nav'>
                        <Link to="/">首页</Link>
                        <Link to="/question">问答</Link>
                        <Link to="/article">文章</Link>
                        <Link to="/column">专栏</Link>
                        <Link to="/tag">标签</Link>
                        <TopSearch defaultValue={query.q || ""} type={query.t || ""} />
                    </nav>
                    <div className={"user"}>
                    {
                        me ? (
                            <div className={"action"}>
                                <div className={classnames("item","itellyou-popover itellyou-popover-menu ")}>
                                    <Popover 
                                    content={editMenu}
                                    getPopupContainer={
                                        node => node.parentNode
                                    }
                                    >
                                        <div><Icon type="plus" /></div>
                                    </Popover>
                                </div>
                                <div className={"item"}>
                                    <Icon type="bell" />
                                </div>
                                <div className={classnames("item","itellyou-popover itellyou-popover-menu ")}>
                                    <Popover 
                                    content={userMenu} 
                                    getPopupContainer={
                                        node => node.parentNode
                                    }
                                    placement="bottomRight"
                                    >
                                        <div><Avatar src={me.avatar} size={24}/></div>
                                    </Popover>
                                </div>
                            </div>
                        )
                        : (
                            <div>
                                <Link to="/user/login">登录</Link>
                                <Link to="/user/register">注册</Link>
                            </div>
                        )
                    }
                    </div>
                </React.Fragment>
            </Container>
        </header>
    )
    
}
export default Header