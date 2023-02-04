import service from '@/utils/service'
const baseUrl = '/api/componentsCategory'

const componentsCategory = {}

componentsCategory.add = (articleId,componentsId) => {
    return service({
        url: `${baseUrl}/add`,
        params:{
            articleId:articleId,
            componentsId:componentsId
        },
        method: 'get'
    })
}

componentsCategory.addByCategoryViewName = (componentId,viewName) => {
    return service({
        url: `${baseUrl}/addByCategoryViewName/${componentId}`,
        params:{
            viewName:viewName
        },
        method: 'get'
    })
}

componentsCategory.delete = (componentId,categoryId) => {
    return service({
        url: `${baseUrl}/deleteByComponentIdAndCategoryId/${componentId}`,
        params:{
            categoryId:categoryId
        },
        method: 'get'
    })
}
export default componentsCategory