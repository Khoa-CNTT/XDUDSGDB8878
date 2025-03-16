import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { handleApiBuilding } from "../../apis/api";
import handleApiRequest from "../../apis/apiRequest";

const RoomChatScreen = () => {
  const [roomChats, setRoomChats] = useState([]);
  const auth = useSelector(authSelector);
  const [editingRoomChat, setEditingRoomChat] = useState(null);
  const [file, setFile] = useState();

  function handleChooseFileChange(event) {
    setFile(event.target.files[0]);
  }

  const refresh = async () => {
    return await handleApiRequest(
      "/api/admin/room-chats",
      {},
      "get",
      auth?.token
    )
      .then((res) => setRoomChats(res?.data))
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  };

  useEffect(() => {
    handleApiRequest("/api/admin/room-chats", {}, "get", auth?.token)
      .then((res) => setRoomChats(res?.data))
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  }, [auth?.token]);
  const handleEditClick = (roomChat) => {
    setEditingRoomChat({
      id: roomChat?.id,
      name: roomChat?.name,
      description: roomChat?.description,
    });
  };

  const handleCloneClick = (roomChat) => {
    setEditingRoomChat({
      id: roomChat?.id,
      name: roomChat?.name,
      description: roomChat?.description,
    });
  };

  const handleUpLoadClick = (roomChat) => {
    setEditingRoomChat({
      id: roomChat?.id,
    });
  };

  const handleUpload = async () => {
    setEditingRoomChat(null);
    console.log(editingRoomChat);

    if (!file) {
      message.error("Choose file please!");
      setEditingRoomChat(null);
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      await handleApiRequest(
        `/api/admin/room-chats/${editingRoomChat?.id}/upload-image`,
        formData,
        "post",
        auth?.token
      );
      message.success("Upload image successfully!");
      await refresh();
    } catch (error) {
      message.error("Upload error: " + error);
      console.log("Upload error: ", error);
    }
  };

  const handleClone = async () => {
    setEditingRoomChat(null);
    console.log(editingRoomChat);
    const payload = {
      name: editingRoomChat?.name,
      description: editingRoomChat?.description,
    };
    await handleApiRequest(
      `/api/admin/room-chats`,
      payload,
      "post",
      auth?.token
    )
      .then((res) => message.success("Clone successfully!"))
      .catch((error) => {
        message.error("Clone error: ", error);
        console.log("Clone error: ", error);
      });
    await refresh();
  };

  const handleSaveClick = async (id) => {
    setEditingRoomChat(null);
    console.log(id);
    console.log(editingRoomChat);
    const payload = {
      name: editingRoomChat?.name,
      structure: editingRoomChat?.structure,
      description: editingRoomChat?.description,
    };
    await handleApiBuilding(
      `/api/admin/room-chats/${id}`,
      payload,
      "patch",
      auth?.token
    )
      .then((res) => message.success("Update successfully!"))
      .catch((error) => {
        message.error("Update error: ", error);
        console.log("Update error: ", error);
      });
    await refresh();
  };

  useEffect(() => {
    handleApiBuilding("/api/admin/room-chats", {}, "get", auth?.token)
      .then((res) => setRoomChats(res?.data))
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  }, [auth?.token]);

  const deleteById = async (id) => {
    await handleApiRequest(
      `/api/admin/room-chats/${id}`,
      {},
      "delete",
      auth?.token
    )
      .then((res) => message.success("Delete successfully!"))
      .catch((error) => {
        message.error("Delete error: ", error);
        console.log("Delete error: ", error);
      });
    await refresh();
  };

  return (
    <div>
      <div>
        <div className="card">
          <div className="card-header">Danh Sách phòng nhắn tin</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="align-middle text-center">ID</th>
                    <th className="align-middle text-center">Ảnh</th>
                    <th className="align-middle text-center">Tên phòng</th>
                    <th className="align-middle text-center">Mô tả</th>
                    <th colSpan={"5"}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roomChats?.map((roomChat, index) => (
                    <tr key={index}>
                      <td>{roomChat?.id}</td>
                      <td>
                        {editingRoomChat?.id === roomChat.id ? (
                          <input
                            type="file"
                            className="form-control"
                            id="file"
                            name={"file"}
                            onChange={handleChooseFileChange}
                            style={{ width: "250px" }}
                          />
                        ) : (
                          <img
                            src={`data:${roomChat?.file_type};base64,${roomChat?.image}`}
                            alt={roomChat?.file_type}
                            width={"200px"}
                          />
                        )}
                      </td>
                      <td>
                        {editingRoomChat?.id === roomChat.id ? (
                          <input
                            type="text"
                            value={editingRoomChat.name}
                            onChange={(e) =>
                              setEditingRoomChat({
                                ...editingRoomChat,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <textarea value={roomChat.name} readOnly />
                        )}
                      </td>
                      <td>
                        {editingRoomChat?.id === roomChat.id ? (
                          <input
                            type="text"
                            value={editingRoomChat.description}
                            onChange={(e) =>
                              setEditingRoomChat({
                                ...editingRoomChat,
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <textarea value={roomChat.description} readOnly />
                        )}
                      </td>
                      {editingRoomChat?.id === roomChat.id ? (
                        <td>
                          <Button
                            className={"btn btn-danger"}
                            onClick={() => {
                              setEditingRoomChat(null);
                            }}
                          >
                            X
                          </Button>
                        </td>
                      ) : null}
                      <td>
                        {editingRoomChat?.id === roomChat.id ? (
                          <div>
                            <Button
                              onClick={() => {
                                handleSaveClick(roomChat.id).then();
                              }}
                            >
                              Lưu
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Button
                              className={"btn btn-warning"}
                              onClick={() => handleEditClick(roomChat)}
                            >
                              Sửa
                            </Button>
                          </div>
                        )}
                      </td>
                      <td>
                        {editingRoomChat?.id === roomChat.id ? (
                          <div>
                            <Button onClick={handleClone}>Tạo</Button>
                          </div>
                        ) : (
                          <div>
                            <Button
                              className={"btn btn-success"}
                              onClick={() => handleCloneClick(roomChat)}
                            >
                              Nhân đôi
                            </Button>
                          </div>
                        )}
                      </td>
                      <td>
                        {editingRoomChat?.id === roomChat.id ? (
                          <div>
                            <Button onClick={handleUpload}>Đăng</Button>
                          </div>
                        ) : (
                          <div>
                            <Button
                              className={"btn btn-info"}
                              onClick={() => {
                                handleUpLoadClick(roomChat);
                              }}
                            >
                              Đăng ảnh
                            </Button>
                          </div>
                        )}
                      </td>
                      <td>
                        <Button
                          className={"btn btn-danger"}
                          onClick={() => {
                            deleteById(roomChat?.id).then();
                          }}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomChatScreen;
