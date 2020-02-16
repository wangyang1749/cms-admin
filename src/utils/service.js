import axios from 'axios'
import Vue from 'vue'

const service = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 1000,
})

export default service