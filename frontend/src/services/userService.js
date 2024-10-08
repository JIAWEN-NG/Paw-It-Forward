import axiosInstance from "../utils/axiosInstance";
// import { getAuth } from "firebase/auth";

//const auth = getAuth(); // Firebase authentication instance
// const cloudURL = "";
const localURL = "http://localhost:8000";
// const finalURL = cloudURL;

async function getAllUsers() {
    try {
      // Check if the user is authenticated
    //   const user = auth.currentUser;
    //   if (!user) {
    //     throw new Error("User not authenticated.");
    //   }
  
      // Make a GET request to the backend API using axiosInstance
      const response = await axiosInstance({
        method: "get",
        url: `${localURL}/api/users`, // API endpoint for fetching all users
      });
  
      // Return the data from the response
      return response.data;
    } catch (error) {
      // Throw a descriptive error if the request fails
      throw new Error(`Failed to fetch all users: ${error.message}`);
    }
  }
  
  // Export the function for use in other parts of the application
  export { getAllUsers };