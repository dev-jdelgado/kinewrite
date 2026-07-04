import PageContainer from "../components/common/PageContainer";
import DashboardLayout from "./DashboardLayout";

const AuthLayout = ({ children }) => {
    return (
        <div className="bg-[#FDE6C7]">
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