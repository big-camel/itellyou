import debounce from 'lodash/debounce'
import EditorBiz from "../EditorBiz"
import sharedb from './ot/client'
import { EventEmitter } from "events"

const EVENTS = {
    docLoaded: "docLoaded",
    ready: "ready",
    inactive: "inactive",
    error: "error",
    docDeleted: "docDeleted",
    usersChange: "usersChange",
    saving: "saving",
    saved: "saved",
    published: "published",
    reverted:"reverted",
    broadcast: "broadcast",
    exit: "exit"
}

const ERROR_CODE = {
    INIT_FAILED: "INIT_FAILED",
    SAVE_FAILED: "SAVE_FAILED",
    PUBLISH_FAILED: "PUBLISH_FAILED",
    DISCONNECTED: "DISCONNECTED",
    CONNECTION_ERROR: "CONNECTION_ERROR",
    COLLAB_DOC_ERROR: "COLLAB_DOC_ERROR"
}

const ERROR_LEVEL = {
    FATAL: "FATAL",
    WARNING: "WARNING"
}

const STATUS = {
    initialize: "initialize",
    prepare: "prepare",
    active: "active",
    exit: "exit",
    error: "error",
    deleted: "deleted"
}

const MESSAGE = {
    DOC_PUBLISHED: "DOC_PUBLISHED",
    DOC_DELETED: "DOC_DELETED"
}

class CollabBiz extends EventEmitter {

    constructor( dispatch , options ){
        super()

        this.dispatch = dispatch
        this.ctx = Object.assign({} , options , {
            collab: null
        })
        this.socket = null
        this.engine = null
        this.status = STATUS.initialize
        this.users = []
        this.currentMember = null
        this.editorBiz = null
        this.initialDocument = null
    }

    onPageClose = () => {
        this.exit()
    }

    onVisibilityChange = () => {
        if("hidden" !== document.visibilityState){
            if("visible" === document.visibilityState){
                this.emit(EVENTS.active)
            }
        }else {
            this.emit(EVENTS.inactive)
        }
    }

    init(doc_id){
        this.status = STATUS.initialize 
        this.initialDocument = null

        return this.dispatch({
            type: this.ctx.api.find || "doc/draft",
            payload: {
                data:{
                    id: doc_id,
                    mode:this.ctx.mode
                },
                onError: error => {
                    this.onError({
                        code: ERROR_CODE.INIT_FAILED,
                        level: ERROR_LEVEL.FATAL,
                        message:"加载文档失败",
                        error
                    })
                }
            }
        }).then(res => {
            if(!res.result){
                return
            }
            if(this.local){
                this.local = false
            }
            this.doc = res.data
            const isOT = this.ctx.mode === "collab";
            this.status = isOT ? STATUS.prepare : STATUS.active 
            this.ctx.collab = isOT ? res.data.collab : null
            this.editorBiz = new EditorBiz(this.doc, this.dispatch, {
                mode: isOT ? EditorBiz.MODE.OT : EditorBiz.MODE.NORMAL,
                me: this.ctx.me
            })
            this.initialDocument = this.editorBiz.getInitialDocument()

            this.emit(EVENTS.docLoaded,res.data)
            if(!isOT){
                this.emit(EVENTS.ready)
            }
        })
    }

    initLocal(doc){
        this.doc = doc
        this.status = STATUS.active
        this.ctx.collab = doc.collab
        this.editorBiz = new EditorBiz(this.doc, this.dispatch, {
            mode: EditorBiz.MODE.OT,
            me: this.ctx.me
        })
        this.local = true
        this.initialDocument = this.editorBiz.getInitialDocument()
        this.emit(EVENTS.docLoaded,this.doc)
        this.emit(EVENTS.ready)
    }

    reset(){
        this.exit()
        this.doc = null
        this.users = []
        this.socket = null
        this.currentMember = null
        if(this.editorBiz){
            this.editorBiz.clearCachedContent()
            this.editorBiz = null
        }
        
    }

