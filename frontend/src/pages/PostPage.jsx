import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiFillEye, AiOutlineMessage, AiTwotoneEdit, AiFillDelete } from 'react-icons/ai'
import Moment from 'react-moment'
import axios from '../utils/axios'
import { removePost } from '../redux/features/post/postSlice'
import { createComment, getPostComments } from '../redux/features/comment/commentSlice'
import { CommentItem } from '../components/CommentItem'

export const PostPage = () => {
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')

    const { user } = useSelector((state) => state.auth)
    const { comments } = useSelector((state) => state.comment)
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    const removePostHandler = () => {
        try {
            dispatch(removePost(params.id))
            toast('Пост был удален')
            navigate('/posts')
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = () => {
        try {
            const postId = params.id
            dispatch(createComment({ postId, comment }))
            setComment('')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchComments = useCallback(async () => {
        try {
            dispatch(getPostComments(params.id))
        } catch (error) {
            console.log(error)
        }
    }, [params.id, dispatch])

    const fetchPost = useCallback(async () => {
        const { data } = await axios.get(`/posts/${params.id}`)
        setPost(data)
    }, [params.id])

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    if (!post) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Загрузка...
            </div>
        )
    }

    return (
        <div className='max-w-screen-xl mx-auto p-4'>
            <button className='bg-gray-700 text-xs text-white rounded-sm py-2 px-4 mb-6 hover:bg-gray-600 transition'>
                <Link to='/posts' className='flex'>
                    Назад
                </Link>
            </button>

            <div className='flex flex-col gap-12'>
                <div className='md:w-2/3 mx-auto'>
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div
                            className={
                                post?.imgUrl
                                    ? 'rounded-sm h-80 mb-4 overflow-hidden'
                                    : 'rounded-sm h-48 mb-4'
                            }
                        >
                            {post?.imgUrl && (
                                <img
                                    src={`http://localhost:3002/${post.imgUrl}`}
                                    alt='Post image'
                                    className='object-cover w-full h-full rounded-sm'
                                />
                            )}
                        </div>

                        <div className='flex justify-between items-center text-xs text-gray-600'>
                            <div className='font-semibold'>{post.username}</div>
                            <div>
                                <Moment date={post.createdAt} format='D MMM YYYY' />
                            </div>
                        </div>

                        <div className='text-2xl font-semibold text-gray-900 mt-4'>
                            {post.title}
                        </div>
                        <p className='text-gray-700 mt-2 text-sm line-clamp-4'>
                            {post.text}
                        </p>

                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex gap-6'>
                                <button className='flex items-center text-gray-600 gap-1 hover:text-gray-800'>
                                    <AiFillEye />
                                    <span>{post.views}</span>
                                </button>
                                <button className='flex items-center text-gray-600 gap-1 hover:text-gray-800'>
                                    <AiOutlineMessage />
                                    <span>{post.comments?.length || 0}</span>
                                </button>
                            </div>

                            {user?._id === post.author && (
                                <div className='flex gap-4'>
                                    <Link
                                        to={`/${params.id}/edit`}
                                        className='flex items-center text-gray-600 hover:text-gray-800'
                                    >
                                        <AiTwotoneEdit />
                                    </Link>
                                    <button
                                        onClick={removePostHandler}
                                        className='flex items-center text-gray-600 hover:text-gray-800'
                                    >
                                        <AiFillDelete />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-full bg-gray-800 rounded-lg p-6 mx-auto'>
                    <form
                        className='flex gap-4 mb-4'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type='text'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Напишите комментарий...'
                            className='w-full rounded-sm bg-gray-600 border p-3 text-xs text-white placeholder:text-gray-400 focus:outline-none'
                        />
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='bg-blue-600 text-white rounded-sm py-2 px-4 text-xs hover:bg-blue-700 transition'
                            disabled={!user}
                        >
                            Отправить
                        </button>
                    </form>

                    <div className='space-y-4'>
                        {comments?.map((cmt) => (
                            <CommentItem key={cmt._id} cmt={cmt} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
