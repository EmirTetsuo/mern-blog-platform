import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../redux/features/post/postSlice'

export const AddPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image, setImage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = () => {
        try {
            const data = new FormData()
            data.append('title', title)
            data.append('text', text)
            data.append('image', image)
            dispatch(createPost(data))
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setText('')
        setTitle('')
    }

    return (
        <form
            className='max-w-lg mx-auto py-12 px-8'
            onSubmit={(e) => e.preventDefault()}
        >
            <label className='block text-sm text-gray-300 font-semibold mb-2'>
                Прикрепить изображение:
                <div
                    className='relative'
                    style={{ cursor: 'pointer' }}
                >
                    <input
                        type='file'
                        className='hidden'
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className='flex items-center justify-center py-8 bg-gray-700 border-2 border-dotted border-gray-500 rounded-lg'>
                        <span className='text-gray-400 text-lg'>
                            Нажмите, чтобы загрузить изображение
                        </span>
                    </div>
                </div>
            </label>
            <div className='flex justify-center py-2'>
                {image && (
                    <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className='w-32 h-32 object-cover rounded-lg shadow-md'
                    />
                )}
            </div>

            <label className='block text-xs text-gray-200 opacity-80 mt-2'>
                Заголовок поста:
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Введите заголовок'
                    className='mt-2 text-black w-full rounded-lg bg-gray-400 py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700'
                />
            </label>

            <label className='block text-xs text-gray-200 opacity-80 mt-4'>
                Текст поста:
                <textarea
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder='Введите текст поста'
                    className='mt-2 text-black w-full rounded-lg bg-gray-400 py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700 resize-none h-40'
                />
            </label>

            <div className='flex gap-8 items-center justify-center mt-6'>
                <button
                    onClick={submitHandler}
                    className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded-lg transition duration-300'
                >
                    Добавить
                </button>

                <button
                    onClick={clearFormHandler}
                    className='bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-6 rounded-lg transition duration-300'
                >
                    Отменить
                </button>
            </div>
        </form>
    )
}
