// UserCard.js
import React from 'react';
import './UserCard.css'; // You can create this file for styling

const UserCard = ({ user }) => {
  const { name, account_no, email, sid, imageUrl } = user;

  return (
    <div className="user-card">
      <img src={imageUrl} alt={name} className="user-image" />
      <div className="user-details">
        <h2>{name}</h2>
        <p>Account_no: {account_no}</p>
        <p>Email: {email}</p>
        <p>SID: {sid}</p>
      </div>
    </div>
  );
};

export default UserCard;
