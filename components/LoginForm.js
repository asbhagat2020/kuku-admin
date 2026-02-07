"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { sendOtp, verifyOtp } from "@/store/Login/LoginSlicer";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector((state) => state.otp);

  const handleSendOtp = (e) => {
    e.preventDefault();
    dispatch(sendOtp(email))
      .unwrap()
      .then((response) => {
        if (response.otpSent) {
          setIsOtpSent(true);
          setCanResendOtp(false);
          toast.success("OTP sent successfully!");
          const currentTime = new Date().getTime();
          const timeLeft = response.otpExpires - currentTime;
          if (timeLeft > 0) {
            setRemainingTime(Math.ceil(timeLeft / 1000));
            setTimeout(() => setCanResendOtp(true), timeLeft);
          }
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to send OTP.");
      });
  };

  const handleResendOtp = () => {
    dispatch(sendOtp(email))
      .unwrap()
      .then((response) => {
        toast.success("OTP resent successfully!");
        setCanResendOtp(false);

        // Reset countdown timer for the new OTP
        const currentTime = new Date().getTime();
        const timeLeft = response.otpExpires - currentTime;
        if (timeLeft > 0) {
          setRemainingTime(Math.ceil(timeLeft / 1000));
          setTimeout(() => setCanResendOtp(true), timeLeft);
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to resend OTP.");
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp }))
      .unwrap()
      .then(() => {
        toast.success("OTP verified successfully!");
        router.push("/dashboard");
      })
      .catch((err) => {
        toast.error(err.message || "Invalid OTP.");
      });
  };

  // Update countdown timer every second
  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [remainingTime]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-600">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <img src="/kukulogo-img.png" alt="KUKU Logo" className="w-26 h-12" />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isOtpSent
            ? "Enter the OTP sent to your email"
            : "To log in, please enter your email"}
        </p>
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isOtpSent}
            />
          </div>
          {isOtpSent && (
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-600 mb-1">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                OTP expires in: {remainingTime} seconds.
              </p>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading && (
              <span className="loader spinner-border animate-spin mr-2"></span>
            )}
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
        {isOtpSent && (
          <div className="mt-4 text-center">
            <button
              className="text-pink-500 hover:underline disabled:text-gray-400"
              onClick={handleResendOtp}
              disabled={!canResendOtp || loading}
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
