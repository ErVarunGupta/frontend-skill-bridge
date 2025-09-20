import React, { useContext, useEffect } from "react";
import {
  declineOffer,
  handleAckAccept,
  useMyAcceptedReqeusts,
} from "../../api/helpApi";
import { MyContext } from "../../MyContext";
import "./AcceptedRequests.css";
import { useNavigate } from "react-router-dom";

function AcceptedRequests() {
  const navigate = useNavigate();
  const { setAcceptedRequests } = useContext(MyContext);
  const { acceptedRequests } = useMyAcceptedReqeusts();

  useEffect(() => {
    setAcceptedRequests(acceptedRequests);
    // console.log(acceptedRequests);
  }, [acceptedRequests]);
  return (
    <div className="offers_wrapper_container">
      {acceptedRequests.length === 0 && (
        <h2 style={{ marginTop: "30%" }}>Accepted Requests Not Found!</h2>
      )}
      {acceptedRequests.length > 0 && (
        <>
          <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>
            Accepted Requests
          </p>
          <div className="accepted_container">
            {acceptedRequests?.map((request) => {
              return (
                <div key={request._id} className="accepted_card_conatainer">
                  <div className="helper_profile">
                    <img src={request?.helperId?.profilePicture} alt="" />
                    <div>
                      <p style={{ fontWeight: "600" }}>
                        {request?.helperId?.name}
                      </p>
                      <p
                        style={{
                          fontWeight: "400",
                          fontSize: ".9rem",
                          color: "gray",
                        }}
                      >
                        @{request?.helperId?.username}
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
                        onClick={(e) =>
                          handleAckAccept(request._id, "accepted")
                        }
                        style={{ background: "green", color: "#fff" }}
                      >
                        AckAccept
                      </button>
                      <button
                        onClick={(e) => handleAckAccept(request._id, "waiting")}
                        style={{ background: "red", color: "#fff" }}
                      >
                        AckDecline
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

export default AcceptedRequests;
