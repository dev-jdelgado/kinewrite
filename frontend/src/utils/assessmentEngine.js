// ========================================
// Calculate Overall Assessment Score
// ========================================

export const calculateOverallScore = ({
    visualMotor = 0,
    fineMotor = 0,
    letterFormation = 0,
}) => {

    const total =
        Number(visualMotor) +
        Number(fineMotor) +
        Number(letterFormation);

    return Math.round(total / 3);

};

// ========================================
// Determine Classification
// ========================================

export const determineClassification = (
    score
) => {

    if (score >= 90) {
        return "Very Mild";
    }
    if (score >= 80) {
        return "Mild";
    }
    if (score >= 70) {
        return "Moderate";
    }
    if (score >= 60) {
        return "Severe";
    }
    return "Very Severe";

};

// ========================================
// Determine Recommended Therapy Level
// ========================================

export const determineRecommendedLevel = (
    score
) => {

    if (score >= 90) {
        return 5;
    }
    if (score >= 80) {
        return 4;
    }
    if (score >= 70) {
        return 3;
    }
    if (score >= 60) {
        return 2;
    }

    return 1;

};

// ========================================
// Generate Assessment Result
// ========================================

export const generateAssessmentResult = (
    scores
) => {

    const overallScore =
        calculateOverallScore(scores);

    const classification =
        determineClassification(
            overallScore
        );

    const recommendedLevel =
        determineRecommendedLevel(
            overallScore
        );

    return {
        overallScore,
        classification,
        recommendedLevel,
    };

};