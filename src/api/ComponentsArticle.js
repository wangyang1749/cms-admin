import service from '@/utils/service'
const baseUrl = '/api/componentsArticle'

const componentsArticle = {}

componentsArticle.add = (articleId,componentsId) => {
    return service({
        url: `${baseUrl}/add`,
        params:{
            articleId:articleId,
            componentsId:componentsId
        },
        method: 'get'
    })
}

componentsArticle.addByArticleViewName = (componentId,viewName) => {
    return service({
        url: `${baseUrl}/addByArticleViewName/${componentId}`,
        params:{
            viewName:viewName
        },
        method: 'get'
    })
}

componentsArticle.delete = (componentId,articleId) => {
    return service({
        url: `${baseUrl}/deleteByComponentIdAndArticleId/${componentId}`,
        params:{
            articleId:articleId
        },
        method: 'get'
    })
}
export default componentsArticle