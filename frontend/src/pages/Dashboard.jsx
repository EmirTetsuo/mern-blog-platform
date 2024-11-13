import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaBlog, FaCog, FaTachometerAlt, FaComment, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { PostItem } from '../components/PostItem';
import { getAllPosts } from '../redux/features/post/postSlice';
import { getAllComments, removeComment } from '../redux/features/comment/commentSlice';  
import { toast } from 'react-toastify';
import { checkIsAuth, getMe, logout, getAllUsers, removeUser } from '../redux/features/auth/authSlice';


export const DashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);
  const { posts } = useSelector((state) => state.post);
  const { comments } = useSelector((state) => state.comment); 
  const { users, user} = useSelector((state) => state.auth); 
  
  const [activeSection, setActiveSection] = useState('overview'); // "overview" для основного контента
  
  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const removeUserHandler = async (userId) => {
    try {
      await dispatch(removeUser(userId)).unwrap(); // Убедимся, что действие выполнено успешно
      toast('Пользователь был удален');
      dispatch(getAllUsers()); // Обновляем список 
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      toast.error('Не удалось удалить пользователя');
    }
  };

  const removeCommentHandler = async (CommentId) => {
    try {
        const data = await dispatch(removeComment(CommentId)).unwrap(); // This should now return the response
        toast('Комментарий был удален');
        dispatch(getAllComments()); // To refresh the comments list
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        toast.error('Не удалось удалить комментарий');
    }
  };
  
    
  

  const stats = {
    users: users?.length || 0,
    posts: posts?.length || 0,
    comments: comments?.length || 0,
  };
  
  useEffect(() => {
    if (user === null) {
      dispatch(getMe()); 
      return;
  }

  if (!isAuth || user?.username !== 'Admin') {
      navigate('/404'); 
      return;
  }
    dispatch(getAllPosts()); // Fetch posts
    dispatch(getAllComments()); // Fetch comments
    dispatch(getAllUsers()); // Fetch users
  
  }, [dispatch, navigate, user]); 
  
  


  const logoutHandler = () => {
      dispatch(logout());
      window.localStorage.removeItem('token');
      toast('Вы вышли из системы');
      navigate('/'); 
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="p-2 xs:p-1 sm:p-2 md:p-4 lg:p-6  bg-gray-800 text-white shadow-lg transition-all">
        <nav>
          <ul>
            <li>
              <NavLink 
                to="#" 
                onClick={() => handleNavClick('overview')} 
                activeClassName="text-blue-400"
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
              >
                <FaTachometerAlt  className="w-6 h-6" /> 
                <span className="hidden md:block">Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/" 
                activeClassName="text-blue-400"
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
              >
                <FaHome className="w-6 h-6" /> 
                <span className="hidden md:block">Главная</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                onClick={() => handleNavClick('posts')} 
                activeClassName="text-blue-400"
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
              >
                <FaBlog className="w-6 h-6" /> 
                <span className="hidden md:block">Посты</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                onClick={() => handleNavClick('users')} 
                activeClassName="text-blue-400"
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
              >
                <FaUser className="w-6 h-6" /> 
                <span className="hidden md:block">Пользователи</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                onClick={() => handleNavClick('comments')} 
                activeClassName="text-blue-400"
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
              >
                <FaComment className="w-6 h-6" /> 
                <span className="hidden md:block">Комментарии</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                onClick={() => handleNavClick('settings')} 
                activeClassName="text-blue-400"
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
              >
                <FaCog className="w-6 h-6" /> 
                <span className="hidden md:block">Настройки</span>
              </NavLink>
            </li>
            <li>
              <button 
                onClick={logoutHandler} 
                className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md w-full mt-4 text-red-500"
              >
                <FaSignOutAlt className="w-6 h-6" /> 
                <span className="hidden md:block">Выйти</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <div className="text-xl font-semibold mb-2">Пользователи</div>
              <div className="text-3xl font-bold text-gray-700">{stats.users}</div> 
            </div>
            <div className="bg-white p-6 rounded-md shadow-lg">
              <div className="text-xl font-semibold mb-2">Посты</div>
              <div className="text-3xl font-bold text-gray-700">{stats.posts}</div>
            </div>
            <div className="bg-white p-6 rounded-md shadow-lg">
              <div className="text-xl font-semibold mb-2">Комментарии</div>
              <div className="text-3xl font-bold text-gray-700">{stats.comments}</div>
            </div>
          </div>
        )}

        {activeSection === 'posts' && (
          <div className="flex flex-col w-full space-y-4">
            {posts?.map((post, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition-shadow"
              >
                <PostItem post={post} />
                <Link
                  to={`/${post._id}`}
                  className="flex items-center justify-center p-2 mt-4 bg-gray-700 rounded-full text-gray-200 hover:bg-red-100 hover:text-red-600 transition-all shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Delete Post
                  <AiFillDelete size={20} />
                </Link>
              </div>
            ))}
        </div>
        )}

        {activeSection === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Пользователи</h2>
            {users?.length > 0 ? (
              users?.map((user) => (
                <div key={user.id} className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mb-4 hover:shadow-xl transition-all duration-300">
                  <div className="text-xl font-semibold text-gray-800">{user.username}</div>
                  <button
                    onClick={() => removeUserHandler(user._id)}
                    className="mt-4 flex items-center text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Нет пользователей.</p>
            )}
          </div>
        )}
        
        {activeSection === 'comments' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Комментарии</h2>
            {comments?.length > 0 ? (
              comments.map((cmt) => (
                <div key={cmt._id} className="flex justify-between bg-white p-6 rounded-md shadow-lg mb-4">
                  <div className="text-gray-700">{cmt.comment}</div>
                  <button
                    onClick={() => removeCommentHandler(cmt._id)}
                    className="mt-4 flex items-center text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Нет комментариев.</p>
            )}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p>Настройки админ-панели.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
