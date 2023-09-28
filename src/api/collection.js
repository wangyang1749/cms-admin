import service from '@/utils/service'
const baseUrl = '/api/collection'

const collectionApi = {}


collectionApi.listByParent = (id) => {
  return service({
      url: `${baseUrl}/listByParentId/${id}`,
      method: 'get'
  })
}

collectionApi.import = () => {
  return service({
      url: `${baseUrl}/import`,
      method: 'get'
  })
}
collectionApi.listAll = () => {
  return service({
      url: `${baseUrl}/list`,
      method: 'get'
  })
}
collectionApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}
collectionApi.listVoTree = () => {
  return service({
      url: `${baseUrl}/listVoTree`,
      method: 'get'
  })
}
collectionApi.delAll= ()=>{
  return service({
    url:`${baseUrl}/delAll`,
    method:'get',
  })
}

collectionApi.updateAll = (params) => {
  return service({
      url: `${baseUrl}/updateAll`,
      params: params,
      method: 'get'
  })
}
collectionApi.add = data=>{
  return service({
    url:baseUrl,
    method:'post',
    data:data
  })
}


collectionApi.updatePos = data=>{
  return service({
    url:`${baseUrl}/updatePos`,
    method:'post',
    data:data
  })
}

collectionApi.update = (id,data)=>{
  return service({
    url:`${baseUrl}/update/${id}`,
    method:'post',
    data:data
  })
}
collectionApi.findById=id=>{
  return service({
    url:`${baseUrl}/find/${id}`,
    method:'get'
  })
}

collectionApi.pageBy=categoryEnName=>{
  return service({
    url:`${baseUrl}/template/${categoryEnName}`,
    method:'get'
  })
}

collectionApi.recommendOrCancel=id=>{
  return service({
    url:`${baseUrl}/recommendOrCancel/${id}`,
    method:'get'
  })
}
collectionApi.addOrRemoveToMenu=id=>{
  return service({
    url:`${baseUrl}/addOrRemoveToMenu/${id}`,
    method:'get'
  })
}
collectionApi.haveHtml=id=>{
  return service({
    url:`${baseUrl}/haveHtml/${id}`,
    method:'get'
  })
}


collectionApi.deleteById=id=>{
  return service({
    url:`${baseUrl}/delete/${id}`,
    method:'get'
  })
}

collectionApi.findByCategoryDetail=id=>{
  return service({
    url:`${baseUrl}/find/categoryDetail/${id}`,
    method:'get'
  })
}

collectionApi.generateHtml=(id) => {
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
  
  collectionApi.concreteTree = categories => {
    const topCategoryNode = {
      key: 0,
      title: 'top',
      children: []
    }
    concreteTree(topCategoryNode, categories)
    return topCategoryNode.children
  }
  export default collectionApi