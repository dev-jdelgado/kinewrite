import {
    ClipboardCheck,
    PencilLine,
    Timer,
    TriangleAlert,
} from "lucide-react";

import AssessmentHeader from "../components/AssessmentHeader";
import AssessmentToolbar from "../components/AssessmentToolbar";

import { useAssessment } from "../utils/AssessmentContext";

const AssessmentInstructions = () => {

    const {
        goToPage,
    } = useAssessment();

    return (

        <div
            className="
                max-w-5xl
                mx-auto
            "
        >

            <AssessmentHeader

                title="Assessment Instructions"

                subtitle="Please read the instructions carefully before starting."

            />

            <div
                className="
                    mt-8
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-10
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        mb-8
                    "
                >

                    <ClipboardCheck
                        size={42}
                        className="text-[#9b4c00]"
                    />

                    <h2
                        className="
                            text-3xl
                            font-bold
                        "
                    >
                        Before You Begin
                    </h2>

                </div>

                <div
                    className="
                        space-y-6
                    "
                >

                    <InstructionItem
                        icon={<PencilLine />}
                        title="Use the Stylus"
                        description="Use the provided stylus whenever possible for the best handwriting assessment."
                    />

                    <InstructionItem
                        icon={<Timer />}
                        title="Write Naturally"
                        description="Write comfortably using your normal handwriting style. There is no need to rush."
                    />

                    <InstructionItem
                        icon={<TriangleAlert />}
                        title="Complete All Activities"
                        description="Finish every handwriting activity before submitting the assessment."
                    />

                </div>

            </div>

            <AssessmentToolbar

                showBack={false}

                nextLabel="Start Assessment"

                onNext={() =>
                    goToPage("activity")
                }

            />

        </div>

    );

};

const InstructionItem = ({

    icon,
    title,
    description,

}) => (

    <div
        className="
            flex
            gap-5
            items-start
        "
    >

        <div
            className="
                mt-1
                text-[#9b4c00]
            "
        >
            {icon}
        </div>

        <div>

            <h3
                className="
                    text-xl
                    font-bold
                "
            >
                {title}
            </h3>

            <p
                className="
                    mt-2
                    text-slate-600
                "
            >
                {description}
            </p>

        </div>

    </div>

);

export default AssessmentInstructions;