import service from '@/utils/service'
import Golbal from '@/api/global_variable.js'
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

templateApi.tree = id => {
    return service({
        url: `${baseUrl}/tree/${id}`,
        method: 'get'
    })
}
templateApi.updateAllTemplate = () => {
    return service({
        url: `${baseUrl}/updateAllTemplate`,
        method: 'get'
    })
}

templateApi.deleteById = id => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}


templateApi.list =(params,lang)=>{
    if(lang){
        return service({
            url:`${baseUrl}?lang=${lang}`,
            params:params,
            method:'get'
        })
    }else{
        return service({
            url:baseUrl,
            params:params,
            method:'get'
        })
    }

}
templateApi.add = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}
templateApi.upload=()=>{
    return `http://${Golbal.baseUrl}:${Golbal.port}/api/template/upload`
  }


templateApi.addChild = (id,enName) => {
    return service({
        url: `${baseUrl}/addChild/${id}?enName=${enName}`,
        method: 'get'
    })
}

templateApi.findByChild = (id) => {
    return service({
        url: `${baseUrl}/findByChild/${id}`,
        method: 'get'
    })
}

templateApi.removeChildTemplate = (templateId, templateChildId) => {
    return service({
        url: `${baseUrl}/removeChildTemplate?templateId=${templateId}&templateChildId=${templateChildId}`,
        method: 'get'
    })
}

templateApi.fetchComponents = (path) => {
    return service({
        url: `${baseUrl}/fetchComponents?path=${path}`,
        method: 'get'
    })
}

templateApi.createAllLanguage = (path) => {
    return service({
        url: `${baseUrl}/createAllLanguage?path=${path}`,
        method: 'get'
    })
}

templateApi.createTemplateLanguage=(id) => {
    return service({
        url: `${baseUrl}/createTemplateLanguage/${id}`,
        method: 'get'
    })
}

export default templateApi