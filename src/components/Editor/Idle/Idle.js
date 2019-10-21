class Idle {
    constructor(){
        this.interval = 60
        this.initialed = false
        this.idle = function() {}
        this.active = function() {}
        this.blur = function() {}
    }

    onIdle = fn => {
        this.idle = fn || this.idle
        this._init()
        return this
    }

    onActive = fn => {
        this.active = fn || this.active
        this._init()
        return this
    }

    onBlur = fn => {
        this.blur = fn || this.blur
        this._init()
        return this
    }

    setInterval = time => {
        this.interval = time * 1000
        return this
    }

    destroy = () => {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    _init() {
        if (this.initialed) {
            return
        }
        this.initialed = true
        window.addEventListener('blur', () => {
            this._blur()
        });
        ['mousemove', 'click', 'keyup', 'touchStart'].forEach(event => {
            window.addEventListener(event,() => {
                this._active()
            })
        });
        this._timeGo()
    }

    _timeGo() {
        this.destroy()
        this.timer = setTimeout(() => {
            this._idle()
        }, this.interval)
    }

    _active() {
        if (this.status !== 'active') {
            this.status = 'active'
            this.active()
        }
        this._timeGo()
    }

    _blur() {
        if (this.status !== 'blur') {
            this.status = 'blur'
            this.blur()
        }
    }

    _idle() {
        this.status = 'idle'
        this.idle()
    }
}
export default Idle