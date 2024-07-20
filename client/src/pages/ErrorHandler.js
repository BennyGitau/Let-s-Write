import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center top-20 justify-center h-full">
      <div className="p-20 bg-white rounded-sm shadow-sm text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! 😞</h1>
        <p className="text-lg text-gray-600 mb-6">
          We're sorry, something went wrong.
        </p>
        <Link
          to="/"
          className="text-blue-500 hover:underline bg-blue-100 py-2 px-4 rounded-lg transition duration-200"
        >
         Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
