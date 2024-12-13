"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define interface for form data
interface FormData {
  firstName: string;
  lastName: string;
  birthday: string;
  phone: string;
  email: string;
}

enum PageState {
  Profile = "profile",
  Register = "register",
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<FormData[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.Profile);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("userRegistrationData");
      if (storedData) {
        const parsedData: FormData[] = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setUserData(parsedData);
        } else {
          setCurrentPage(PageState.Register);
        }
      } else {
        setCurrentPage(PageState.Register);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("userRegistrationData");
      setCurrentPage(PageState.Register);
    }
  }, []);
  const registerUser = () => {
    router.push("/register");
  };

  // Handle adding a new user
  const handleAddUser = () => {
    registerUser();
  };

  // Navigate to the next user
  const handleNextUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % userData.length);
  };

  // Navigate to the previous user
  const handlePrevUser = () => {
    setCurrentUserIndex((prevIndex) =>
      prevIndex === 0 ? userData.length - 1 : prevIndex - 1
    );
  };

  // Remove the current user
  const handleRemoveUser = () => {
    const updatedUsers = [...userData];
    updatedUsers.splice(currentUserIndex, 1);

    if (updatedUsers.length > 0) {
      localStorage.setItem(
        "userRegistrationData",
        JSON.stringify(updatedUsers)
      );
      setUserData(updatedUsers);
      setCurrentUserIndex((prevIndex) =>
        prevIndex >= updatedUsers.length ? updatedUsers.length - 1 : prevIndex
      );
    } else {
      localStorage.removeItem("userRegistrationData");
      setUserData([]);
      setCurrentPage(PageState.Register);
    }
  };

  // Get the current user
  const currentUser = userData[currentUserIndex] || null;

  // If user data is loading
  if (userData.length === 0 && currentPage === PageState.Profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Loading...
      </div>
    );
  }

  // Profile page
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          User Profile
        </h2>

        {/* User Count Indicator */}
        <div className="text-center mb-4 text-gray-600">
          User {currentUserIndex + 1} of {userData.length}
        </div>

        {/* User Details */}
        <div className="space-y-4 text-black">
          <div className="bg-gray-50 p-3 rounded-md">
            <strong className="text-black">Name:</strong>
            <span className="ml-2 text-gray-800">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <strong className="text-black">Date of Birth:</strong>
            <span className="ml-2 text-gray-800">{currentUser?.birthday}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <strong className="text-black">Phone:</strong>
            <span className="ml-2 text-gray-800">{currentUser?.phone}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <strong className="text-black">Email:</strong>
            <span className="ml-2 text-gray-800">{currentUser?.email}</span>
          </div>
        </div>

        {/* Navigation and User Management Buttons */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <button
            onClick={handlePrevUser}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            disabled={userData.length <= 1}
          >
            Previous
          </button>
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Add User
          </button>
          <button
            onClick={handleNextUser}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            disabled={userData.length <= 1}
          >
            Next
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("userRegistrationData");
              setCurrentPage(PageState.Register);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout All
          </button>
          <button
            onClick={handleRemoveUser}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            disabled={userData.length <= 1}
          >
            Remove User
          </button>
        </div>
      </div>
    </div>
  );
}
