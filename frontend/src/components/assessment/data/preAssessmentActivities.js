const preAssessmentActivities = [

    // ==========================================
    // ALIGNMENT
    // ==========================================

    {
        id: 1,
        category: "alignment",
        activityName: "Letters A and a",
        activityType: "letter",
        title: "ALIGNMENT",
        instruction:
            "Trace and copy the letters while keeping them aligned on the guide.",
        promptText: "A a",
        promptType: "Letter",
        illustration: "apple",
        reward: "star",
        themeColor: "#F59E0B",
    },

    {
        id: 2,
        category: "alignment",
        activityName: "Letters B and b",
        activityType: "letter",
        title: "ALIGNMENT",
        instruction:
            "Trace and copy the letters while keeping them aligned on the guide.",
        promptText: "B b",
        promptType: "Letter",
        illustration: "basketball",
        reward: "star",
        themeColor: "#F59E0B",
    },

    {
        id: 3,
        category: "alignment",
        activityName: "Letters C and c",
        activityType: "letter",
        title: "ALIGNMENT",
        instruction:
            "Trace and copy the letters while keeping them aligned on the guide.",
        promptText: "C c",
        promptType: "Letter",
        illustration: "cap",
        reward: "star",
        themeColor: "#F59E0B",
    },

    {
        id: 4,
        category: "alignment",
        activityName: "Letters D and d",
        activityType: "letter",
        title: "ALIGNMENT",
        instruction:
            "Trace and copy the letters while keeping them aligned on the guide.",
        promptText: "D d",
        promptType: "Letter",
        illustration: "donut",
        reward: "star",
        themeColor: "#F59E0B",
    },

    {
        id: 5,
        category: "alignment",
        activityName: "Letters E and e",
        activityType: "letter",
        title: "ALIGNMENT",
        instruction:
            "Trace and copy the letters while keeping them aligned on the guide.",
        promptText: "E e",
        promptType: "Letter",
        illustration: "egg",
        reward: "star",
        themeColor: "#F59E0B",
    },

    // ==========================================
    // SPACING
    // ==========================================

    ...[
        ["CAT", "cat"],
        ["DOG", "dog"],
        ["PEN", "pen"],
        ["SUN", "sun"],
        ["BOOK", "books"],
    ].map((x, i) => ({

        id: i + 6,

        category: "spacing",

        activityName: x[0],

        activityType: "word",

        title: "SPACING",

        instruction:
            "Trace and copy the word while maintaining even spacing between letters.",

        promptText: x[0],

        promptType: "Word",

        illustration: x[1],

        reward: "star",

        themeColor: "#3A8DDE",

    })),

    // ==========================================
    // STROKES
    // ==========================================

    ...[
        "Horizontal",
        "Vertical",
        "Diagonal",
        "Zigzag",
        "Wave",
        "Circle",
        "Curves",
    ].map((name, i) => ({

        id: i + 11,

        category: "stroke",

        activityName: name,

        activityType: "stroke",

        title: "STROKE",

        instruction:
            "Trace and copy the stroke pattern as accurately as possible.",

        promptText: name,

        promptType: "Stroke",

        illustration: name.toLowerCase(),

        reward: "star",

        themeColor: "#22C55E",

    })),

];

export default preAssessmentActivities;