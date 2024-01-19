import service from '@/utils/service'
const baseUrl = '/api/literature'

const literatureApi = {}


literatureApi.generateHtml=(id) => {
  return service({
      url: `${baseUrl}/generateHtml/${id}`,
      method: 'get'
  })
}


  export default literatureApi