//module imports
import axios from "axios";

var backendUrl = "https://essential-training-app-api.herokuapp.com/api/";
 

//Calls the end-point to get the data from the backend.
export const authentication_message = (message) => {
  if (message == false) {
    return ("Oopsies!")
  }
  else {
    return ("SUCCESS!!!")
  }
}


//Calls the end-point to get the data from the backend.
export const get_quizzes = (student_hash, callback) => {
  return axios
    .get(backendUrl+ "quizzes/student/"+student_hash+"/?format=json", {
      headers: { 
        "Content-Type": "application/json" 
      } //Let backend know that the data is JSON object.
    })
    .then(getResponse => { 
      callback(getResponse.data);}) //Return data if the function call was successful.
    .catch(error => {
    });
}



//Calls the end-point to get the data from the backend.
export const login = (hash) => {
  return axios
    .get("https://essential-training-app-api.herokuapp.com/api/quizzes/student/" + hash + "/?format=json", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response.data) //Return data if the function call was successful.
    }).catch(error => {
    });
};
