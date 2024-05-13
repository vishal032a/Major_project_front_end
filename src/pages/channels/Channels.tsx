import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { localStorageAvailable } from "@mui/x-data-grid/utils/utils";
type channelArray = {
  channel_name: string;
  users: string[];
}[];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  gap: "50px",
};

const Channels = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [nameOfChannel, setNameOfChannel] = useState("");
  const [reload, setReload] = useState(false);
  const [Channels, setChannels] = useState<channelArray>();
  const [joinChannel, setJoinChannel] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const Fetching_channels = async () => {
      try {
        const response = await fetch("http://localhost:8080/list_channel");
        const jsonData = await response.json();
        console.log(jsonData);
        setChannels(jsonData);
      } catch (err) {
        console.log("Error while fetching data", err);
      }
    };
    Fetching_channels();
  }, [reload]);

  const handleCreate = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/create_channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel_name: nameOfChannel,
        }),
      });

      // const responseData = await response.json(); // Parse the JSON response
      // console.log("Response:", responseData);

      if (response.status === 201) {
        // alert("channel created successfully");
        setReload(!reload);
      } else if (response.status === 401) {
        alert("Channel name is required");
      } else if (response.status === 400) alert("Channel already exist");
      else if (response.status === 405)
        alert("Something went wrong please try after sometime");

      // Handle response data here
    } catch (error) {
      alert("There is a problem in the network please try after some time");
      console.error("There was a problem in the :", error);
      // Handle errors here
    }
  };

  const handleJoinChannel = async (channelName: string) => {
    console.log(
      localStorage.getItem("username"),
      localStorage.getItem("password"),
      channelName
    );
    try {
      const response = await fetch("http://127.0.0.1:8080/join_channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          channel_name: channelName,
        }),
      });

      // const responseData = await response.json(); // Parse the JSON response
      // console.log("Response:", responseData);

      if (response.status === 200) {
        navigate(`/messages/${joinChannel}`);
        localStorage.setItem('channel',joinChannel);
      } else if (response.status === 404) {
        alert("user or channel not found");
      } else if (response.status === 400)
        alert("username and channel_name are required");
      else if (response.status === 405)
        alert("Something went wrong please try after sometime");

      // Handle response data here
    } catch (error) {
      alert("There is a problem in the network please try after some time");
      console.error("There was a problem in the :", error);
      // Handle errors here
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          className="bg-[#1976D2] px-4 py-1 rounded-full text-white font-semibold"
          onClick={handleOpen}
        >
          Create
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} gap={7}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter Channel name you want to create
            </Typography>
            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            
          </Typography> */}
            <TextField
              id="outlined-basic"
              label="Channel Name"
              variant="outlined"
              size="small"
              style={{ marginTop: "20px" }}
              onChange={(e) => {
                setNameOfChannel(e.target.value);
              }}
            />
            <Box
              fontStyle={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={() => {
                  handleCreate();
                  handleClose();
                }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      <div className="flex gap-4 " onClick={handleOpenModal}>
        {Channels?.length ? (
          Channels.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1976D2] px-4 py-5 rounded-md text-white"
              onClick={() => setJoinChannel(item.channel_name)}
            >
              {item.channel_name}
            </div>
          ))
        ) : (
          <h3>No Channels is present</h3>
        )}
      </div>

      {/* channel joining confirmation modal */}
      <div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} gap={7}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to join this channel
            </Typography>

            <Box
              fontStyle={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={() => {
                  handleJoinChannel(joinChannel);
                  handleCloseModal();
                }}
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  handleCloseModal();
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Channels;
