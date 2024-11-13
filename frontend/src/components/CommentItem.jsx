import React from 'react'

export const CommentItem = ({ cmt }) => {
    const avatar = cmt.comment.trim().toUpperCase().split('').slice(0, 2).join('')
    
    return (
        <div className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg transition-all duration-200">
            <div className="flex items-center justify-center shrink-0 rounded-full w-12 h-12 bg-blue-400 text-white text-lg font-bold">
                {avatar}
            </div>
            
            <div className="text-gray-200 text-sm leading-relaxed">
                {cmt.comment}
            </div>
        </div>
    )
}
