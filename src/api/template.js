import service from '@/utils/service'
const baseUrl = '/api/template'

const templateApi = {}

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