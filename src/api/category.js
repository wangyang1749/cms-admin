import service from '@/utils/service'
const baseUrl = '/api/category'

const categoryApi = {}


categoryApi.list = () => {
  return service({
      url: baseUrl,
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

categoryApi.upload=()=>{
  return `http://47.93.201.74:8080/api/attachment/upload`
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