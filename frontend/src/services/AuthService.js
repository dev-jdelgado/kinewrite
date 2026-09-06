import api from "../api/axios";

const login = (credentials) => {
    return api.post("/auth/login", credentials);
};

const signup = (signupData) => {
    return api.post("/auth/signup", signupData);
};

// Send Signup OTP
const sendSignupOtp = (email) => {
    return api.post("/auth/send-signup-otp", {
        email,
    });
};

// Verify Signup OTP
const verifySignupOtp = (email, otp) => {
    return api.post("/auth/verify-signup-otp", {
        email,
        otp,
    });
};

const AuthService = {
    login,
    signup,
    sendSignupOtp,
    verifySignupOtp,
};

export default AuthService;