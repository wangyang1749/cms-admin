import service from '@/utils/service'
const baseUrl = '/api/user'
const userApi = {}

userApi.page = (params)=>{
    return service({
        url: baseUrl,
        params: params,
        method: 'get'
    })
}

userApi.add = (params) => {
    return service({
        url: baseUrl,
        data: params,
        method: 'post'
    })
}
userApi.update = (id,params) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: params,
        method: 'post'
    })
}

userApi.delete = (id) => {
    return service({
        url: `${baseUrl}/delete/${id}`,
        method: 'get'
    })
}


userApi.find = (id) => {
    return service({
        url: `${baseUrl}/find/${id}`,
        method: 'get'
    })
}

userApi.login = (data) => {
    return service({
        url: "/api/user/login",
        data: data,
        method: 'post'
    })
}
userApi.logout = () => {
    return service({
        url: "/logout",
        method: 'post'
    })
}


userApi.getCurrentUser=()=>{
    return service({
        url:"/api/user/getCurrent",
        method:'get'
    })
}
export default userApi