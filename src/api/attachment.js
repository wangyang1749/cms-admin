import service from '@/utils/service'
import Golbal from '@/api/global_variable.js'
const baseUrl = '/api/attachment'

const attachmentApi = {}

attachmentApi.upload=()=>{
  return `http://${Golbal.baseUrl}:${Golbal.port}/api/attachment/upload`
}

attachmentApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}
export default attachmentApi