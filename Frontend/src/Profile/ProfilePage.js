import React, { useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import FiveColumnWithBackground from "components/footers/FiveColumnWithBackground";
import UserCard from "./UserCard";
import './UserCard.css'
import userImage from './user-iamge.jpeg';

const ProfilePage = () => {
  const storedData = sessionStorage.getItem('myData');
  const parsedData = JSON.parse(storedData);
  const user = {
    name: parsedData?.username,
    account_no: parsedData?.account_no,
    email: parsedData?.email,
    sid: parsedData?.sid,
    imageUrl: userImage, // Example image URL
  };

  return(
    <AnimationRevealPage>
      <Header />
      <div className="user-card-container">
        <UserCard user={user} />
      </div>
      <FiveColumnWithBackground/>
    </AnimationRevealPage>

  );
};

export default ProfilePage;