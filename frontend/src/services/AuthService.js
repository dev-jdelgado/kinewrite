import api from "../api/axios";

const login = (credentials) => {
    return api.post("/auth/login", credentials);
};

const AuthService = {
    login,
};

export default AuthService;