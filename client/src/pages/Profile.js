import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const { user, patchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    email: '',
    age: '',
    dob: '',
    phone_number: '',
    password: '',
    profile_pic: null,
  });

  useEffect(() => {
    // Update initialValues with user details once user is available
    if (user) {
      setInitialValues({
        email: user.email || '',
        age: user.age || '',
        dob: user.dob || '',
        phone_number: user.phone_number || '',
        password: '',
        profile_pic: null,
      });
    }
  }, [user]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    age: Yup.number().positive('Age must be a positive number').integer('Age must be an integer'),
    dob: Yup.date().nullable(),
    phone_number: Yup.string().matches(/^\d+$/, 'Phone number must contain only digits'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
    profile_pic: Yup.mixed().nullable().test('fileSize', 'File too large', (value) => {
      if (value) {
        return value.size <= 8000000; // 8MB max file size
      }
      return true; // Allow null or empty values
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('age', values.age);
      formData.append('dob', values.dob);
      formData.append('phone_number', values.phone_number);
      formData.append('password', values.password);
      formData.append('profile_pic', values.profile_pic);


      await patchUser(formData);
      alert('User details updated successfully!');
      navigate('/dashboard'); // Navigate to home after successful update
    } catch (error) {
      console.error('Failed to update user details:', error);
      alert('Failed to update user details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Navigate back to home
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
<div className="profile-container max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-3">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h2>
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
  >
    {({ isSubmitting, setFieldValue }) => (
      <Form className="space-y-4">
        <div className="form-group">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <Field
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your email"
          />
          <ErrorMessage name="email" component="div" className="error-message text-red-500 text-sm mt-1" />
        </div>
        <div className="form-group">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Age
          </label>
          <Field
            type="number"
            id="age"
            name="age"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your age"
          />
          <ErrorMessage name="age" component="div" className="error-message text-red-500 text-sm mt-1" />
        </div>
        <div className="form-group">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>
          <Field
            type="date"
            id="dob"
            name="dob"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <ErrorMessage name="dob" component="div" className="error-message text-red-500 text-sm mt-1" />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <Field
            type="text"
            id="phone_number"
            name="phone_number"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your phone number"
          />
          <ErrorMessage name="phone_number" component="div" className="error-message text-red-500 text-sm mt-1" />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <Field
            type="password"
            id="password"
            name="password"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your new password"
          />
          <ErrorMessage name="password" component="div" className="error-message text-red-500 text-sm mt-1" />
        </div>
        <div className="form-group">
          <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Picture
          </label>
          <input
            type="file"
            id="profile_pic"
            name="profile_pic"
            onChange={(event) => setFieldValue("profile_pic", event.currentTarget.files[0])}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <ErrorMessage name="profile_pic" component="div" className="error-message text-red-500 text-sm mt-1" />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Cancel
          </button>
        </div>
      </Form>
    )}
  </Formik>
</div>

  );
};

export default Profile;

