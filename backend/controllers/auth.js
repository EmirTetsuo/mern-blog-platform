import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email is already used
        const isUsernameUsed = await User.findOne({ username });
        if (isUsernameUsed) {
            return res.json({
                message: 'Данный username уже занят.',
            });
        }

        const isEmailUsed = await User.findOne({ email });
        if (isEmailUsed) {
            return res.json({
                message: 'Данный email уже занят.',
            });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hash,
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        );

        // Save the user to the database
        await newUser.save();

        res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно.',
        });
    } catch (error) {
        console.log('Error creating user:', error.message);
        res.json({ message: 'Ошибка при создании пользователя.' });
    }
};

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ],
        });


        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Неправильный пароль или почта.',
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        return res.status(200).json({
            token,
            user,
            message: 'Вы вошли в систему.',
        });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Ошибка при авторизации.' });
    }
};




// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Такого пользователя не существует.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({ message: 'Нет доступа.' })
    }
}
