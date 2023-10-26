import service from '@/utils/service'
const baseUrl = '/api/literature'

const literatureApi = {}


literatureApi.import = () => {
  return service({
      url: `${baseUrl}/import`,
      method: 'get'
  })
}

literatureApi.generateListHtml = () => {
  return service({
      url: `${baseUrl}/generateListHtml`,
      method: 'get'
  })
}


literatureApi.list = (params) => {
  return service({
      url: baseUrl,
      method: 'get',
      params:params
  })
}
literatureApi.delete= (id)=>{
  return service({
    url:`${baseUrl}/delete/${id}`,
    method:'get',
  })
}
literatureApi.delAll= ()=>{
  return service({
    url:`${baseUrl}/delAll`,
    method:'get',
  })
}
literatureApi.add = data=>{
  return service({
    url:baseUrl,
    method:'post',
    data:data
  })
}
literatureApi.update = (id,data)=>{
  return service({
    url:`${baseUrl}/update/${id}`,
    method:'post',
    data:data
  })
}
literatureApi.findById=id=>{
  return service({
    url:`${baseUrl}/find/${id}`,
    method:'get'
  })
}






export default literatureApi