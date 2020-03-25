import service from '@/utils/service'

const userApi = {}

userApi.login = (data) => {
    return service({
        url: "/user/authenticate",
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