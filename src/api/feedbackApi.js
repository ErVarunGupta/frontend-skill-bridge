
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

export const updateRating = async({helperId, feedback}) =>{
    try {
        console.log(helperId, feedback);
        const url = `${API_URL}/update_ratings/${helperId}`

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                rating: feedback?.rating,
                comment: feedback?.comment
            })
        })

        const result = await response.json();
        const {message, success} = result;
        if(success){
            alert(message)
            console.log(result);
        }

    } catch (error) {
        console.log("Error during feedback: ", error.message);
    }
}