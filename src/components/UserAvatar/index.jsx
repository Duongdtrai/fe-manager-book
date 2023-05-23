import React, {useEffect, useState} from "react";
import {UserOutlined} from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import {useSelector} from "react-redux";
import Logo from "../../assets/images/logo.png";
// import {getDefValue} from "../../utils/helper";


// eslint-disable-next-line react/prop-types
const UserAvatar = ({size, image}) => {
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    setAvatar(image);
  },[image]);
  return <Avatar src={avatar} size={size} icon={<UserOutlined/>}/>;

};

export default UserAvatar;
