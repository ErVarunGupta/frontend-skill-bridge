import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../MyContext";
import { declineOffer, useMyAcceptedOffers } from "../../api/helpApi";
import "./AcceptedRequests.css";
import { useNavigate } from "react-router-dom";

function AcceptedOffers() {
  const { setAcceptedOffers } = useContext(MyContext);
  const { acceptedOffers } = useMyAcceptedOffers();
  const navigate = useNavigate();

  useEffect(() => {
    setAcceptedOffers(acceptedOffers);
    // console.log(acceptedOffers[0]?.userId.profilePicture);
  }, [acceptedOffers]);

  return (
    <>
      <div className="offers_wrapper_container">
        {acceptedOffers.length === 0 && (
          <h2 style={{ marginTop: "30%" }}>Accepted Offers Not Found!</h2>
        )}
        {acceptedOffers.length > 0 && (
          <>
            <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>
              Accepted Offers
            </p>
            <div className="accepted_container">
              {acceptedOffers?.map((request) => {
                return (
                  <div key={request._id} className="accepted_card_conatainer">
                    <div className="helper_profile">
                      <img src={request?.userId?.profilePicture} alt="" />
                      <div>
                        <p style={{ fontWeight: "600" }}>
                          {request?.userId?.name}
                        </p>
                        <p
                          style={{
                            fontWeight: "400",
                            fontSize: ".9rem",
                            color: "gray",
                          }}
                        >
                          @{request?.userId?.username}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate(`/show_profile/${request?.userId._id}`);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="requests_details">
                      <p style={{ fontSize: "20px" }}>
                        <span style={{ fontWeight: "600" }}>Title:</span>{" "}
                        <span style={{ fontWeight: "500" }}>
                          {request.title}
                        </span>
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
                      <div className="action_buttons">
                        <button
                          style={{ background: "#6c757d", color: "#fff" }}
                          onClick={() => {
                            navigate(`/user/chat/${request?._id}`);
                          }}
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => declineOffer(request._id)}
                          style={{ background: "red", color: "#fff" }}
                        >
                          Decline
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
    </>
  );
}

export default AcceptedOffers;
