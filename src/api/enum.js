import service from '@/utils/service'
const baseUrl = '/api/enum'

const enumApi = {}


enumApi.list = (name) => {
  return service({
      url: `${baseUrl}?name=${name}`,
      method: 'get'
  })
}

export default enumApi