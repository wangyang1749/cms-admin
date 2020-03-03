import service from '@/utils/service'
const baseUrl = '/api/menu'

const attachmentApi = {}


attachmentApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}
export default attachmentApi