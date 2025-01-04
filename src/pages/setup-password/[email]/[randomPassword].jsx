import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import api from '@/../../src/api'
import Link from 'next/link';
import Image from 'next/image';

const SetupPassword = () => {
  const router = useRouter();
  const { email, randomPassword } = router.query;
  const role = router.query.role;

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Ensure both email and randomPassword are available
  if (!email || !randomPassword) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure that none of these are undefined before sending the request
    if (!email || !randomPassword || !newPassword) {
      setError("All fields must be filled out.");
      return;
    }

    const apiEndpoint =
      role === 'admin'
          ? '/api/admin/setup-password'
          : '/api/client/setup-password';
  
    try {
      const response = await api.post(apiEndpoint, {
        email,
        tempPassword: randomPassword,
        newPassword,
      });
  
      if (response.status === 200) {
        setSuccess(true);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to set up password. Please check your details.");
    }
  };
  

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 max-w-md w-full bg-white shadow-md rounded-md">
        <div className="text-center mb-4">
          <Link href="/">
            <Image src="/images/logo/logo.png" alt="Logo" width={150} height={50} />
          </Link>
          <h1 className="text-xl font-bold mt-2">Set Your Password</h1>
          <p className="text-gray-600">Enter a new password to access your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">Password set successfully!</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPassword;
