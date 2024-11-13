import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, logout } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';

export const Navbar = () => {
    const isAuth = useSelector(checkIsAuth);
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 720);
    };

    useEffect(() => {
        handleResize(); 
        window.addEventListener('resize', handleResize);

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const activeStyles = {
        color: isMenuOpen ? 'black' : 'white',
    };

    const logoutHandler = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        toast('Вы вышли из системы');
        setIsMenuOpen(false);  
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className='header sticky top-0 z-10 flex py-4 justify-between items-center w-full'>
            <span className="flex justify-center items-center w-20 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-xs text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                <NavLink to="/" className="flex items-center space-x-2">
                    <span>Blog Market</span>
                </NavLink>
            </span>

            {isAuth && !isMobile && (
                <ul className='flex gap-8'>
                    <li>
                        <NavLink
                            to={'/'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                        >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/posts'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                        >
                            Мои посты
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/new'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                        >
                            Добавить пост
                        </NavLink>
                    </li>
                </ul>
            )}

            <div>
                {isMobile ? (
                    <button
                        className="text-2xl text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FaBars />
                    </button>
                ) : (
                    <div>
                        {isAuth ? (
                            <button
                                onClick={logoutHandler}
                                className="flex items-center justify-center w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out"
                            >
                                <FaSignOutAlt className="mr-2" /> Выйти
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={'/login'}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-200 mx-2"
                                >
                                    Войти
                                </Link>
                                <Link
                                    to={'/register'}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition duration-200 mx-2"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {isMobile && isMenuOpen && (
                    <div className="absolute top-32 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                        <div ref={menuRef} className="bg-gray-100 text-white p-5 rounded-lg w-80">
                            {isAuth && (
                                <ul className='flex flex-col gap-4'>
                                    <li>
                                        <NavLink
                                            to={'/'}
                                            className='text-center text-xs text-gray-400 hover:text-black'
                                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                                            onClick={handleLinkClick} 
                                        >
                                            Главная
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={'/posts'}
                                            className='text-center text-xs text-gray-400 hover:text-black'
                                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                                            onClick={handleLinkClick}
                                        >
                                            Мои посты
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={'/new'}
                                            className='text-center text-xs text-gray-400 hover:text-black'
                                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                                            onClick={handleLinkClick}
                                        >
                                            Добавить пост
                                        </NavLink>
                                    </li>
                                </ul>
                            )}

                            <div className="text-center">
                                {isAuth ? (
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center mt-6 justify-center w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out"
                                        >
                                        <FaSignOutAlt className="mr-2" /> Выйти
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            to={'/login'}
                                            className="block py-1 px-1 mb-2 bg-blue-500 hover:bg-blue-700 rounded"
                                            onClick={handleLinkClick} 
                                        >
                                            Войти
                                        </Link>
                                        <Link
                                            to={'/register'}
                                            className="block py-1 px-1 bg-green-500 hover:bg-green-700 rounded"
                                            onClick={handleLinkClick}
                                        >
                                            Регистрация
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
