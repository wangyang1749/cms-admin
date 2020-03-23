import service from '@/utils/service'
const baseUrl = '/api/article'

const articleApi = {}


articleApi.delete = (id) => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}

articleApi.updateAll = (params) => {
    return service({
        url: `${baseUrl}/updateAll`,
        params: params,
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
articleApi.updateCategory = (articleId,baseCategoryId) => {
    return service({
        url: `${baseUrl}/updateCategory/${articleId}`,
        params: {baseCategoryId:baseCategoryId},
        method: 'get'
    })
}
articleApi.addArticleToChannel = (articleId,channelId) => {
    return service({
        url: `${baseUrl}/addArticleToChannel/${articleId}`,
        params: {channelId:channelId},
        method: 'get'
    })
}

articleApi.findListByCategoryId = articleId => {
    return service({
        url: `${baseUrl}/findListByCategoryId/${articleId}`,
        method: 'get'
    })
}

articleApi.findById = articleId => {
    return service({
        url: `${baseUrl}/find/${articleId}`,
        method: 'get'
    })
}
articleApi.haveHtml = articleId => {
    return service({
        url: `${baseUrl}/haveHtml/${articleId}`,
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
articleApi.saveArticle = (params) => {
    return service({
        url: `${baseUrl}/save`,
        data: params,
        method: 'post'
    })
}
articleApi.updateArticle = (id,params) => {
    return service({
        url: `${baseUrl}/save/${id}`,
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

articleApi.generateHtml=(id) => {
    return service({
        url: `${baseUrl}/generateHtml/${id}`,
        method: 'get'
    })
}


export default articleApi