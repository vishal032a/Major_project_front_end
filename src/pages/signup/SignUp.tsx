import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useNavigation } from "react-router-dom";

type SignUpDataType = {
  email: string;
  password: string;
};
const Signup = () => {
  const form = useForm<SignUpDataType>();
  const [password_visibilty, setPassword_visibilty] = useState(false);
  const { register, handleSubmit } = form;
  const navigate = useNavigate();
  const signUp = async (values: SignUpDataType) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.email,
          password: values.password,
        }),
      });

      // const responseData = await response.json(); // Parse the JSON response
      // console.log("Response:", responseData);

      if (response.status === 201) {
        alert(
          "Registration Successfull please login using username and password"
        );
        navigate("/login");
      } else if (response.status === 401) {
        alert("Username and password is required");
      } else if (response.status === 400) alert("User already exist");
      else alert("Something went wrong please try after sometime");

      // Handle response data here
    } catch (error) {
      alert("There is a problem in the network please try after some time");
      console.error("There was a problem in the :", error);
      // Handle errors here
    }
  };
  return (
    <div className="h-screen flex justify-center items-center relative ">
      <div className="absolute text-center space-y-10 ">
        <h1 className="text-black text-3xl font-semibold">IRC ChatApp</h1>
        <div className="border-2 p-7 md:p-14 rounded-xl space-y-6">
          <form
            onSubmit={handleSubmit(signUp)}
            className="flex flex-col gap-6 md:gap-8 items-center"
          >
            <h2 className="text-black font-semibold md:font-bold text-xl md:text-3xl">
              SignUp
            </h2>
            <input
              {...register("email")}
              type="text"
              className="placeholder-opacity-25 bg-transparent border-[1px] text-black rounded-md px-4 py-1 focus:outline-none w-[100%]"
              placeholder="username"
            />
            <div className="border-[1px] rounded-md flex items-center">
              <input
                {...register("password")}
                type={password_visibilty ? "text" : "password"}
                className="bg-transparent text-black  rounded-md focus:outline-none px-4 py-1 "
                placeholder="Password"
              />
              {password_visibilty ? (
                <FaEyeSlash
                  color="white"
                  size={25}
                  onClick={() => setPassword_visibilty((prev) => !prev)}
                />
              ) : (
                <FaEye
                  color="white"
                  size={25}
                  onClick={() => setPassword_visibilty((prev) => !prev)}
                />
              )}
            </div>
            <button
              type="submit"
              className="text-white border-2 w-28 rounded-lg  px-4 py-1 bg-blue-600"
            >
              Submit
            </button>
          </form>
          <div className="text-black ">
            <h1>
              Already have an account ? <Link to="/login">Login</Link>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
