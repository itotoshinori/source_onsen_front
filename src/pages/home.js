import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { CardMedia, Link, Typography } from '@mui/material'

const Dashboard = () => {
    const [movies, setMovies] = useState([])
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('api/getPopularMovies')
                setMovies(response.data.results)
                //console.log(movies)
            } catch (err) {
                console.log(err)
            }
        }
        fetchMovies()
    }, [])
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home
                </h2>
            }>
            <Head>
                <title>Laravel - Home</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
            <Swiper
                spaceBetween={5}
                slidesPerView={7}
                onSlideChange={() => console.log('slide change')}
                onSwiper={swiper => console.log(swiper)}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    480: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    640: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 5,
                        spaceBetween: 40,
                    },
                }}>
                {movies && movies.length > 0 ? (
                    movies.map(movie => (
                        <SwiperSlide key={movie.id}>
                            <Link href={`detail/movie/${movie.id}`}>
                                <CardMedia
                                    component={'img'}
                                    sx={{
                                        aspectRatio: '2/3',
                                    }}
                                    image={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            </Link>
                            <Typography>{movie.title}</Typography>
                            <Typography>公開日:{movie.release_date}</Typography>
                        </SwiperSlide>
                    ))
                ) : (
                    <div>映画が利用できません</div>
                )}
            </Swiper>
        </AppLayout>
    )
}

export default Dashboard
