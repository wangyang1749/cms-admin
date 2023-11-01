import service from '@/utils/service'
const baseUrl = '/api/option'

const optionApi = {}


optionApi.initialize = () => {
  return service({
      url: `${baseUrl}/initialize`,
      method: 'get'
  })
}
optionApi.updateLanguage = () => {
    return service({
        url: `${baseUrl}/updateLanguage`,
        method: 'get'
    })
  }
  optionApi.updateTemplateType = () => {
    return service({
        url: `${baseUrl}/updateTemplateType`,
        method: 'get'
    })
  }
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