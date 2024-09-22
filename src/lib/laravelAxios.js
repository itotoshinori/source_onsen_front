import axios from 'axios'

let csrfToken = '' // CSRFトークンの一時的な保存場所

const laravelAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken, // 正しい位置に移動
    },
    withCredentials: true,
})

export const setCsrfToken = token => {
    // 括弧を削除
    csrfToken = token
}

export default laravelAxios
