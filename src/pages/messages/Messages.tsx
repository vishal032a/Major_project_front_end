import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type MessageArrayType = {
  channel_name: string;
  content: string;
  username: string;
}[];

// setInterval(getMessages, 2000);
const Messages = () => {
  const form = useForm();
  const { register, getValues, setValue } = form;
  const [messageArray, setMessageArray] = useState<MessageArrayType>();
  const [reload, setReload] = useState(false);
  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/get_messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
          channel_name: localStorage.getItem("channel"),
        }),
      });

      //   const data = await response.json();
      //   console.log(data.messages);

      if (response.status === 200) {
        const data = await response.json();
        setMessageArray(data.messages || []);
        console.log(messageArray);
      } else if (response.status === 401) {
        alert("Authentication failed or user not in the channel");
      } else if (response.status === 400)
        alert("Username, password, channel name, and content are required");
      else if (response.status === 405)
        alert("Something went wrong please try after sometime");
    } catch (error) {
      alert("There is a problem in the network please try after some time");
      console.error("There was a problem in the :", error);
    }
  };
  const handleSend = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
          channel_name: localStorage.getItem("channel"),
          content: getValues("message"),
        }),
      });

      // const responseData = await response.json(); // Parse the JSON response
      // console.log("Response:", responseData);

      if (response.status === 401) {
        alert("Authentication failed or user not in the channel");
      } else if (response.status === 400)
        alert("Username, password, channel name, and content are required");
      else if (response.status === 405)
        alert("Something went wrong please try after sometime");

      // Handle response data here
    } catch (error) {
      alert("There is a problem in the network please try after some time");
      console.error("There was a problem in the :", error);
      // Handle errors here
    }
  };

//   const handleReload = () => {
//     getMessages();
//   };
//   setInterval(handleReload, 1000);
  return (
    <div className="h-[82vh] relative">
      <div className="overflow-y-auto h-[80%]">
        {messageArray?.length ? (
          <>
            {messageArray.map((item, idx) => (
              <div key={idx}>
                <p className="text-md font-semibold">{item.username}</p>
                <p className="text-sm">{item.content}</p>
              </div>
            ))}
          </>
        ) : (
          <h6>No messages yet</h6>
        )}
      </div>
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gray-200 flex justify-end">
        <input className="w-[80%]" {...register("message")} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSend();
            setValue("message", "");
            getMessages();
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Messages;
