export function getAuthority(str) {
    // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
    const authorityString = typeof str === 'undefined' ? localStorage.getItem('itellyou-authority') : str
    // authorityString could be admin, "admin", ["admin"]
    let authority
    try {
        authority = JSON.parse(authorityString);
    } catch (e) {
        authority = authorityString
    }

    if (authority && typeof authority === 'object') {
        return authority.authority
    }
    return authority
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority
  return localStorage.setItem('itellyou-authority', JSON.stringify(proAuthority))
}
