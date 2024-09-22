import axios from 'axios'
let csrfToken = '' // CSRFトークンの一時的な保存場所

const laravelAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    'X-CSRF-TOKEN': csrfToken,
    //withXSRFToken: true,
})

export const setCsrfToken = token => {
    csrfToken = token
}

export default laravelAxios
