import {
    useEffect,
    useState,
} from "react";

import {
    LoaderCircle,
    CheckCircle2,
} from "lucide-react";

import AssessmentService from "../../../services/AssessmentService";

import {
    useAssessment,
} from "../utils/AssessmentContext";

const steps = [

    "Collecting handwriting samples...",

    "Analyzing spacing...",

    "Analyzing alignment...",

    "Analyzing stroke quality...",

    "Generating assessment...",

    "Preparing results..."

];

const SystemAnalysis = () => {

    const {

        assessmentId,

        setAnalysis,

        goToPage,

    } = useAssessment();

    const [

        currentStep,

        setCurrentStep,

    ] = useState(0);

    useEffect(() => {

        let cancelled = false;

        const analyze = async () => {

            try {

                // --------------------------------------
                // Fake progress while backend analyzes
                // --------------------------------------

                for (

                    let i = 0;

                    i < steps.length;

                    i++

                ) {

                    if (cancelled) {

                        return;

                    }

                    setCurrentStep(i);

                    await new Promise(resolve =>

                        setTimeout(resolve, 700)

                    );

                }

                // --------------------------------------
                // Backend Analysis
                // --------------------------------------

                const response =

                    await AssessmentService.analyzeAssessment(

                        assessmentId

                    );

                if (

                    !response.success

                ) {

                    throw new Error(

                        response.message

                    );

                }

                setAnalysis(

                    response.data

                );

                goToPage(

                    "results"

                );

            }

            catch (error) {

                console.error(

                    error

                );

            }

        };

        analyze();

        return () => {

            cancelled = true;

        };

    }, []);

    return (

        <div
            className="
                min-h-screen

                flex
                flex-col

                justify-center
                items-center

                text-center

                px-6
            "
        >

            <LoaderCircle

                className="
                    animate-spin

                    text-sky-500

                    mb-10
                "

                size={90}

            />

            <h1
                className="
                    text-5xl
                    font-black
                    mb-10
                "
            >

                System Analysis

            </h1>

            <div
                className="
                    space-y-5
                    w-full
                    max-w-xl
                "
            >

                {

                    steps.map(

                        (

                            step,

                            index

                        ) => (

                            <div

                                key={step}

                                className="
                                    flex
                                    items-center
                                    gap-5

                                    bg-white

                                    rounded-2xl

                                    shadow-md

                                    p-5
                                "
                            >

                                {

                                    index <= currentStep

                                        ? (

                                            <CheckCircle2

                                                className="

                                                    text-green-500

                                                "

                                                size={28}

                                            />

                                        )

                                        : (

                                            <LoaderCircle

                                                className="

                                                    animate-spin

                                                    text-slate-400

                                                "

                                                size={24}

                                            />

                                        )

                                }

                                <span
                                    className="
                                        text-lg
                                        font-semibold
                                    "
                                >

                                    {step}

                                </span>

                            </div>

                        )

                    )

                }

            </div>

        </div>

    );

};

export default SystemAnalysis;