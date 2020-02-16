import service from '@/utils/service'
const baseUrl = '/api/article'

const articleApi = {}

articleApi.query = (params) => {
    return service({
        url: baseUrl,
        params: params,
        method: 'get'
    })
}

export default articleApi