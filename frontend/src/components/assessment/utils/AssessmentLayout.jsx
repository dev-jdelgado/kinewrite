import SkyBackground from "../../../assets/assessment/sky-background.png";

const AssessmentLayout = ({ children }) => {

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
            "
            style={{
                backgroundImage:
                    `url(${SkyBackground})`,
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