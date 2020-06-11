export const getScrollTop = () => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

export const getOffset = element => {
    if (!element.getClientRects().length)
        return {
            top: 0,
            left: 0,
        };
    const rect = element.getBoundingClientRect();
    const view = element.ownerDocument.defaultView;

    return {
        top: rect.top + view.pageYOffset,
        left: rect.left + view.pageXOffset,
    };
};

export const calcHeight = (element, isTop) => {
    const offset = getOffset(element);
    const { offsetHeight } = element;
    const scrollTop = getScrollTop();

    let height = 0;
    if (window.innerHeight + scrollTop <= offsetHeight + offset.top) {
        height = isTop ? window.innerHeight - 32 : window.innerHeight - offset.top - 16;
    } else {
        height = offsetHeight + offset.top - scrollTop - offset.top - 102;
    }
    return height;
};

export const findReadingSection = (elements, top) => {
    top = top || 0;
    if (!elements || elements.length === 0) return -1;
    let i = 0;
    let index = -1;
    const len = elements.length;
    for (; i < len; i++) {
        const element = elements[i];
        if (!element || !element.getBoundingClientRect) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= top + 1) {
            if (i === len - 1) {
                index = i;
            } else {
                const nexElement = elements[i + 1];
                if (!nexElement.getBoundingClientRect) continue;
                const nextRect = nexElement.getBoundingClientRect();
                if (nextRect.top > top + 1) {
                    index = i;
                    break;
                }
            }
        }
    }
    return index;
};
