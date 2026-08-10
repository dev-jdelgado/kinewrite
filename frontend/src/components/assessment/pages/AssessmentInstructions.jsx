import {
    ClipboardCheck,
    PencilLine,
    Timer,
    TriangleAlert,
    Layers3,
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
                lg:0 sm:px-10 px-6
            "
        >

            <AssessmentHeader

                title="Assessment Instructions"

                subtitle="Please read the instructions carefully before starting your handwriting assessment."

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
                        description="Use the provided stylus whenever possible for the most accurate handwriting assessment."
                    />

                    <InstructionItem
                        icon={<Timer />}
                        title="Write Naturally"
                        description="Write comfortably using your normal handwriting style. Focus on neatness rather than speed."
                    />

                    <InstructionItem
                        icon={<Layers3 />}
                        title="Complete All 17 Activities"
                        description="The assessment contains 17 handwriting activities divided into Alignment, Spacing, and Stroke exercises. Complete each activity before proceeding."
                    />

                    <InstructionItem
                        icon={<TriangleAlert />}
                        title="Do Your Best"
                        description="There are no right or wrong answers. Simply complete each activity to the best of your ability."
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