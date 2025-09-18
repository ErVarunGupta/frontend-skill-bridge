import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequestById } from "../api/helpApi";
import { jwtDecode } from "jwt-decode";
import "./VideoCall.css";

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoCall() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);

  const [isCaller, setIsCaller] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      if (requestId) {
        const res = await getRequestById({ requestId });
        if (res?.success) {
          setRequest(res.request);
        }
      }
    };
    fetchRequest();
  }, [requestId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const loggedInUserId = decoded.id;

    if (request && loggedInUserId) {
      if (request.userId._id === loggedInUserId) {
        setIsCaller(true);
      } else if (request.helperId._id === loggedInUserId) {
        setIsCaller(false);
      }
    }
  }, [request]);

  const currentUser = request?.userId._id;
  const anotherUse = request?.helperId._id;

  // const callId = [currentUser, anotherUse].sort().join("_");
  const callId = requestId;
  console.log(callId);
  // 68c82d81f604763fb3e519be_68c951c53e3f0c75f9def59e
  //68c82d81f604763fb3e519be_68c951c53e3f0c75f9def59e
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const pc = useRef(new RTCPeerConnection(servers));

  useEffect(() => {
    if (isCaller === null) return;

    let localStream;

    const init = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;
      localStream
        .getTracks()
        .forEach((track) => pc.current.addTrack(track, localStream));

      pc.current.ontrack = (event) => {
        console.log("Remote stream mil gaya:", event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.current.onicecandidate = async (event) => {
        if (!event.candidate) return;
        const candidate = event.candidate.toJSON();
        const col = isCaller ? "callerCandidates" : "calleeCandidates";
        await addDoc(collection(db, "calls", callId, col), candidate);
      };

      if (isCaller) {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        await setDoc(doc(db, "calls", callId), { offer });
        onSnapshot(doc(db, "calls", callId), (snapshot) => {
          const data = snapshot.data();
          if (data?.answer && !pc.current.currentRemoteDescription) {
            pc.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        });
      } else {
        onSnapshot(doc(db, "calls", callId), async (snapshot) => {
          const data = snapshot.data();
          if (data?.offer && !pc.current.currentRemoteDescription) {
            // Got offer from caller
            await pc.current.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );

            // Create & send answer
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            await setDoc(
              doc(db, "calls", callId),
              { answer},
              { merge: true }
            );
          }
        });
      }

      const col = isCaller ? "calleeCandidates" : "callerCandidates";
      onSnapshot(collection(db, "calls", callId, col), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
          }
        });
      });
    };

    init();

    return () => {
      pc.current.close();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [callId, isCaller]);

  const [isExpand, setIsExpand] = useState(false);

  return (
  <div className="video-call-container">
    {/* Remote / Other person's video */}
    <div className="video-wrapper">
      <video ref={remoteVideoRef} autoPlay className={isExpand? "remote-video fill": "remote-video contain"} />
      <div className="video-name">
        {isCaller ? request?.helperId?.name : request?.userId?.name}
        {isExpand? <i class="fa-solid fa-minimize" onClick={()=> setIsExpand(false)}></i> : <i class="fa-solid fa-expand" onClick={()=> setIsExpand(true)}></i>}
      </div>
    </div>

    {/* Local / Self video */}
    <div className="video-wrapper local-wrapper">
      <video ref={localVideoRef} autoPlay muted className="local-video" />
      <div className="video-name local-name">
        You
      </div>
    </div>

    <div>
      <button className="complete-btn" onClick={()=> {
        pc.current.close();
        if(isCaller){
          navigate(`/feedback_form/${request?._id}`)
        }else{
          navigate(`/dashboard/home`)
        }
      }}>Complete</button>
    </div>
  </div>
);

}

export default VideoCall;
