import axios from 'axios'
import Golbal from '@/api/global_variable.js'
// import Vue from 'vue'
import router from '@/router'
import { message } from 'ant-design-vue'

const service = axios.create({
    baseURL: `http://${Golbal.baseUrl}:${Golbal.port}/`,
    timeout: 30000,
    withCredentials: true,
})
message.config({
    top: `100px`,
    duration: 2,
    maxCount: 3,
});

service.interceptors.response.use(
    response => {
        return response;
    }, error => {
        const response = error.response
        const data = response ? response.data : null
        if (data) {
            if (data.status === 401) {
                router.push("/login")
                message.error(data.message);
            } else {
                if(data.message){
                    message.error(data.message);
                }else{
                    message.error('error --interceptors');
                }
               
            }
            //console.log(data)
        }
        return Promise.reject(error)
    }
)



export default service