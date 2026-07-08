import DashboardLayout from "../layouts/DashboardLayout";

import PageContainer from "../components/common/PageContainer";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BackButton from "../components/common/BackButton";


const Settings = () => {

    return (

        <DashboardLayout>
            <DashboardHeader />

            <PageContainer>
                <BackButton />

            </PageContainer>
        </DashboardLayout>
    );
};

export default Settings;