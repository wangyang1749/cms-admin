import service from '@/utils/service'
const baseUrl = '/api/template'

const templateApi = {}

templateApi.update = (id,templatePageParam) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: templatePageParam,
        method: 'post'
    })
}
templateApi.findDetailsById = (id) => {
    return service({
        url: `${baseUrl}/findDetailsById/${id}`,
        method: 'get'
    })
}

templateApi.findByType = (type) => {
    return service({
        url: `${baseUrl}/find/${type}`,
        method: 'get'
    })
}

templateApi.setStatus = id => {
    return service({
        url: `${baseUrl}/setStatus/${id}`,
        method: 'get'
    })
}

templateApi.list =(params)=>{
    return service({
        url:baseUrl,
        params:params,
        method:'get'
    })
}
templateApi.create = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}


export default templateApi