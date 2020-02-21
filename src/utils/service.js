import axios from 'axios'
// import Vue from 'vue'
import router from '@/router'
const service = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 1000,
    withCredentials: true,
})

service.interceptors.response.use(
    response=>{
        return response;
    },error=>{
        router.push("/login")
        return Promise.reject(error)
    }
)



export default service