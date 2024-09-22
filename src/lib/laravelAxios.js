import axios from 'axios'

const laravelAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    //withXSRFToken: true,
})

export default laravelAxios
