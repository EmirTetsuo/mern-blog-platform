import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

export const createComment = async (req, res) => {
    try {
        const { postId, comment } = req.body

        if (!comment)
            return res.json({ message: 'Комментарий не может быть пустым' })

        const newComment = new Comment({ comment })
        await newComment.save()

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            })
        } catch (error) {
            console.log(error)
        }

        res.json(newComment)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}


// Get All Comments
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort('-createdAt')
        res.json(comments) 
    } catch (error) {
        console.log(error)
        res.json({ message: 'Ошибка при получении комментариев.' })
    }
}


// Remove Comment
export const removeComment = async (req, res) => {
    try {
        const { id } = req.params

        const comment = await Comment.findByIdAndDelete(id)
        if (!comment)
            return res.json({ message: 'Комментарий не найден.' })

        await Post.updateMany(
            { comments: id },
            { $pull: { comments: id } }
        )

        res.json({ message: 'Комментарий был удалён.' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Ошибка при удалении комментария.' })
    }
}