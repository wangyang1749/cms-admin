import service from '@/utils/service'
const baseUrl = '/api/goods'

const GoodsApi = {}


GoodsApi.delete = (id) => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}

GoodsApi.updateAll = (params) => {
    return service({
        url: `${baseUrl}/updateAll`,
        params: params,
        method: 'get'
    })
}

GoodsApi.query = (params) => {
    return service({
        url: baseUrl,
        params: params,
        method: 'get'
    })
}
GoodsApi.updateCategory = (articleId,baseCategoryId) => {
    return service({
        url: `${baseUrl}/updateCategory/${articleId}`,
        params: {baseCategoryId:baseCategoryId},
        method: 'get'
    })
}
GoodsApi.addArticleToChannel = (articleId,channelId) => {
    return service({
        url: `${baseUrl}/addArticleToChannel/${articleId}`,
        params: {channelId:channelId},
        method: 'get'
    })
}

GoodsApi.queryTitle = (title) => {
    return service({
        url: `${baseUrl}/query`,
        params: {title:title},
        method: 'get'
    })
}


GoodsApi.updateOrderBy = (articleId,order) => {
    return service({
        url: `${baseUrl}/updateOrderBy/${articleId}`,
        params: {order:order},
        method: 'get'
    })
}

GoodsApi.pageByTagId = (tagId,params) => {
    return service({
        url: `${baseUrl}/pageByTagId/${tagId}`,
        params: params,
        method: 'get'
    })
}


GoodsApi.listVoTree = (articleId,params) => {
    return service({
        url: `${baseUrl}/listVoTree/${articleId}`,
        params:params,
        method: 'get'
    })
}

GoodsApi.findById = articleId => {
    return service({
        url: `${baseUrl}/find/${articleId}`,
        method: 'get'
    })
}
GoodsApi.openOrCloseComment = articleId => {
    return service({
        url: `${baseUrl}/openOrCloseComment/${articleId}`,
        method: 'get'
    })
}
GoodsApi.haveHtml = articleId => {
    return service({
        url: `${baseUrl}/haveHtml/${articleId}`,
        method: 'get'
    })
}
GoodsApi.divisionOkOrCancel = articleId => {
    return service({
        url: `${baseUrl}/divisionOkOrCancel/${articleId}`,
        method: 'get'
    })
}
GoodsApi.sendOrCancelTop = articleId => {
    return service({
        url: `${baseUrl}/sendOrCancelTop/${articleId}`,
        method: 'get'
    })
}
GoodsApi.generateArticlesByCategoryId = categoryId => {
    return service({
        url: `${baseUrl}/generateArticlesByCategoryId/${categoryId}`,
        method: 'get'
    })
}

GoodsApi.create = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}
GoodsApi.saveArticle = (params) => {
    return service({
        url: `${baseUrl}/save`,
        data: params,
        method: 'post'
    })
}

GoodsApi.updatePos = (id,params) => {
    return service({
        url: `${baseUrl}/updatePos/${id}`,
        data: params,
        method: 'post'
    })
}

GoodsApi.updateArticle = (id,params) => {
    return service({
        url: `${baseUrl}/save/${id}`,
        data: params,
        method: 'post'
    })
}


GoodsApi.update = (id,params) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: params,
        method: 'post'
    })
}

GoodsApi.generateHtml=(id) => {
    return service({
        url: `${baseUrl}/generateHtml/${id}`,
        method: 'get'
    })
}

GoodsApi.publisher=(id) => {
    return service({
        url: `${baseUrl}/publisher/${id}`,
        method: 'get'
    })
}
GoodsApi.listByComponentsId = (id) => {
    return service({
        url: `${baseUrl}/listByComponentsId/${id}`,
        method: 'get'
    })
}

GoodsApi.updateArticleInComponentOrder=(id,order) => {
    return service({
        url: `${baseUrl}/updateArticleInComponentOrder?id=${id}&order=${order}`,
        method: 'get'
    })
}

GoodsApi.createArticleLanguage=(id) => {
    return service({
        url: `${baseUrl}/createArticleLanguage/${id}`,
        method: 'get'
    })
  }

export default GoodsApi