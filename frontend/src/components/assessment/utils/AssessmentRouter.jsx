import { useAssessment } from "./AssessmentContext";

import AssessmentInstructions from "../pages/AssessmentInstructions";
import AssessmentActivity from "../pages/AssessmentActivity";
import SystemAnalysis from "../pages/SystemAnalysis";
import AssessmentResults from "../pages/AssessmentResults";
import TherapistRemarks from "../pages/TherapistRemarks";
import CompleteAssessment from "../pages/CompleteAssessment";
import GenerateExercisePlan from "../pages/GenerateExercisePlan";

const AssessmentRouter = () => {

    const {

        currentPage,

    } = useAssessment();

    switch (currentPage) {

        case "instructions":

            return <AssessmentInstructions />;

        case "activity":

            return <AssessmentActivity />;

        case "analysis":

            return <SystemAnalysis />;

        case "results":

            return <AssessmentResults />;

        case "remarks":

            return <TherapistRemarks />;

        case "complete":

            return <CompleteAssessment />;

        case "exercise-plan":

            return <GenerateExercisePlan />;

        default:

            return <AssessmentInstructions />;

    }

};

export default AssessmentRouter;