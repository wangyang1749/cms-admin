import service from '@/utils/service'
const baseUrl = '/api/menu'

const menuApi = {}
menuApi.listVoTree = () => {
  return service({
      url: `${baseUrl}/listVoTree`,
      method: 'get'
  })
}
menuApi.updatePos = data=>{
  return service({
    url:`${baseUrl}/updatePos`,
    method:'post',
    data:data
  })
}

menuApi.list = () => {
  return service({
      url: baseUrl,
      method: 'get'
  })
}
menuApi.delete= (id)=>{
  return service({
    url:`${baseUrl}/delete/${id}`,
    method:'get',
  })
}
menuApi.add = data=>{
  return service({
    url:baseUrl,
    method:'post',
    data:data
  })
}
menuApi.update = (id,data)=>{
  return service({
    url:`${baseUrl}/update/${id}`,
    method:'post',
    data:data
  })
}
menuApi.findById=id=>{
  return service({
    url:`${baseUrl}/find/${id}`,
    method:'get'
  })
}






function concreteTree(parentmenu, categories) {
    categories.forEach(menu => {
      if (parentmenu.key === menu.parentId) {
        if (!parentmenu.children) {
          parentmenu.children = []
        }
        parentmenu.children.push({
          key: menu.id,
          title: menu.name,
          isLeaf: false,
          scopedSlots: { title: "custom" },

        })
      }
    })
  
    if (parentmenu.children) {
      parentmenu.children.forEach(menu => concreteTree(menu, categories))
    } else {
      parentmenu.isLeaf = true
    }
  }
  
  menuApi.concreteTree = categories => {
    const topmenuNode = {
      key: 0,
      title: 'top',
      children: []
    }
    concreteTree(topmenuNode, categories)
    return topmenuNode.children
  }
  export default menuApi