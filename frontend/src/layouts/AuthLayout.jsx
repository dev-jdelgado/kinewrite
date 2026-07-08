import PageContainer from "../components/common/PageContainer";
import DashboardLayout from "./DashboardLayout";
import BgLogin from '../assets/login/Loginbg.png'

const AuthLayout = ({ children }) => {
    return (
        <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat" 
        style={{backgroundImage: `url(${BgLogin})`}}>
            <PageContainer
                maxWidth="xl"
                className="flex items-center justify-center min-h-screen"
            >
                {children}
            </PageContainer>
        </div>
    );
};

export default AuthLayout;