import service from '@/utils/service'
const baseUrl = '/api/category'

const categoryApi = {}


categoryApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}
categoryApi.listBaseCategory = () => {
  return service({
      url: `${baseUrl}/listBaseCategory`,
      method: 'get'
  })
}


categoryApi.updateAll = (params) => {
  return service({
      url: `${baseUrl}/updateAll`,
      params: params,
      method: 'get'
  })
}
categoryApi.add = data=>{
  return service({
    url:baseUrl,
    method:'post',
    data:data
  })
}
categoryApi.update = (id,data)=>{
  return service({
    url:`${baseUrl}/update/${id}`,
    method:'post',
    data:data
  })
}
categoryApi.findById=id=>{
  return service({
    url:`${baseUrl}/find/${id}`,
    method:'get'
  })
}

categoryApi.recommendOrCancel=id=>{
  return service({
    url:`${baseUrl}/recommendOrCancel/${id}`,
    method:'get'
  })
}
categoryApi.addOrRemoveToMenu=id=>{
  return service({
    url:`${baseUrl}/addOrRemoveToMenu/${id}`,
    method:'get'
  })
}
categoryApi.haveHtml=id=>{
  return service({
    url:`${baseUrl}/haveHtml/${id}`,
    method:'get'
  })
}


categoryApi.deleteById=id=>{
  return service({
    url:`${baseUrl}/delete/${id}`,
    method:'get'
  })
}

categoryApi.findByCategoryDetail=id=>{
  return service({
    url:`${baseUrl}/find/categoryDetail/${id}`,
    method:'get'
  })
}

categoryApi.generateHtml=(id) => {
  return service({
      url: `${baseUrl}/generateHtml/${id}`,
      method: 'get'
  })
}

function concreteTree(parentCategory, categories) {
    categories.forEach(category => {
      if (parentCategory.key === category.parentId) {
        if (!parentCategory.children) {
          parentCategory.children = []
        }
        parentCategory.children.push({
          key: category.id,
          title: category.name,
          isLeaf: false,
          scopedSlots: { title: "custom" },

        })
      }
    })
  
    if (parentCategory.children) {
      parentCategory.children.forEach(category => concreteTree(category, categories))
    } else {
      parentCategory.isLeaf = true
    }
  }
  
  categoryApi.concreteTree = categories => {
    const topCategoryNode = {
      key: 0,
      title: 'top',
      children: []
    }
    concreteTree(topCategoryNode, categories)
    return topCategoryNode.children
  }
  export default categoryApi