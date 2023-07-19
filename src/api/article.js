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

articleApi.queryTitle = (title) => {
    return service({
        url: `${baseUrl}/query`,
        params: {title:title},
        method: 'get'
    })
}


articleApi.updateOrderBy = (articleId,order) => {
    return service({
        url: `${baseUrl}/updateOrderBy/${articleId}`,
        params: {order:order},
        method: 'get'
    })
}

articleApi.pageByTagId = (tagId,params) => {
    return service({
        url: `${baseUrl}/pageByTagId/${tagId}`,
        params: params,
        method: 'get'
    })
}


articleApi.listVoTree = (articleId,params) => {
    return service({
        url: `${baseUrl}/listVoTree/${articleId}`,
        params:params,
        method: 'get'
    })
}

articleApi.findById = articleId => {
    return service({
        url: `${baseUrl}/find/${articleId}`,
        method: 'get'
    })
}
articleApi.openOrCloseComment = articleId => {
    return service({
        url: `${baseUrl}/openOrCloseComment/${articleId}`,
        method: 'get'
    })
}
articleApi.haveHtml = articleId => {
    return service({
        url: `${baseUrl}/haveHtml/${articleId}`,
        method: 'get'
    })
}
articleApi.divisionOkOrCancel = articleId => {
    return service({
        url: `${baseUrl}/divisionOkOrCancel/${articleId}`,
        method: 'get'
    })
}
articleApi.sendOrCancelTop = articleId => {
    return service({
        url: `${baseUrl}/sendOrCancelTop/${articleId}`,
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

articleApi.updatePos = (id,params) => {
    return service({
        url: `${baseUrl}/updatePos/${id}`,
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

articleApi.publisher=(id) => {
    return service({
        url: `${baseUrl}/publisher/${id}`,
        method: 'get'
    })
}
articleApi.listByComponentsId = (id) => {
    return service({
        url: `${baseUrl}/listByComponentsId/${id}`,
        method: 'get'
    })
}

articleApi.updateArticleInComponentOrder=(id,order) => {
    return service({
        url: `${baseUrl}/updateArticleInComponentOrder?id=${id}&order=${order}`,
        method: 'get'
    })
}

articleApi.createArticleLanguage=(id) => {
    return service({
        url: `${baseUrl}/createArticleLanguage/${id}`,
        method: 'get'
    })
  }

export default articleApi