    start(engine){
        this.engine = engine 
        this.connect()
        if(!this.socket) return
        this.socket.addEventListener("message", event => {
            const data = JSON.parse(event.data)
            if ("members" === data.action) {
                engine.ot.setMembers(data.data)
                this.addMembers(data.data)
                return
            }
            if ("join" === data.action) {
                engine.ot.addMember(data.data)
                this.addMembers([data.data])
                return 
            }
            if ("leave" === data.action) {
                engine.ot.removeMember(data.data)
                this.removeMember(data.data)
                return 
            }
            if ("ready" === data.action){
                this.currentMember = data.data
                engine.ot.setCurrentMember(data.data)
                this.loadDocument() 
            }
            if("broadcast" === data.action) {
                const { body , type } = data.data
                if(body.user.uuid !== this.currentMember.uuid){
                    this.emit(EVENTS.broadcast, {
                        type,
                        body
                    })
                }
            }
        })
        this.bindEvents()
    }

    connect(){
        const { collab } = this.ctx 
        if(!collab || !collab.host || !collab.key || !collab.token){
            return
        }
        const url = collab.host + "/?key=" + collab.key + "&token=" + collab.token
        const socket = new WebSocket(url)
        
        socket.addEventListener("open", () => {
            console.log("collab server connected")
        })
        socket.addEventListener("close", () => {
            console.log("collab server connection close, current status: ", this.status) 
            if(this.status !== STATUS.exit){
                console.log("connect closed")
                this.onError({
                    code: ERROR_CODE.DISCONNECTED,
                    level: ERROR_LEVEL.FATAL,
                    message: "网络连接异常，无法继续编辑"
                })
            }
        })
        socket.addEventListener("error", error => {
            console.log("collab server connection error")
            this.onError({
                code: ERROR_CODE.CONNECTION_ERROR,
                level: ERROR_LEVEL.FATAL,
                message:"网络连接异常，无法继续编辑",
                error
            })
        })
        this.socket = socket
    }

    broadcast(type , body){
        if(!this.socket) return
        this.socket.send(JSON.stringify({
            action: "broadcast",
            data: {
                type,
                body,
                sender: this.currentMember
            }
        }))
    }

    exit(){
        if(this.status !== STATUS.exit){
            this.status = STATUS.exit
            if(this.socket)
                this.socket.close()
        }
    }

    getInitialDocument(){
        return this.initialDocument
    }

    getCollabInstanceId(){
        return this.ctx.collab ? this.ctx.collab.token : null
    }

    cache(value){
        if(this.local) return
        this.editorBiz.saveToCache({
            value
        })
    }

    doSaveContent(value , callback){
        const { type , content , html , ...other } = value
        if("function" !== typeof callback){
            callback = () => {}
        }

        if(!this.editorBiz.isContentChanged(content) && type !== EditorBiz.SAVE_TYPE.FORCE){
            callback()
            return
        }
 
        const data = {
            id: this.doc.id,
            content,
            html,
            ...other,
            save_type: type === EditorBiz.SAVE_TYPE.AUTO ? "auto" : "user"
        }

        this.emit(EVENTS.saving)
        let server = this.ctx.api.update || "doc/update"
        if(this.local){
            server = this.ctx.api.create || "doc/create"
            data.mode = this.ctx.mode
        }
        this.dispatch({
            type: server,
            payload: {
                data,
                onError: error => {
                    this.emit(EVENTS.error, {
                        code: ERROR_CODE.SAVE_FAILED,
                        level: ERROR_LEVEL.WARNING,
                        error
                    })
                }
            }
        }).then(res => {
            if(!res.result){
                callback(res)
                return
            }
            if(this.local){
                this.init(res.data)
                this.doc.id = res.data
            }else{
                const doc = res.data
                this.editorBiz.onSaved(doc)
                this.editorBiz.clearCachedContent()
            }
            this.emit(EVENTS.saved)
            callback(res)
        })
    }

    doPublishDoc(params){
        this.dispatch({
            type: this.ctx.api.publish || "doc/publish",
            payload: {
                data : {
                    id: this.doc.id,
                    ...params
                },
                onError: error => {
                    this.emit(EVENTS.error, {
                        code: ERROR_CODE.PUBLISH_FAILED,
                        level: ERROR_LEVEL.WARNING,
                        error
                    })
                }
            }
        }).then(res => {
            if(res.result){
                this.broadcast(MESSAGE.DOC_PUBLISHED, {
                    user: this.currentMember
                })
            }
            this.emit(EVENTS.published,res)
        })
    }

