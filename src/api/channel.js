import service from '@/utils/service'
const baseUrl = '/api/channel'

const channelApi = {}

channelApi.updateFirstSheet=(id,name)=>{
  return service({
    url:`${baseUrl}/updateFirstSheet/${id}`,
    params:{name:name},
    method:'get'
  })
}
channelApi.updateAll = (params) => {
  return service({
      url: `${baseUrl}/updateAll`,
      params: params,
      method: 'get'
  })
}

channelApi.addOrRemoveToMenu=id=>{
  return service({
    url:`${baseUrl}/addOrRemoveToMenu/${id}`,
    method:'get'
  })
}

channelApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}

channelApi.delete =id => {
  return service({
      url: `${baseUrl}/delete/${id}`,
      method: 'get'
  })
}

channelApi.find =id => {
  return service({
      url: `${baseUrl}/find/${id}`,
      method: 'get'
  })
}
channelApi.add = data=>{
  return service({
    url:baseUrl,
    method:'post',
    data:data
  })
}

channelApi.update =(id,data) =>{
  return service({
    url:`${baseUrl}/update/${id}`,
    method:'post',
    data:data
  })
}

channelApi.generateHtml=(id) => {
  return service({
      url: `${baseUrl}/generateHtml/${id}`,
      method: 'get'
  })
}


export default channelApi