import { useContext, useEffect } from "react";
import { MyContext } from "../MyContext";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_BACKEND_URL ;

export const usePendingRequests = () => {
  const { pendingRequests, setPendingRequests } = useContext(MyContext);
  const fetchRequests = async () => {
    try {
      const url = `${API_URL}/get_all_pending_request`;
      const decoded = jwtDecode(localStorage.getItem("token"));
      const userId = decoded.id;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      // console.log(result);

      const { success, message, requests } = result;
      if (success) {
        const offers = requests.filter((offer) => offer.userId._id !== userId);
        setPendingRequests(offers);
      }
    } catch (error) {
      console.log("Error during fetching pending requests: ", error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { pendingRequests };
};

export const useMyRequests = () => {
  const { myRequests, setMyRequests } = useContext(MyContext);
  const fetchRequests = async () => {
    try {
      const url = `${API_URL}/get_my_requests`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      // console.log(result);

      const { success, message } = result;
      if (success) {
        setMyRequests(result.myRequests);
      }
    } catch (error) {
      console.log("Error during fetching pending requests: ", error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { myRequests };
};

export const useMyAcceptedReqeusts = () => {
  const { acceptedRequests, setAcceptedRequests } = useContext(MyContext);
  const fetchRequests = async () => {
    try {
      const url = `${API_URL}/get_my_accepted_requests`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      // console.log(result);

      const { success, message } = result;
      if (success) {
        setAcceptedRequests(result.myRequests);
      }
    } catch (error) {
      console.log("Error during fetching accepted requests: ", error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { acceptedRequests };
};

export const useMyAcceptedOffers = () => {
  const { acceptedOffers, setAcceptedOffers } = useContext(MyContext);
  const fetchOffers = async () => {
    try {
      const url = `${API_URL}/get_my_accepted_offers`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      console.log(result);

      const { success, message } = result;
      if (success) {
        setAcceptedOffers(result.myOffers || []);
      }
    } catch (error) {
      console.log("Error during fetching accepted offers: ", error.message);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return { acceptedOffers };
};

export const useMyUpcomingSession = () => {
  const { upcomingSessions, setUpcomingSessions } = useContext(MyContext);
  const fetchSessions = async () => {
    try {
      const url = `${API_URL}/get_my_upcoming_session`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      // console.log(result);

      const { success, message } = result;
      if (success) {
        setUpcomingSessions(result.sessions);
      }
    } catch (error) {
      console.log("Error during fetching upcoming sessions: ", error.message);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return { upcomingSessions };
};

export const getRequestById = async ({ requestId }) => {
  try {
    const url = `${API_URL}/get_request_by_id/${requestId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error during fetching request by id: ", error.message);
    return null;
  }
};

export const acceptRequest = async (pendingRequestId, dateTimeObj) => {
  try {
    console.log(pendingRequestId);
    const url = `${API_URL}/accept_request/${pendingRequestId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        Date: dateTimeObj.date,
        Time: dateTimeObj.time,
      }),
    });

    const result = await response.json();
    // console.log(result);

    const { success, message } = result;
    if (success) {
      alert("Offer Accepted!");
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.log("Error during accepting request: ", error.message);
  }
};

export const declineOffer = async (requestId) => {
  try {
    // console.log(requestId);
    const url = `${API_URL}/decline_request/${requestId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const result = await response.json();
    // console.log(result);

    const { success, message } = result;
    if (success) {
      alert("Offer Rejected Successfully!");
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.log("Error during decline offer : ", error.message);
  }
};

export const deleteRequest = async (requestId) => {
  try {
    const url = `${API_URL}/delete_request/${requestId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const result = await response.json();
    // console.log(result);

    const { success, message } = result;
    if (success) {
      alert("Request deleted successfull!");
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.log("Error during deleting request : ", error.message);
  }
};

export const handleAckAccept = async (requestId, status) => {
  try {
    // console.log(status);
    const url = `${API_URL}/acknoledge_helper/${requestId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        ackStatus: status,
      }),
    });

    const result = await response.json();
    console.log(result);

    const { success, message } = result;
    if (success) {
      alert(message);
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.log("Error during deleting request : ", error.message);
  }
};

export const completeReqeust = async (requestId) => {
  try {
    console.log(requestId);
    const url = `${API_URL}/complete_request/${requestId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.log("Error during completing request : ", error.message);
  }
};

export const useCompletedRequests = () => {
  const { completedRequests, setCompletedRequests } = useContext(MyContext);
  const userId = jwtDecode(localStorage.getItem("token")).id;
  const fetchRequests = async () => {
    try {
      const url = `${API_URL}/get_completed_requests`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      // console.log(result);

      const { success, message } = result;
      if (success) {
      
        result.completedRequests = result.completedRequests.filter(
          (request) =>
            request.userId?._id?.toString() === userId ||
            request.helperId?._id?.toString() === userId
        );

        setCompletedRequests(result.completedRequests || []);
      }
    } catch (error) {
      console.log("Error during fetching upcoming sessions: ", error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { completedRequests };
};
