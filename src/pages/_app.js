import 'tailwindcss/tailwind.css'
import { fetchCsrfToken } from '../lib/laravelAxios'
import { useEffect } from 'react'

const App = ({ Component, pageProps }) => {
    const init = async () => {
        await fetchCsrfToken() // CSRFトークンを取得
        // 他の処理を続ける
    }
    // 初回レンダリング時にCSRFトークンを取得
    useEffect(() => {
        init()
    }, [])

    return <Component {...pageProps} />
}

export default App
