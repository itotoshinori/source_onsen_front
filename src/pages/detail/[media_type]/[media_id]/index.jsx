import AppLayout from '@/components/Layouts/AppLayout'
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Fab,
    Grid,
    Modal,
    Rating,
    Tooltip,
    Typography,
} from '@mui/material'
import Head from 'next/head'
import AddIcon from '@mui/icons-material/Add'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import laravelAxios from '@/lib/laravelAxios'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/auth'

const Detail = ({ detail, media_type, media_id }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const [reviews, setReviews] = useState([])
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [TotalStar, setTotalStar] = useState(0)
    const [textMode, setTextMode] = useState(true)
    const [editRating, setEditRating] = useState(0)
    const [editReview, setEditReview] = useState('')
    const router = useRouter()
    const fetchReviews = async () => {
        try {
            const response = await laravelAxios.get(
                `api/reviews/${media_type}/${media_id}`,
            )
            setReviews(response.data)
            totalStarCalc()
        } catch (err) {
            console.log(err)
        }
    }
    // 評価数の合計を計算する関数
    const totalStarCalc = () => {
        if (reviews.length > 0) {
            const ratingTotal = reviews.reduce(
                (total, review) => total + review.rating,
                0,
            )
            const average = ratingTotal / reviews.length
            setTotalStar(average.toFixed(1))
        } else {
            setTotalStar(0) // reviewsが空の場合は0を設定
        }
    }
    useEffect(() => {
        fetchReviews()
    }, [media_type, media_id])
    useEffect(() => {
        totalStarCalc()
    }, [reviews])
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleRatingChange = (e, newValue) => {
        setRating(newValue)
    }
    const handleReviewChange = e => {
        setReview(e.target.value)
    }
    const handleReviewDelete = async id => {
        if (window.confirm('本当に削除しますか?')) {
            try {
                const response = await laravelAxios.delete(`api/reviews/${id}`)
                // レビュー一覧を再取得する
                await fetchReviews()
                totalStarCalc()
                return response
            } catch (err) {
                console.log(`エラーです:${err}`)
            }
        }
    }
    const isDisabled = !rating || !review.trim()
    const isEditDisabled = !editRating && !editReview.trim()
    const handleReviewAdd = async () => {
        try {
            const response = await laravelAxios.post(`api/reviews`, {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
            })
            //const newReview = response.data
            setOpen(false)
            setReview('')
            setRating(0)
            // レビュー一覧を再取得する
            await fetchReviews()
            return response
        } catch (err) {
            console.log(`エラーです:${err}`)
        }
    }
    const handleReviewUpdate = async review => {
        const currentReview = editReview || review.content
        const currentRating = editRating || review.rating
        try {
            const response = await laravelAxios.put(`api/review/${review.id}`, {
                content: currentReview,
                rating: currentRating,
                id: review.id,
            })
            // レビュー一覧を再取得する
            await fetchReviews()
            setTextMode(true)
            return response
        } catch (err) {
            console.log(`エラーです:${err}`)
        }
    }
    const formatDateToJapanTime = dateString => {
        const date = new Date(dateString) // Dateオブジェクトに変換
        const options = {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }
        // 日本時間に変換してフォーマット
        return new Intl.DateTimeFormat('ja-JP', options).format(date)
    }
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Laravel - 詳細</title>
            </Head>
            <Box
                sx={{
                    height: '70vh',
                    bgcolor: 'red',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${detail.backdrop_path})`,
                        position: 'absolute',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                />
                <Container sx={{ zIndex: 1 }}>
                    <Grid container>
                        <Grid
                            item
                            md={3}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                bgcolor: 'white',
                            }}>
                            <img
                                width="100%"
                                src={`https://image.tmdb.org/t/p/original/${detail.poster_path}`}
                                alt="ポスター画像"
                            />
                        </Grid>
                        <Grid
                            item
                            md={9}
                            sx={{ bgcolor: 'white', padding: '20px' }}>
                            <Typography variant="h4">{detail.title}</Typography>
                            <Typography>{detail.overview}</Typography>
                            {reviews.length > 0 && (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginTop: '10px',
                                    }}>
                                    <Rating
                                        component={'div'}
                                        value={TotalStar}
                                        readOnly
                                        precision={0.1}
                                    />
                                </Typography>
                            )}
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                <Typography
                                    variant="span"
                                    sx={{
                                        marginTop: '10px',
                                        marginRight: '10px',
                                    }}>
                                    公開日:{detail.release_date}
                                </Typography>
                                <Typography
                                    variant="span"
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'blue',
                                        marginRight: '10px',
                                    }}
                                    onClick={() =>
                                        router.push('../../../home')
                                    }>
                                    Homeに戻る
                                </Typography>
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* レビュー内容を表示 */}
            <Container sx={{ margin: '10px auto 50px auto' }}>
                <Typography
                    component={'h1'}
                    variant="h4"
                    align="center"
                    gutterBottom>
                    レビュー一覧
                </Typography>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center" // 水平方向の中央配置
                    marginTop="10px">
                    {reviews.length == 0 && (
                        <Typography>レビューはありません</Typography>
                    )}
                    {reviews.map(review => (
                        <Grid
                            id={review.id}
                            item
                            xs={12}
                            md={8}
                            sx={{ padding: '3px' }}
                            key={review.id}>
                            {textMode ? (
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component={'div'}>
                                            <Box
                                                component="span"
                                                sx={{ marginRight: '20px' }}>
                                                {review.user.name}さん
                                            </Box>
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                            />
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            component={'div'}>
                                            {review.content}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            component={'div'}>
                                            投稿日:
                                            {formatDateToJapanTime(
                                                review.created_at,
                                            )}
                                        </Typography>
                                        <Typography>
                                            <Typography
                                                variant="span"
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    marginRight: '10px',
                                                }}
                                                onClick={() =>
                                                    setTextMode(false)
                                                }>
                                                編集モード
                                            </Typography>
                                            {review.user.id === user.id && (
                                                <Typography
                                                    variant="span"
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: 'red',
                                                        marginRight: '10px',
                                                    }}
                                                    onClick={() =>
                                                        handleReviewDelete(
                                                            review.id,
                                                        )
                                                    }
                                                    component={'span'}>
                                                    削除
                                                </Typography>
                                            )}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent>
                                        <Typography>
                                            <Typography
                                                varinat="span"
                                                component={'span'}
                                                sx={{
                                                    marginRight: '10px',
                                                }}>
                                                レビューを修正する
                                            </Typography>
                                            <Typography
                                                variant="span"
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    marginRight: '10px',
                                                }}
                                                onClick={() =>
                                                    setTextMode(true)
                                                }>
                                                テキストモードへ
                                            </Typography>
                                            <Typography
                                                variant="div"
                                                component={'div'}>
                                                <Rating
                                                    required
                                                    defaultValue={review.rating}
                                                    onChange={e =>
                                                        setEditRating(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Typography>
                                        </Typography>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="レビュー内容を修正する"
                                            style={{
                                                width: '100%',
                                                marginTop: '10px',
                                            }}
                                            defaultValue={review.content}
                                            onChange={e =>
                                                setEditReview(e.target.value)
                                            }
                                        />
                                        <Button
                                            variant="outlined"
                                            disabled={isEditDisabled}
                                            onClick={() =>
                                                handleReviewUpdate(review)
                                            }>
                                            送信
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* レビュー追加の機能 */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 5,
                }}>
                <Tooltip title="レビュー追加">
                    <Fab
                        style={{ backgroundColor: 'blue', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid, #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                        <Typography varinat="h5" component={'h4'}>
                            レビューを書く
                        </Typography>
                        <Rating
                            required
                            value={rating}
                            onChange={handleRatingChange}
                        />
                        <textarea
                            required
                            rows={5}
                            placeholder="レビュー内容を書く"
                            style={{ width: '100%', marginTop: '10px' }}
                            value={review}
                            onChange={handleReviewChange}
                        />
                        <Button
                            variant="outlined"
                            disabled={isDisabled}
                            onClick={handleReviewAdd}>
                            送信
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </AppLayout>
    )
}
export async function getServerSideProps(context) {
    const { media_type, media_id } = context.params
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-jp`,
        )
        const fetchData = response.data
        return {
            props: { detail: fetchData, media_type, media_id },
        }
    } catch {
        return { notFound: true }
    }
}

export default Detail
