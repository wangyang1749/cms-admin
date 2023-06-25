

import service from '@/utils/service'
const baseUrl = '/api/wxMenu'

const wxmanage = {}


wxmanage.wxmanageGet = () => {
    return service({
        url: `${baseUrl}/getMenu`,
        method: 'get'
    })
}

wxmanage.updateMenu = (data) => {
    return service({
        url: `${baseUrl}/updateMenu`,
        method: 'post',
        data: data
    })
}

export default wxmanage