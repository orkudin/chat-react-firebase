import { React, useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const Resetpassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { resetPassword } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword(email);
      navigate("/signin");
    } catch {
      setError(e.message);
      console.log(e.message);
      alert("Email doesn't exist. Please try another");
    }
  };

  return (
    <div className="max-w-[700px] mx-auto my-16 p-4">
      <Link
        to="/signin"
        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
      >
        Back to Sign in.
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3"
            type="email"
          ></input>
        </div>
        <button className="border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white">
          Send Email
        </button>
      </form>
    </div>
  );
};

export default Resetpassword;
