import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

type LoginDataType = {
  username: string;
  password: string;
};
const Login = () => {
  const form = useForm<LoginDataType>();
  const [password_visibilty, setPassword_visibilty] = useState(false);
  const navigate = useNavigate();
  // const colorCode =
  //   localStorage.getItem("colorMode") === "light" ? "black" : "white";

  const { register, handleSubmit, getValues } = form;

  const login = async (values: LoginDataType) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      // const responseData = await response.json(); // Parse the JSON response
      // console.log("Response:", responseData);

      if (response.status === 200) {
        localStorage.setItem("username", getValues("username"));
        localStorage.setItem("password", getValues("password"));
        navigate("/channels");
      } else if (response.status === 401) {
        alert("Invalid username and password");
      } else if (response.status === 400)
        alert("username and password required");
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
      <div className="absolute text-center space-y-10">
        <h1 className="text-black text-3xl font-semibold">IRC ChatApp</h1>
        <div className="border-2 p-7 md:p-14 rounded-xl space-y-6">
          <form
            onSubmit={handleSubmit(login)}
            className="flex flex-col gap-6 md:gap-8 items-center"
          >
            <h2 className="text-black font-semibold md:font-bold text-xl md:text-3xl">
              Login
            </h2>
            <input
              {...register("username")}
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
                <FaEye
                  color="black"
                  size={25}
                  onClick={() => setPassword_visibilty((prev) => !prev)}
                />
              ) : (
                <FaEyeSlash
                  color="black"
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
              Do not have an account ? <Link to="/signup">SignUp</Link>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
