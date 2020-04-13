import underscore from 'underscore.string';

export const isITELLYOU = content => {
    return content.startsWith('<!doctype itellyou>');
};

export const isBlank = content => {
    if (!content) return true;
    return (
        '<!doctype itellyou>' ===
        content.replace(/<(?:br|cursor|meta) [^>]*\/>/g, '').replace(/<p><\/p>/g, '')
    );
};

export const extractSummary = content => {
    return underscore(content)
        .stripTags()
        .trim(' \n')
        .replace(/\n/g, ' ')
        .unescapeHTML()
        .truncate(147, '...')
        .value();
};

export const extractFirstImage = content => {
    if (content) {
        const reg = /<img[^>]{1,2000}src="([^"]{10,190})"/i;
        const values = reg.exec(content);
        return values ? values[1] : undefined;
    }
};

export const isContentSame = (prev, next) => {
    return prev === next || getPureContent(prev) === getPureContent(next);
};

export const getPureContent = content => {
    content = content || '';
    return content
        .replace(/<anchor\s*\/>/gi, '')
        .replace(/<focus\s*\/>/gi, '')
        .replace(/<cursor\s*\/>/gi, '');
};
