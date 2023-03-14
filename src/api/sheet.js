import service from '@/utils/service'
const baseUrl = '/api/sheet'

const sheetApi = {}

sheetApi.list=(param)=>{
    return service({
        url:baseUrl,
        params: param,
        method:"get"
    })
}
sheetApi.addOrRemoveToMenu=id=>{
    return service({
      url:`${baseUrl}/addOrRemoveToMenu/${id}`,
      method:'get'
    })
  }

sheetApi.findListByChannelId =id => {
    return service({
        url: `${baseUrl}/findListByChannelId/${id}`,
        method: 'get'
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

sheetApi.saveSheet = (params) => {
    return service({
        url: `${baseUrl}/save`,
        data: params,
        method: 'post'
    })
}
sheetApi.modifySheet = (id,params) => {
    return service({
        url: `${baseUrl}/save/${id}`,
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


sheetApi.createSheetLanguage=(id) => {
    return service({
        url: `${baseUrl}/createSheetLanguage/${id}`,
        method: 'get'
    })
}


export default sheetApi