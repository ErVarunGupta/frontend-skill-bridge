import { useContext, useEffect, useState } from "react";
import { MyContext } from "../MyContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getUsersProfile =  () => {
  const { users, setUsers } = useContext(MyContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = `${API_URL}/users`;
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
          setUsers(result.users || []);
        }
      } catch (error) {
        console.log("Error during fetching users profile: ", error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]);

  return { users, loading };
};

export const getUserProfile = (userId) => {
  const { userProfile, setUserProfile } = useContext(MyContext);
  const fetchUser = async () => {
    try {
      const url = `${API_URL}/my_profile/${userId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      //   console.log(result.user);

      const { success, message } = result;
      if (success) {
        setUserProfile(result);
      }
    } catch (error) {
      console.log("Error during fetching user profile: ", error.message);
    }
  };

  if (userId) {
    useEffect(() => {
      fetchUser();
    }, []);
  }

  return { userProfile };
};

export const uploadProfilePicture = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const url = `${API_URL}/upload_profile_picture`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: formData,
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.log("Error during profile picture upload: ", error.message);
  }
};