    onDocReverted(content){
        // 手动修改引擎value，让其同步到 ot 服务器
        this.engine.setValue(content)
        const check = debounce(() => {
            if(this.otDoc && this.otDoc.hasWritePending()){
                check()
            }else{
                this.emit(EVENTS.reverted)
            }
        }, 100)
        check()
    }

    onDocDeleted(){
        this.exit()
        this.broadcast(MESSAGE.DOC_DELETED, {
            user: this.currentMember
        })
    }

    loadDocument(){
        const connection = new sharedb.Connection(this.socket);
        connection.on("receive", event => {
            //console.log("receive", event)
        })

        const doc = connection.get('itellyou', this.ctx.collab.id.toString())
    
        doc.subscribe(error => {
            if (error) {
                console.log("collab doc subscribe error", error)
            }
            else {
                try {
                    this.engine.ot.init(doc)
                    this.status = STATUS.active
                    const members = this.normalizeMembers()
                    this.emit(EVENTS.ready, {
                        isEditingByOtherUser: members.length > 0
                    })
                    this.emit(EVENTS.usersChange, this.normalizeMembers())
                } catch (err) {
                    console.log("itellyou engine init failed:", err)
                }
            } 
        })

        doc.on("create", () => {
            console.log("collab doc create")
        })

        doc.on("load", () => {
            console.log("collab doc loaded")
        })

        doc.on("op", (op, type) => {
            console.log("op", op, type ? "local" : "server")
        })

        doc.on("del", (t, n) => {
            console.log("collab doc deleted", t, n)
            this.emit(EVENTS.docDeleted)
        })
        
        doc.on("error", error => {
            console.log("collab doc error", {
                error,
                origin_code: error.code
            })

            this.onError({
                code: ERROR_CODE.COLLAB_DOC_ERROR,
                message: error.message,
                error,
                level: this.adaptShareErrorLevel(error)
            })
        })
        this.otDoc = doc
    }

    adaptShareErrorLevel(error){
        return ERROR_LEVEL.WARNING
    }

    loadMemberData(){

    }

    bindEvents(){
        window.addEventListener("beforeunload", this.onPageClose)
        window.addEventListener("visibilitychange", this.onVisibilityChange)
        window.addEventListener("pagehide", this.onPageClose)
    }

    addMembers(member){
        this.users = this.users.concat(member)
        if(this.isActive()){
            setTimeout(() => {
                this.emit(EVENTS.usersChange, this.normalizeMembers())
            }, 1000)
        }
    }

    removeMember(member){
        this.users = this.users.filter(user => {
            return user.uuid !== member.uuid
        })
        if(this.isActive()){
            this.emit(EVENTS.usersChange, this.normalizeMembers())
        }
    }

    normalizeMembers(){
        const members = []
        const colorMap = {}
        const users = this.engine.ot.getMembers()
        users.forEach(user => {
            colorMap[user.uuid] = user.color
        })
        const memberMap = {}
        for (let i = this.users.length; i > 0; i--) {
            const member = this.users[i - 1]
            if (!memberMap[member.key]) {
                const cloneMember = Object.assign({}, member)
                cloneMember.color = colorMap[member.uuid]
                memberMap[member.key] = member
                if(member.key !== this.ctx.me.key){
                    members.push(cloneMember)
                }
            }
        }
        return members
    }

    onError(error){
        this.emit(EVENTS.error, error)
        this.status = STATUS.error
    }

    isActive(){
        return this.status === STATUS.active
    }

    isNetworkError(error){
        if (!error) return false
        const errors = [ERROR_CODE.CONNECTION_ERROR, ERROR_CODE.DISCONNECTED]
        return errors.includes(error.code)
    }
}

CollabBiz.STATUS = STATUS
CollabBiz.EVENTS = EVENTS
CollabBiz.ERROR_CODE = ERROR_CODE
CollabBiz.ERROR_LEVEL = ERROR_LEVEL
CollabBiz.MESSAGE = MESSAGE

export default CollabBiz
