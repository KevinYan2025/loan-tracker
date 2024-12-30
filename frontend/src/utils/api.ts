import apiClient from "../configs/axiosConfig";
export const createUser = async (uid: string, email: string) => {
    const response = await apiClient.post("/users", { uid, email });
    return response.data;
}