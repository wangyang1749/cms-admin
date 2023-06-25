

import service from '@/utils/service'
const baseUrl = '/api/wxQrCode'

const wxQrCode = {}

// 带参二维码
wxQrCode.createTicket = (data) => {
    return service({
        url: `${baseUrl}/createTicket`,
        method: 'post',
        data: data
    })
}

wxQrCode.list = (param) => {
    return service({
        url:baseUrl,
        params: param,
        method:"get"
    })
}

wxQrCode.delById = (id) => {
    return service({
        url: `${baseUrl}/delById/${id}`,
        method: 'get'
    })
}
export default wxQrCode