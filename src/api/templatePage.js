import service from '@/utils/service'
const baseUrl = '/api/templatePage'

const templatePageApi = {}

templatePageApi.update = (id,templatePageParam) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: templatePageParam,
        method: 'post'
    })
}


templatePageApi.add = (templatePageParam) => {
    return service({
        url: `${baseUrl}`,
        data: templatePageParam,
        method: 'post'
    })
}


templatePageApi.list =(params)=>{
    return service({
        url:baseUrl,
        params:params,
        method:'get'
    })
}

templatePageApi.delete =(id)=>{
    return service({
        url:`${baseUrl}/delete/${id}`,
        method:'get'
    })
}
templatePageApi.generateHtml = (id) => {
    return service({
        url: `${baseUrl}/generate/${id}`,
        method: 'get'
    })
}

templatePageApi.findById = (id) => {
    return service({
        url: `${baseUrl}/find/${id}`,
        method: 'get'
    })
}

templatePageApi.listNeedArticle = () => {
    return service({
        url: `${baseUrl}/listNeedArticle`,
        method: 'get'
    })
}

templatePageApi.updateArgs = (id,args) => {
    return service({
        url: `${baseUrl}/updateArgs/${id}`,
        params:{
            args:args
        },
        method: 'get'
    })
}

templatePageApi.findDetailsById = (id) => {
    return service({
        url: `${baseUrl}/findDetailsById/${id}`,
        method: 'get'
    })
}
templatePageApi.fetchComponents = (path) => {
    return service({
        url: `${baseUrl}/fetchComponents?path=${path}`,
        method: 'get'
    })
}
templatePageApi.installLanguage = (path) => {
    return service({
        url: `${baseUrl}/installLanguage?path=${path}`,
        method: 'get'
    })
}

export default templatePageApi