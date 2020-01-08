import localStorage from './localStorage'

const MODE = {
    NORMAL: "normal",
    OT: "ot"
}

const SAVE_TYPE = {
    // 强制保存，离开页面时触发
    FORCE: 1,
    // 自动保存
    AUTO: 2,
    // 用户主动执行保存
    USER_SAVE: 3,
    // 用户主动执行发布
    USER_PUBLISH: 4
}

const DOCUMENT_CURSOR = '<cursor />'
const DOCUMENT_TYPE = '<!doctype itellyou>'
const DOCUMENT_PARAGRAPH = '<p><br /></p>'
const DOCUMENT_VERSION = '<meta name="doc-version" content="1" />'

class EditorBiz {

    constructor(doc , dispatch , options){
        const { me , mode } = options || {}
        // 服务端文档的最新数据
        this.doc = doc || {}
        this.me = me
        this.mode = mode || MODE.NORMAL
        this.dispatch = dispatch
        // 基线版本
        this.baseVersion = this.doc.draft_version || 0
        // 用 Map，方便后续额外存储其它数据
        this.cacheKeys = this._getCacheKeys()
    }

    adaptDocToDocument(doc){
        const { draft_version , updated_time , content } = doc
        return {
            origin: "database",
            draft_version,
            base_timestamp: updated_time,
            value: content
        }
    }

    adaptCacheDataToDocument(data){
        if (!data) return null
        try {
            const value = JSON.parse(data)
            if ("object" !== typeof value) return null
            return {
                origin: "cache",
                draft_version: value.draft_version,
                base_timestamp: value.base_timestamp || null,
                value: value.content
            }
        } catch (error) {
            throw error
        }
    }

    adaptChangeToCacheData(change , timestamp ){
        const { draft_version , value } = change
        return JSON.stringify({
            draft_version,
            base_timestamp: timestamp,
            content: value
        })
    }

    /**
     * 是否有更新版本
     * @param {object} lock 服务端返回的锁信息
     */
    hasNewVersion(lock) {
        return this.baseVersion < lock.draft_version
    }

    /**
     * 判断内容是否有变更
     * 简化状态控制，不采用基于编辑器的 onChange 去记录的方式
     * 根据最后一次保存的内容精确判断
     * 忽略光标移动导致的变更
     *
     * @param {string} content 待判断的内容，通常为从编辑器获取的内容
     * @return {boolean}
     */
    isContentChanged(content) {
        const base = this.doc.content || ''
        if(base === '' && this.isEmpty(content)){
            return false
        }
        return base.trim().replace(DOCUMENT_CURSOR, '') !== content.trim().replace(DOCUMENT_CURSOR, '')
    }

    isEmpty(content){
        return content.trim().replace(DOCUMENT_CURSOR, '').replace(DOCUMENT_TYPE,'').replace(DOCUMENT_PARAGRAPH,'').replace(DOCUMENT_VERSION,'') === ''
    }

    onSaved(doc) {
        // 更新文档内容
        this.doc = Object.assign({}, doc)
        // 更新基线版本
        this.baseVersion = doc.draft_version
    }

    /**
     * 获取初始化编辑器用的文档数据
     * 有 cache 优先使用 cache
     * 没有 cache 时，编辑模式时用原本内容
     *
     * @return {LakeDocument}
     */
    getInitialDocument() {
        // 编辑器使用的文档对象
        const document = this.adaptDocToDocument(this.doc)
        const cached = this._getCachedDocument()
        if(!cached){
            console.log("not found cached content, user server version")
            return document
        }

        const { draft_version , last_editor_id } = this.doc
        if(this.mode === MODE.OT){
            if (cached.draft_version === document.draft_version || cached.base_timestamp === this.doc.updated_time){ 
                return cached
            }
            if (cached.draft_version && cached.draft_version + 1 === draft_version && this.me.id === last_editor_id) { 
                return cached
            }
        } else if (cached.draft_version === document.draft_version) {
            return cached
        }

        try {
            // 额外保存已过期的缓存，以便异常情况下应急处理
            localStorage.set(this.cacheKeys.outdated, localStorage.get(this.cacheKeys.changes))
            localStorage.remove(this.cacheKeys.changes)
        } catch (error) {
            console.log("save outdated cache to server error", error)
        }
        return document
    }

    saveToCache(document){
        if(!document.draft_version){
            document.draft_version = this.doc.draft_version
        }

        const changes = this.adaptChangeToCacheData(document, document.updated_time)
        localStorage.set(this.cacheKeys.changes, changes)
    }

    clearCachedContent(){
        localStorage.remove(this.cacheKeys.changes)
    }

    _getCacheKeys() {
        const prefix = "autosave/docs/".concat(this.doc.id)
        return {
            // 存储变更
            changes: "autosave/docs/".concat(this.doc.id, "/itellyou"),
            // 存储格式异常的本地缓存 - 用于异常处理
            corrupted: "".concat(prefix, "/corrupted"),
            // 存储未保存成功，但服务端有新内容的本地数据 - 用于异常处理
            outdated: "".concat(prefix, "/outdated")
        }
    }

    _getCachedDocument(){
        const data = localStorage.get(this.cacheKeys.changes)
        return this.adaptCacheDataToDocument(data)
    }
}

EditorBiz.SAVE_TYPE = SAVE_TYPE
EditorBiz.MODE = MODE

export default EditorBiz