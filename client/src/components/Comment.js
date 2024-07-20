import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useTheme } from '../context/ThemeProvider';

const CommentsList = ({ user, id }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const { isDarkMode } = useTheme();
  const [leaveTimeout, setLeaveTimeout] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comments/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    if (user) {
      fetchComments();
    }
  }, [id, user]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `/comments/${id}`,
        { body: newComment },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // Simulate delay before updating state
      setTimeout(() => {
        setComments([...comments, response.data]);
        setNewComment('');
      }, 1000);
    } catch (error) {
      console.error('Error adding comment:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleMouseEnter = (commentId) => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      setLeaveTimeout(null);
    }
    setHoveredCommentId(commentId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCommentId(null);
    }, 1000);
    setLeaveTimeout(timeout);
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  return (
    <div className="bg-white p-6 mt-8 rounded-sm shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Comments</h3>
      <ul className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => {
            let formattedDate = null;
            if (isValidDate(comment.created_at)) {
              formattedDate = formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true });
            }
            return (
              <li
                key={comment.id}
                className="bg-gray-100 p-4 rounded-sm shadow-sm"
                onMouseEnter={() => handleMouseEnter(comment.id)}
                onMouseLeave={handleMouseLeave}
              >
                <p className="text-gray-700">{comment.body}</p>
                <p className="text-gray-500 text-sm">{formattedDate}</p>
                {hoveredCommentId === comment.id && (
                  <button
                    className={`absolute mt-1 border rounded-md shadow-lg p-1 z-10 text-white ${isDarkMode ? 'dark bg-red-600 hover:bg-red-700 border-gray-600' : 'light bg-red-600 hover:bg-red-700 border-gray-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteComment(comment.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </li>
            );
          })
        ) : (
          <li className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p>No comments yet.</p>
          </li>
        )}
      </ul>
      {user && (
        <div className="mt-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 "
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;

