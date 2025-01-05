"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";
import { toast, Bounce } from "react-toastify";

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerificationStep, setIsVerificationStep] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleRequestPasswordReset = async () => {
    try {
      const response = await api.post('/api/client/request-password-reset', {
        email: email,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        toast("Password reset request successful. Check your email for the verification code.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setIsVerificationStep(true);  // Go to verification step
      } else {
        setError("Failed to request password reset.");
      }
    } catch (error) {
      console.error("An error occurred during password reset request:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleVerifyResetCode = async () => {
    try {
      const response = await api.post('/api/client/verify-reset-code', {
        email: email,
        code: verificationCode,
      });

      if (response.status === 200) {
        toast("Password reset successful.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        router.push("/auth/signin");  // Redirect to login after successful reset
      } else {
        setError("Invalid verification code.");
      }
    } catch (error) {
      console.error("An error occurred during verification:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
        <h2 className="text-center text-2xl font-bold mb-4">Password Reset</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your email"
          />
        </div>

        {!isVerificationStep && (
          <>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-semibold">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter a new password"
              />
            </div>

            <button
              onClick={handleRequestPasswordReset}
              className="w-full p-2 bg-blue-500 text-white rounded-md"
            >
              Request Password Reset
            </button>
          </>
        )}

        {isVerificationStep && (
          <>
            <div className="mb-4">
              <label htmlFor="verificationCode" className="block text-sm font-semibold">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter the verification code"
              />
            </div>

            <button
              onClick={handleVerifyResetCode}
              className="w-full p-2 bg-blue-500 text-white rounded-md"
            >
              Verify Code and Reset Password
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;