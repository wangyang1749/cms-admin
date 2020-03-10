import service from '@/utils/service'
const baseUrl = '/api/article'

const articleApi = {}


articleApi.delete = (id) => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}

articleApi.updateAll = () => {
    return service({
        url: `${baseUrl}/updateAll`,
        method: 'get'
    })
}

articleApi.query = (params) => {
    return service({
        url: baseUrl,
        params: params,
        method: 'get'
    })
}
articleApi.findById = (articleId) => {
    return service({
        url: `${baseUrl}/find/${articleId}`,
        method: 'get'
    })
}
articleApi.create = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}

articleApi.update = (id,params) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: params,
        method: 'post'
    })
}
articleApi.preview = (id) => {
    return  `http://localhost:8080/article/preview/${id}`;
}



export default articleApi