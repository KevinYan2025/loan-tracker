import axios from "axios";
import {auth} from './firebaseConfig';
const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
})

apiClient.interceptors.request.use(
    async (config) => {
      // Retrieve the ID token from your authentication provider
      const idToken = await auth.currentUser?.getIdToken() // Replace with your method to get the ID token
  
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  export default apiClient;