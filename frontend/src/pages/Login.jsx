import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { FaPenNib, FaUser, FaLock } from "react-icons/fa";

import AuthLayout from "../layouts/AuthLayout";

import PageHeader from "../components/common/PageHeader";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { useAuth } from "../contexts/AuthContext";
import KinewriteLogo from "../assets/logo.png";
import Balloon from "../assets/login/Balloonlogin.png";
import Sun from '../assets/login/Sunlogin.png';
import Star from '../assets/login/star.png';
import Star1 from '../assets/login/star1.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.username.trim()) {
            toast.error("Please enter your username.");
            return;
        }

        if (!credentials.password.trim()) {
            toast.error("Please enter your password.");
            return;
        }
        setLoading(true);

        console.log("Before login");

        const result = await login(credentials);

        console.log("After login");
        console.log(result);
        
        setLoading(false);

        if (result.success) {
            toast.success("Welcome back!");
            navigate("/dashboard");
            return;
        }
        toast.error(result.message);
    };

    return (
            <AuthLayout>
                <img src={Sun} alt="Sun" className="hidden lg:block absolute w-60 top-10 left-20 animate-spin-slow"/>
                <img src={Star} alt="Sun" className="hidden lg:block absolute w-20 top-20 right-70 animate-spin-slow"/>
                <img src={Star1} alt="Sun" className="hidden lg:block absolute w-20 bottom-60 left-20 animate-spin-slow"/>
                <img src={Balloon} alt="Balloon" className="hidden lg:block absolute w-60 top-30 right-1 animate-swing"/>
                <img src={KinewriteLogo} alt="Kinewritelogo" className="absolute max-w-70 xl:top-20 lg:top-10 md:top-10 top-5" />
                
                <div className="bg-white rounded-3xl shadow-xl p-10 w-full">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            label="Username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            icon={<FaUser />}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            icon={<FaLock />}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </AuthLayout>
    );
};

export default Login;   