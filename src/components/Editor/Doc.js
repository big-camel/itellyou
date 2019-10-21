import localStorage from './utils/localStorage'
const DOCUMENT_CURSOR = '<cursor />'
const DOCUMENT_TYPE = '<!doctype lake>'
const DOCUMENT_PARAGRAPH = '<p><br /></p>'
class Doc{
    constructor(doc){
        // 服务端文档的最新数据
        this.doc = doc
        // 基线版本
        this.baseVersion = doc.draft_version 
        // 用 Map，方便后续额外存储其它数据
        this.cacheKeys = this._getCacheKeys()
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
        const base = this.doc.content || this.doc.body_asl || ''
        if(base === '' && this.isEmpty(content)){
            return false
        }
        return base.trim().replace(DOCUMENT_CURSOR, '') !== content.trim().replace(DOCUMENT_CURSOR, '')
    }

    isEmpty(content){
        return content.trim().replace(DOCUMENT_CURSOR, '').replace(DOCUMENT_TYPE,'').replace(DOCUMENT_PARAGRAPH,'') === ''
    }

    onSaved(doc) {
        // 更新文档内容
        this.doc = doc
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
        const document = {
            origin: 'database',
            title: this.doc.title,
            draft_version: this.doc.draft_version,
            value: this.doc.content || this.doc.body_asl
        }
        const cached = this._loadFromCache()
  
        if (cached) {
            // 仅缓存和本地草稿版本一致时才使用缓存中的数据
            if (cached.draft_version === document.draft_version) {
                return cached
            }
            // 额外保存已过期的缓存，以便异常情况下应急处理
            localStorage.set(this.cacheKeys.outdated, localStorage.get(this.cacheKeys.changes))
        }
        return document
    }
    /**
     * 缓存数据
     *
     * @param {object} document
     * @param {string} document.version 当前内容的基线版本
     * @param {string} document.value 内容
     */
    saveToCache(document) {
        const { value,draft_version } = document
        const changes = {
            draft_version,
            content: value
        }
        localStorage.set(this.cacheKeys.changes, JSON.stringify(changes))
    } 

    // 清除缓存的内容
    clearCachedContent() {
        localStorage.remove(this.cacheKeys.changes)
    }

    _getCacheKeys() {
        const prefix = "autosave/docs/".concat(this.doc.id)
        const map = {
            // 存储变更
            changes: "autosave/docs/".concat(this.doc.id, "/lake"),
            // 存储格式异常的本地缓存 - 用于异常处理
            corrupted: "".concat(prefix, "/corrupted"),
            // 存储未保存成功，但服务端有新内容的本地数据 - 用于异常处理
            outdated: "".concat(prefix, "/outdated")
        }
        return map
    }

    /**
     * 从 cache 还原文档数据
     *
     * @return {object|null} null 代表无缓存内容
     */
    _loadFromCache() {
        const key = this.cacheKeys.changes
        const val = localStorage.get(key)
        if (!val) return null
        try {
            const data = JSON.parse(val)
            if (typeof data !== 'object') return null
            const document = {
                // 标记来源为 cache
                origin: 'cache',
                draft_version: data.draft_version,
                value: data.content
            }
            return document
        } catch (e) {
            throw e
        }
    }
}

Doc.SAVE_TYPE = {
    // 强制保存，离开页面时触发
    FORCE: 1,
    // 自动保存
    AUTO: 2,
    // 用户主动执行保存
    USER_SAVE: 3,
    // 用户主动执行发布
    USER_PUBLISH: 4
}
export default Doc