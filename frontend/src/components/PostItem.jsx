import React from 'react'
import { AiFillEye, AiOutlineMessage } from 'react-icons/ai'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'

export const PostItem = ({ post }) => {
    if (!post) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Загрузка...
            </div>
        )
    }

    return (
        <Link to={`/${post._id}`} className='group'>
            <div className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
                <div className={post.imgUrl ? 'h-80' : 'h-48'}>
                    {post.imgUrl && (
                        <img
                            src={`http://localhost:3002/${post.imgUrl}`}
                            alt='Post image'
                            className='object-cover w-full h-full'
                        />
                    )}
                </div>

                {/* Post Content */}
                <div className='p-4'>
                    <div className='flex justify-between items-center text-xs text-gray-500'>
                        <div>{post.username}</div>
                        <div>
                            <Moment date={post.createdAt} format='D MMM YYYY' />
                        </div>
                    </div>

                    <div className='mt-2'>
                        <div className='text-lg font-semibold text-gray-800'>{post.title}</div>
                        <p className='text-sm text-gray-600 mt-2 line-clamp-4'>{post.text}</p>
                    </div>

                    <div className='flex gap-4 items-center mt-4 text-xs text-gray-500'>
                        <button className='flex items-center gap-1'>
                            <AiFillEye />
                            <span>{post.views}</span>
                        </button>
                        <button className='flex items-center gap-1'>
                            <AiOutlineMessage />
                            <span>{post.comments?.length || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
