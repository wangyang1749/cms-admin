import service from '@/utils/service'

const userApi = {}

userApi.login = (params) => {
    return service({
        url: "/login",
        params: params,
        method: 'post'
    })
}
userApi.logout = () => {
    return service({
        url: "/logout",
        method: 'post'
    })
}

export default userApi