import React, { useContext } from 'react'
import './Dashboard.css'
import { MyContext } from '../../MyContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";


function HelpForm() {
    const {description, setDescription, title, setTitle} = useContext(MyContext);

    const handleRequestPost = async () => {
    const url = `${API_URL}/create_request`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      
      const result = await response.json();
      // console.log(result);
      const { success, message } = result;
      if(success){
        setDescription("")
        setTitle("")
        alert("Request post successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error during post request: ", error.message);
    }
  };
  return (
    <div className='HelpForm'>
        <p style={{fontSize: '1.3rem', fontWeight:'600'}}>Post Request</p>
          <div className="request_input_form">
            <div className="title_button">
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
              />
              <button onClick={handleRequestPost}>Submit</button>
            </div>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="description_area"
              name=""
              id=""
              placeholder="Description"
            ></textarea>
          </div>
    </div>
  )
}

export default HelpForm