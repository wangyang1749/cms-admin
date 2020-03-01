import service from '@/utils/service'
const baseUrl = '/api/sheet'

const sheetApi = {}

sheetApi.list=()=>{
    return service({
        url:baseUrl,
        method:"get"
    })
}
sheetApi.deleteById=(id) => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}

sheetApi.generateHtml=(id) => {
    return service({
        url: `${baseUrl}/generate/${id}`,
        method: 'get'
    })
}
sheetApi.query = (params) => {
    return service({
        url: baseUrl,
        params: params,
        method: 'get'
    })
}
sheetApi.findById = (sheetId) => {
    return service({
        url: `${baseUrl}/find/${sheetId}`,
        method: 'get'
    })
}
sheetApi.create = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}

sheetApi.update = (id,params) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: params,
        method: 'post'
    })
}
export default sheetApi