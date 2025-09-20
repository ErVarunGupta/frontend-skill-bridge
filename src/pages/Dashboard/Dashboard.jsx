import React, { useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import Navbar from "../../layouts/Navbar";
import "./Dashboard.css";
import { MyContext } from "../../MyContext";
import {  getUserProfile } from "../../api/authApi";
import {
  acceptRequest,
  declineOffer,
  deleteRequest,
  useMyRequests,
  usePendingRequests,
} from "../../api/helpApi";
import { Link, Outlet} from "react-router-dom";
import CalendarInput from "./ScheduleForm";


function Dashboard() {
  const {
    showRequestCard,
    setShowRequestCard,
    setUserProfile,
    setPendingRequests,
    setPendingRequest,
    setMyRequests,
    setMyRequest,
    showOfferCard,
    setShowOfferCard,
    setMyOffer,
    pendingRequest,
    showDateTime,
    dateTimeObj,
    filterRequests, setFilterRequests
  } = useContext(MyContext);


  const decoded = jwtDecode(localStorage.getItem('token'));

  const {userProfile} = getUserProfile(decoded.id);
  const { pendingRequests } = usePendingRequests();
  const { myRequests: initialRequests } = useMyRequests();



  useEffect(() => {
    setPendingRequests(pendingRequests);
  }, [pendingRequests]);

  useEffect(() => {
    if(initialRequests && filterRequests.length === 0){
      setFilterRequests(initialRequests);
    }
  }, [initialRequests, filterRequests, setFilterRequests]);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="left_dashboard_container">
          <div className="profile_container">
            <img src={userProfile?.profile?.userId?.profilePicture} alt="" />
            <p className="profile_name">{userProfile?.profile?.userId?.name}</p>
            <p className="username">@{userProfile?.profile?.userId?.username}</p>
            <p className="bio">{userProfile?.profile?.bio}</p>
          </div>
          <div className="ratings">
            <p>Accepted Requests: {userProfile?.profile?.totalReviews}</p>
            <p>Ratings: {userProfile?.profile?.averageRating? (userProfile?.profile?.averageRating).toFixed(2): "0.00"}</p>
          </div>
          <div className="my_requests">
            <h3>My Requests</h3>
            <ul>
              {filterRequests?.map((request) => (
                <li key={request?._id}>
                  <p>{request?.title}</p>
                  <span>
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => {
                        setShowRequestCard(true);
                        setMyRequest(request);
                      }}
                    ></i>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="main_dashboard_container">
          {showRequestCard ? <RequestCard /> : ""}
          {showOfferCard && <OfferCard />}
          <Outlet />

          {showDateTime && <div className="schedule_time">
            <CalendarInput />
            <div>
              <button type="button" className="submit-btn" onClick={(e)=> {
              e.preventDefault();
              acceptRequest(pendingRequest._id, dateTimeObj)
              }}>Submit</button>
            </div>
          </div>}
        </div>

        <div className="right_dashboard_container ">
          <div className="all_pending_requests">
            <h3>All Offers</h3>
            <ul>
              {pendingRequests?.map((request) => (
                <li key={request._id}>
                  <p>{request?.title}</p>
                  <span>
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => {
                        setShowOfferCard(true);
                        setPendingRequest(request);
                        setMyOffer(request);
                      }}
                    ></i>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const RequestCard = () => {
  const { setShowRequestCard, myRequest,filterRequests, setFilterRequests } = useContext(MyContext);

  const fillColor = () => {
    if (myRequest?.status === "accepted") return "green";
    else if (myRequest?.status === "pending") return "orange";
    else if (myRequest?.status === "completed") return "green";
    else return "red";
  };

  const filterMyReqeust = (requestId)=>{
    const updatedRequests = filterRequests.filter((request)=>(
      request._id !== requestId
    ))
    setFilterRequests(updatedRequests);
    setShowRequestCard(false);
  }

  
  return (
    <>
      <div className="card_container" style={{}}>
        <div className="cross" onClick={() => setShowRequestCard(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <img src="/images/profile.png" alt="" />
        <p className="title">{myRequest?.title}</p>
        <p className="description">{myRequest?.description}</p>
        <p>
          Status:{" "}
          <span style={{ color: fillColor(), fontWeight: "600" }}>
            {myRequest?.status}
          </span>
        </p>
        <button onClick={()=>filterMyReqeust(myRequest._id)}>Remove</button>
        
      </div>
    </>
  );
};

const OfferCard = () => {
  const { setShowOfferCard, myOffer, showDateTime, setShowDateTime } = useContext(MyContext);

  const fillColor = () => {
    if (myOffer?.status === "accepted") return "green";
    else if (myOffer?.status === "pending") return "orange";
    else return "red";
  };
  return (
    <>
      <div className="offer_card_container">
        <div className="cross" onClick={() => setShowOfferCard(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <img src="/images/profile.png" alt="" />
        <p className="title">{myOffer?.title}</p>
        <p className="description">{myOffer?.description}</p>
        <p>
          Status:{" "}
          <span style={{ color: fillColor(), fontWeight: "600" }}>
            {myOffer?.status}
          </span>
        </p>
        <div className="action_button">
          <button className="accept" onClick={()=>setShowDateTime(!showDateTime)}>
            Accept
          </button>
          <button onClick={() => declineOffer(myOffer._id)} className="decline">
            Decline
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
