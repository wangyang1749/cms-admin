import service from '@/utils/service'
const baseUrl = '/api/latex'

const latexApi = {}

latexApi.preview=(latex)=>{
    return service({
        url: `${baseUrl}/svg`,
        data: {
            latex:latex
        },
        method: 'post'
    })
}

latexApi.save=(latex)=>{
    return service({
        url: `${baseUrl}/svgSave`,
        data: {
            latex:latex
        },
        method: 'post'
    })
}
export default latexApi