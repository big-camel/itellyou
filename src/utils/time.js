import moment from 'moment'
const Time = {
    /**
     * 日期时间格式化
     * params
     *   datetime: 时间，moment 支持的时间格式
     *   opts [object] 可选参数
     *      full: 显示最全的时间信息
     *      base: 基于某个时间点来计算，默认值为 now
     * return
     *   今天 HH:mm (今天)
     *   昨天 HH:mm (昨天)
     *   MM-DD HH:mm (今年)
     *   YYYY-MM-DD HH:mm (今年以前, 以及今天以后)
     */
    format: function (datetime) {
        const opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        const dateTime = moment(datetime)
    
        if (opts.full) {
            return dateTime.format('YYYY-MM-DD HH:mm:ss')
        } 

        // 基于某个时间点
        const basetime = opts.base ? moment(opts.base) : moment()
        const isSameYear = dateTime.isSame(basetime, 'year')
        const isSameDay = dateTime.isSame(basetime, 'day')
        const isYesterday = dateTime.isSame(basetime.add(-1, 'day'), 'day')
        let timeTpl = 'MM-DD HH:mm'
        let prefix = ''
    
        if (isSameDay) {
            timeTpl = 'HH:mm';
            prefix = "".concat('今天', " ")
        } else if (isYesterday) {
            timeTpl = 'HH:mm';
            prefix = "".concat('昨天', " ")
        } else if (!isSameYear) {
            timeTpl = 'YYYY-MM-DD HH:mm'
        } else {
            timeTpl = 'MM-DD HH:mm'
        }
        return "".concat(prefix).concat(dateTime.format(timeTpl))
    }
}
export default Time