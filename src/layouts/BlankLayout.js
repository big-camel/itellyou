import React, { useRef, useEffect } from 'react'
import DocumentTitle from 'react-document-title'
import { withRouter } from 'umi'
import { useSelector, useDispatch } from 'dva'
import NProgress from 'nprogress'
import getPageTitle from '@/utils/getPageTitle'
import defaultSettings from '../../config/defaultSettings'
import 'nprogress/nprogress.css'

function BlankLayout({ route , children , location , title }){
    const { href } = window.location
    const hrefRef = useRef()
    const loading = useSelector(state => state.loading )
    if (hrefRef.current !== href) {
        NProgress.start()
        if (!loading.global) {
            NProgress.done() 
            hrefRef.current = href
        }
    }

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({
            type:"user/fetchMe"
        })
    },[dispatch])

    const { routes = [] } = route || {}
    if(!title){
        const breadcrumbNameMap = {}
        if(route && !route.routes){
            routes.push(route)
        }
        routes.forEach(item => {
            if(item && item.name && item.path){
                breadcrumbNameMap[item.path] = item
            }
        })
        title = getPageTitle(location.pathname , breadcrumbNameMap)
    }else{
        title = `${title} - ${defaultSettings.title}`
    }

    return (
        <DocumentTitle title={title}>
            {
                children
            }
        </DocumentTitle>
    )
}
export default withRouter(BlankLayout)
