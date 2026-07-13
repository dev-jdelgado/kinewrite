// ======================================================
// TherapyRecommendation
// Generates the student's initial therapy plan
// based on the handwriting assessment.
// ======================================================

const TherapyRecommendation = {

    generate(classification) {

        switch (classification.severity) {

            case "No Significant Indicators":

                return {
                    exerciseLevel: 1,
                    sessionDuration: 10,
                    weeklyFrequency: 2,

                    focusAreas: [
                        "Handwriting Maintenance",
                        "Letter Consistency",
                    ],

                    recommendation:
                        "The student demonstrates age-appropriate handwriting skills. Light maintenance exercises are recommended.",
                };

            case "Mild Dysgraphia":

                return {
                    exerciseLevel: 2,
                    sessionDuration: 15,
                    weeklyFrequency: 3,

                    focusAreas: [
                        "Letter Formation",
                        "Spacing",
                        "Stroke Consistency",
                    ],

                    recommendation:
                        "Introduce structured handwriting activities that reinforce correct letter formation and spacing.",
                };

            case "Moderate Dysgraphia":

                return {
                    exerciseLevel: 3,
                    sessionDuration: 20,
                    weeklyFrequency: 4,

                    focusAreas: [
                        "Fine Motor Control",
                        "Stroke Control",
                        "Letter Formation",
                        "Writing Rhythm",
                    ],

                    recommendation:
                        "Provide guided handwriting practice emphasizing motor coordination and writing consistency.",
                };

            case "Severe Dysgraphia":

                return {

                    exerciseLevel: 4,
                    sessionDuration: 25,
                    weeklyFrequency: 5,

                    focusAreas: [
                        "Grip Control",
                        "Tracing",
                        "Motor Planning",
                        "Visual-Motor Integration",
                        "Letter Formation",
                    ],

                    recommendation:
                        "Begin with foundational motor activities before progressing to structured handwriting exercises.",
                };

            default:

                return {
                    exerciseLevel: 1,
                    sessionDuration: 10,
                    weeklyFrequency: 2,

                    focusAreas: [
                        "General Handwriting Practice",
                    ],

                    recommendation:
                        "No recommendation available.",
                };
        }
    },
};

export default TherapyRecommendation;