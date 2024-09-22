import axios from 'axios'

let csrfToken = '' // CSRFトークンの一時的な保存場所

const laravelAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken,
    },
    withCredentials: true,
})

export const setCsrfToken = token => {
    csrfToken = token
    laravelAxios.defaults.headers['X-CSRF-TOKEN'] = token // ヘッダーにトークンを設定
}

export const fetchCsrfToken = async () => {
    await laravelAxios.get('/sanctum/csrf-cookie')
    // CSRFトークンを取得するためにサーバーから取得したクッキーを使用
    return csrfToken // トークンを返す（空のままなので、この行は削除することも可能）
}

export default laravelAxios
