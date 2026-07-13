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
import SunRays from '../assets/login/sun-rays.png';
import SunCenter from '../assets/login/sun-center.png';
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
                <div className="absolute md:w-60 w-36 top-10 sm:left-20 left-2">
                    <img
                        src={SunRays}
                        alt="Sun Rays"
                        className="absolute top-2 -left-[3px] inset-0 w-full animate-spin-slow"
                    />

                    <img
                        src={SunCenter}
                        alt="Sun"
                        className="relative w-full"
                    />
                </div>
                <img src={Star} alt="Sun" className="absolute w-20 md:top-20 top-12 sm:right-70 right-[25%] animate-spin-slow"/>
                <img src={Star1} alt="Sun" className="absolute w-20 md:bottom-60 bottom-36 sm:left-20 left-12 animate-spin-slow"/>
                <img src={Balloon} alt="Balloon" className="absolute md:w-60 w-32 top-30 right-1 animate-swing"/>
                
                <div className="bg-white rounded-3xl shadow-xl w-full relative sm:px-12 px-6 py-10">
                    <img src={KinewriteLogo} alt="Kinewritelogo" className="absolute sm:max-w-70 max-w-[60%] sm:bottom-72 bottom-[295px] sm:left-[23%] left-[17.6vw]" />
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