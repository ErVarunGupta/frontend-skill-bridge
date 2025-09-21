import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../MyContext";
import { declineOffer, useCompletedRequests } from "../../api/helpApi";
import "./AcceptedRequests.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function CompletedRequests() {
  const navigate = useNavigate();

  const { completedRequests, loading } = useCompletedRequests();
  //   console.log(completedRequests);

  const userId = jwtDecode(localStorage.getItem("token")).id;

  return (
    <div className="offers_wrapper_container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : completedRequests.length == 0 ? (
        <h2 style={{ marginTop: "30%" }}>Completed Requests Not Found!</h2>
      ) : (
        <>
          <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>
            Upcoming Sessions
          </p>
          <div className="accepted_container">
            {completedRequests?.map((request) => {
              return (
                <div key={request._id} className="accepted_card_conatainer">
                  <div className="helper_profile">
                    <img
                      src={
                        request?.userId?._id === userId
                          ? request?.helperId?.profilePicture
                          : request?.userId?.profilePicture
                      }
                      alt=""
                    />
                    <div>
                      <p style={{ fontWeight: "600" }}>
                        {request?.userId?._id === userId
                          ? request?.helperId?.name
                          : request?.userId?.name}
                      </p>
                      <p
                        style={{
                          fontWeight: "400",
                          fontSize: ".9rem",
                          color: "gray",
                        }}
                      >
                        @
                        {request?.userId?._id === userId
                          ? request?.helperId?.username
                          : request?.userId?.username}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`/show_profile/${request?.helperId._id}`);
                      }}
                    >
                      View Profile
                    </button>
                  </div>

                  <div className="requests_details">
                    <p style={{ fontSize: "20px" }}>
                      <span style={{ fontWeight: "600" }}>Title:</span>{" "}
                      <span style={{ fontWeight: "500" }}>{request.title}</span>
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "600" }}>Description:</span>{" "}
                      {request.description}
                    </p>
                    <p>
                      <span style={{ fontStyle: "italic" }}>
                        Schedule Date:
                      </span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {request.scheduledTime.Date}
                      </span>
                    </p>
                    <p>
                      <span style={{ fontStyle: "italic" }}>
                        Schedule Time:
                      </span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {request.scheduledTime.Time}
                      </span>
                    </p>
                    <p>
                      Status: <span style={{ color: "green" }}>Completed</span>
                    </p>
                    <div className="action_buttons">
                      <button
                        style={{ background: "#6c757d", color: "#fff" }}
                        onClick={() => {
                          navigate(`/user/chat/${request?._id}`);
                        }}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default CompletedRequests;
