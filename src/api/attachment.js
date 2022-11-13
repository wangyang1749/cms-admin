import service from '@/utils/service'
import Golbal from '@/api/global_variable.js'
const baseUrl = '/api/attachment'

const attachmentApi = {}

attachmentApi.upload=()=>{
  return `http://${Golbal.baseUrl}:${Golbal.port}/api/attachment/upload`
}

attachmentApi.uploadBib=()=>{
  return `http://${Golbal.baseUrl}:${Golbal.port}/api/attachment/uploadBib?update=true`
}

attachmentApi.list = (params) => {
  return service({
      url: baseUrl,
      params:params,
      method: 'get'
  })
}
export default attachmentApi