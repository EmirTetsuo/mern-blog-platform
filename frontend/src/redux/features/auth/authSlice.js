import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
    users: [], 
};


export const getAllUsers = createAsyncThunk(
    'auth/getAllUsers',
    async () => {
        try {
            const { data } = await axios.get('/auth');
            return data;
        } catch (error) {
            console.error(error);
        }
    }
);


export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, email, password }) => {
        try {
            const { data } = await axios.post('/auth/register', {
                username,
                email, 
                password,
            });
            if (data.token) {
                window.localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.log(error);
        }
    },
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ identifier, password }) => {
        try {
            const { data } = await axios.post('/auth/login', {
                identifier, 
                password,
            });
            if (data.token) {
                window.localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.log(error);
        }
    },
);

export const removeUser = createAsyncThunk(
    'auth/removeUser',
    async (userId, { rejectWithValue }) => {
      try {
        const { data } = await axios.delete(`/auth/users/${userId}`);
        return data;
      } catch (error) {
        console.error('Error while deleting user:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Ошибка сервера');
      }
    }
  );

export const getMe = createAsyncThunk('auth/getMe', async () => {
    try {
        const { data } = await axios.get('/auth/me');
        return data;
    } catch (error) {
        console.log(error);
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.status = null;
        },
    },
    extraReducers: {
        // Get all users
        [getAllUsers.pending]: (state) => {
            state.loading = true
        },
        [getAllUsers.fulfilled]: (state, action) => {
            state.loading = false
            state.users = action.payload.users
        },
        [getAllUsers.rejected]: (state) => {
            state.loading = false
        },
        // Register user
        [registerUser.pending]: (state) => {
            state.isLoading = true;
            state.status = null;
        },
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.status = action.payload.message;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.users.push(action.payload)
        },
        [registerUser.rejected]: (state, action) => {
            state.status = action.payload?.message || 'Registration failed';
            state.isLoading = false;
        },
        // Login user
        [loginUser.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.status = action.payload.message;
        },
        [loginUser.pending]: (state) => {
            state.isLoading = true;
            state.status = null;
        },
        [loginUser.rejected]: (state, action) => {
            state.status = action.payload?.message || 'Login failed';
            state.isLoading = false;
        },
        // Check authorization
        [getMe.pending]: (state) => {
            state.isLoading = true;
            state.status = null;
        },
        [getMe.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.status = null;
            state.user = action.payload?.user;
            state.token = action.payload?.token;
        },
        [getMe.rejected]: (state, action) => {
            state.status = action.payload?.message || 'Authorization check failed';
            state.isLoading = false;
        },
        // удаление пользователя
        [removeUser.pending]: (state) => {
            state.loading = true
        },
        [removeUser.fulfilled]: (state, action) => {
            state.loading = false
            state.users = state.users.filter(
                (user) => user._id !== action.payload._id,
            )
        },
        [removeUser.rejected]: (state) => {
            state.loading = false
        },
    }, 
});

export const checkIsAuth = (state) => Boolean(state.auth.token);

export const { logout } = authSlice.actions;
export default authSlice.reducer;
