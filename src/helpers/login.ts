import api from "@/api";
// import { redirect } from "next/navigation";

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post("/api/client/login", { email, password });
    if (response.status === 200) {
      console.log("Login successful:", response.data);
      // redirect('/'); // Redirecting to the root page
      return true; // Indicating success
    } else {
      console.log("Login failed:", response.data);
      return false; // Indicating failure
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
    return false; // Indicating failure on error
  }
};

export default login;
