import service from '@/utils/service'
const baseUrl = '/api/content'

const contentAPI = {}


contentAPI.delete = (id) => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}

contentAPI.updateAll = (params) => {
    return service({
        url: `${baseUrl}/updateAll`,
        params: params,
        method: 'get'
    })
}

contentAPI.query = (params) => {
    return service({
        url: baseUrl,
        params: params,
        method: 'get'
    })
}
contentAPI.updateCategory = (articleId,baseCategoryId) => {
    return service({
        url: `${baseUrl}/updateCategory/${articleId}`,
        params: {baseCategoryId:baseCategoryId},
        method: 'get'
    })
}
contentAPI.addArticleToChannel = (articleId,channelId) => {
    return service({
        url: `${baseUrl}/addArticleToChannel/${articleId}`,
        params: {channelId:channelId},
        method: 'get'
    })
}

contentAPI.queryTitle = (title) => {
    return service({
        url: `${baseUrl}/query`,
        params: {title:title},
        method: 'get'
    })
}

contentAPI.listByComponentsId = (id) => {
    return service({
        url: `${baseUrl}/listByComponentsId/${id}`,
        method: 'get'
    })
}

contentAPI.updateOrderBy = (articleId,order) => {
    return service({
        url: `${baseUrl}/updateOrderBy/${articleId}`,
        params: {order:order},
        method: 'get'
    })
}

contentAPI.pageByTagId = (tagId,params) => {
    return service({
        url: `${baseUrl}/pageByTagId/${tagId}`,
        params: params,
        method: 'get'
    })
}


contentAPI.listVoTree = (articleId,params) => {
    return service({
        url: `${baseUrl}/listVoTree/${articleId}`,
        params:params,
        method: 'get'
    })
}

contentAPI.findById = articleId => {
    return service({
        url: `${baseUrl}/find/${articleId}`,
        method: 'get'
    })
}
contentAPI.openOrCloseComment = articleId => {
    return service({
        url: `${baseUrl}/openOrCloseComment/${articleId}`,
        method: 'get'
    })
}
contentAPI.haveHtml = articleId => {
    return service({
        url: `${baseUrl}/haveHtml/${articleId}`,
        method: 'get'
    })
}

contentAPI.sendOrCancelTop = articleId => {
    return service({
        url: `${baseUrl}/sendOrCancelTop/${articleId}`,
        method: 'get'
    })
}

contentAPI.create = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}
contentAPI.saveArticle = (params) => {
    return service({
        url: `${baseUrl}/save`,
        data: params,
        method: 'post'
    })
}

contentAPI.updatePos = (id,params) => {
    return service({
        url: `${baseUrl}/updatePos/${id}`,
        data: params,
        method: 'post'
    })
}

contentAPI.updateArticle = (id,params) => {
    return service({
        url: `${baseUrl}/save/${id}`,
        data: params,
        method: 'post'
    })
}


contentAPI.update = (id,params) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: params,
        method: 'post'
    })
}

contentAPI.generateHtml=(id) => {
    return service({
        url: `${baseUrl}/generateHtml/${id}`,
        method: 'get'
    })
}
contentAPI.listByComponentsId = (id) => {
    return service({
        url: `${baseUrl}/listByComponentsId/${id}`,
        method: 'get'
    })
}

contentAPI.updateArticleInComponentOrder=(id,order) => {
    return service({
        url: `${baseUrl}/updateArticleInComponentOrder?id=${id}&order=${order}`,
        method: 'get'
    })
}

export default contentAPI