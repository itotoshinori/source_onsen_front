import 'tailwindcss/tailwind.css'
import { useEffect } from 'react'
import { fetchCsrfToken, setCsrfToken } from './path/to/your/laravelAxios'

const App = ({ Component, pageProps }) => {
    useEffect(() => {
        const init = async () => {
            await fetchCsrfToken() // CSRFトークンを取得
            // CSRFトークンは自動で設定される
        }
        init()
    }, [])

    return <Component {...pageProps} />
}

export default App
