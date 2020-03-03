import service from '@/utils/service'
const baseUrl = '/api/option'

const optionApi = {}


optionApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}
optionApi.save = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}

export default optionApi