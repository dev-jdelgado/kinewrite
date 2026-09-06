import { useTheme } from "../../../contexts/ThemeContext";

import BlueLogin from "../../../assets/login/Lightbg.png";
import BgLoginDark from "../../../assets/login/Darkmodemoon1.png";

const AssessmentLayout = ({ children }) => {

    const { darkMode } = useTheme();

    return (

        <div
            className="
                relative
                min-h-screen
                bg-cover
                bg-center
                bg-no-repeat
                flex
                flex-col
                justify-center
                transition-all
                duration-500
            "
            style={{
                backgroundImage: `url(${darkMode ? BgLoginDark : BlueLogin})`,
            }}
        >

            <div
                className="
                    mx-auto
                    w-full
                "
            >

                {children}

            </div>

        </div>

    );

};

export default AssessmentLayout;