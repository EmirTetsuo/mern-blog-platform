import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PopularPosts } from '../components/PopularPosts';
import { PostItem } from '../components/PostItem';
import { getAllPosts } from '../redux/features/post/postSlice';

export const MainPage = () => {
    const dispatch = useDispatch();
    const { posts, popularPosts } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    if (!posts.length) {
        return (
            <div className='text-xl text-center text-gray-400 py-20'>
                <p>Постов нет.</p>
            </div>
        );
    }

    return (
        <div className='max-w-screen-xl mx-auto px-6 py-12'>
            <div className='flex justify-between gap-12'>
                <div className='flex flex-col gap-12 w-full md:w-3/4'>
                    {posts?.map((post, idx) => (
                        <PostItem key={idx} post={post} />
                    ))}
                </div>

                <div className='hidden md:block w-full md:w-1/4'>
                    <div className='text-sm font-semibold text-gray-500 mb-6'>
                        <span className='uppercase tracking-wider text-white'>Популярное:</span>
                    </div>

                    <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
                        {popularPosts?.map((post, idx) => (
                            <PopularPosts key={idx} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
