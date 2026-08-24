const makeItems = (values) =>
    values.map((text, index) => ({
        itemNo: index + 1,
        promptText: text,
    }));


const exerciseData = [

    // =====================================================
    // SPACING ACTIVITIES
    // =====================================================

    {
        id: "spacing-copy-word",
        category: "spacing",
        title: "Copy the Word",
        description:
            "Copy each word while keeping equal spacing between letters.",
        activityType: "word",
        mode: "copy-word",
        themeColor: "#3A8DDE",
        items: makeItems([
            "CAT",
            "DOG",
            "SUN",
            "BOOK",
            "TREE",
            "FISH",
            "HOUSE",
            "SCHOOL",
            "FLOWER",
            "FRIEND",
        ]),
    },

    {
        id: "spacing-copy-phrase",
        category: "spacing",
        title: "Copy the Phrase",
        description:
            "Copy each phrase while keeping consistent spacing between words.",
        activityType: "word",
        mode: "copy-phrase",
        themeColor: "#3A8DDE",
        items: makeItems([
            "I AM HAPPY.",
            "I LIKE CATS.",
            "THE SUN IS HOT.",
            "I LOVE MY FAMILY.",
            "THE DOG IS RUNNING.",
            "SHE HAS A BOOK.",
            "WE GO TO SCHOOL.",
            "THE BOY IS PLAYING.",
            "I LIKE TO DRAW.",
            "MY FRIEND IS KIND.",
        ]),
    },

    {
        id: "spacing-complete-sentence",
        category: "spacing",
        title: "Complete the Sentence",
        description:
            "Complete the sentence while maintaining consistent letter and word spacing.",
        activityType: "word",
        mode: "complete-sentence",
        themeColor: "#3A8DDE",
        items: makeItems([
            "I LIKE ______.",
        ]),
    },

    {
        id: "spacing-copy-sentence",
        category: "spacing",
        title: "Copy the Sentence",
        description:
            "Copy the sentence while maintaining consistent spacing from beginning to end.",
        activityType: "word",
        mode: "copy-sentence",
        themeColor: "#3A8DDE",
        items: makeItems([
            "THE CAT IS SLEEPING.",
            "THE DOG IS RUNNING.",
            "I HAVE A BLUE BAG.",
            "SHE LIKES TO READ BOOKS.",
            "WE ARE GOING TO SCHOOL.",
            "MY MOTHER COOKS GOOD FOOD.",
            "THE CHILDREN ARE PLAYING OUTSIDE.",
            "I ENJOY DRAWING PICTURES.",
            "THE LITTLE BOY IS EATING LUNCH.",
            "MY FRIENDS AND I PLAY TOGETHER.",
        ]),
    },

    {
        id: "spacing-challenge",
        category: "spacing",
        title: "Spacing Challenge",
        description:
            "Rewrite the sentence with the correct spacing between words.",
        activityType: "word",
        mode: "spacing-challenge",
        themeColor: "#3A8DDE",
        items: makeItems([
            "THECATISSLEEPING",
            "ILIKETODRAW",
            "THEBOYISRANING",
            "SHEHASAREDBAG",
            "WEAREGOINGTOSCHOOL",
            "MYFRIENDISVERYKIND",
            "THEDOGISPLAYINGOUTSIDE",
            "ILIKETOEATICECREAM",
            "THECHILDRENAREPLAYING",
            "IWANTTOLEARNNEWWORDS",
        ]),
    },


    // =====================================================
    // ALIGNMENT ACTIVITIES
    // =====================================================

    {
        id: "alignment-write-line",
        category: "alignment",
        title: "Write on the Line",
        description:
            "Write the word directly on the writing line.",
        activityType: "word",
        mode: "write-line",
        themeColor: "#F59E0B",
        items: makeItems([
            "CAT",
            "DOG",
            "SUN",
            "BOOK",
            "TREE",
            "FISH",
            "BALL",
            "HOUSE",
            "SCHOOL",
            "FLOWER",
        ]),
    },

    {
        id: "alignment-follow-line",
        category: "alignment",
        title: "Follow the Writing Line",
        description:
            "Write each word while keeping your writing aligned with the guide.",
        activityType: "word",
        mode: "follow-line",
        themeColor: "#F59E0B",
        items: makeItems([
            "APPLE",
            "ORANGE",
            "BANANA",
            "WINDOW",
            "GARDEN",
            "FAMILY",
            "FRIEND",
            "TEACHER",
            "COMPUTER",
            "PLAYGROUND",
        ]),
    },

    {
        id: "alignment-copy-sentence",
        category: "alignment",
        title: "Copy Sentences on Ruled Lines",
        description:
            "Copy the sentence while keeping your writing aligned with the line.",
        activityType: "word",
        mode: "ruled-sentence",
        themeColor: "#F59E0B",
        items: makeItems([
            "THE CAT IS SLEEPING.",
            "THE DOG IS RUNNING.",
            "I LIKE TO READ BOOKS.",
            "SHE IS MY BEST FRIEND.",
            "WE GO TO SCHOOL EVERY DAY.",
            "MY FAVORITE COLOR IS BLUE.",
            "THE CHILDREN ARE PLAYING OUTSIDE.",
            "I ENJOY DRAWING PICTURES.",
            "MY FAMILY EATS DINNER TOGETHER.",
            "WE LEARN SOMETHING NEW EVERY DAY.",
        ]),
    },

    {
        id: "alignment-stay-box",
        category: "alignment",
        title: "Stay Inside the Box",
        description:
            "Write the target word while keeping your writing inside the writing area.",
        activityType: "word",
        mode: "stay-box",
        themeColor: "#F59E0B",
        items: makeItems([
            "CAT",
            "HOUSE",
            "SCHOOL",
            "FRIEND",
            "FLOWER",
            "FAMILY",
            "ANIMAL",
            "COMPUTER",
            "TEACHER",
            "PLAYGROUND",
        ]),
    },

    {
        id: "alignment-path",
        category: "alignment",
        title: "Alignment Path",
        description:
            "Follow the writing path while keeping your writing aligned.",
        activityType: "word",
        mode: "alignment-path",
        themeColor: "#F59E0B",
        items: makeItems([
            "CAT",
            "DOG",
            "TREE",
            "BOOK",
            "FLOWER",
            "HOUSE",
            "SCHOOL",
            "FAMILY",
            "FRIEND",
            "COMPUTER",
        ]),
    },


    // =====================================================
    // STROKE ACTIVITIES
    // =====================================================

    {
        id: "stroke-trace-lines",
        category: "stroke",
        title: "Trace the Lines",
        description:
            "Trace each line carefully while following the guide.",
        activityType: "stroke",
        mode: "trace-line",
        themeColor: "#22C55E",
        items: makeItems([
            "Horizontal",
            "Vertical",
            "Diagonal",
            "Diagonal",
            "Zigzag",
            "Wave",
            "Curves",
            "Circle",
            "Square",
            "Triangle",
        ]),
    },

    {
        id: "stroke-trace-shapes",
        category: "stroke",
        title: "Trace the Shapes",
        description:
            "Trace each shape carefully while staying on the guide.",
        activityType: "stroke",
        mode: "trace-shape",
        themeColor: "#22C55E",
        items: makeItems([
            "Circle",
            "Square",
            "Triangle",
            "Rectangle",
            "Oval",
            "Star",
            "Heart",
            "Diamond",
            "Semicircle",
            "Spiral",
        ]),
    },

    {
        id: "stroke-trace-letters",
        category: "stroke",
        title: "Trace the Letters",
        description:
            "Trace each letter while following the correct stroke path.",
        activityType: "stroke",
        mode: "trace-letter",
        themeColor: "#22C55E",
        items: makeItems([
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
        ]),
    },

    {
        id: "stroke-write-letter",
        category: "stroke",
        title: "Write the Letter",
        description:
            "Look at the model and write the letter independently.",
        activityType: "letter",
        mode: "write-letter",
        themeColor: "#22C55E",
        items: makeItems([
            "A",
            "B",
            "C",
            "D",
            "E",
            "M",
            "N",
            "R",
            "S",
            "W",
        ]),
    },

    {
        id: "stroke-challenge",
        category: "stroke",
        title: "Stroke Challenge",
        description:
            "Write each word independently using controlled strokes.",
        activityType: "word",
        mode: "stroke-challenge",
        themeColor: "#22C55E",
        items: makeItems([
            "CAT",
            "DOG",
            "SUN",
            "TREE",
            "BOOK",
            "FISH",
            "HOUSE",
            "SCHOOL",
            "FRIEND",
            "COMPUTER",
        ]),
    },

];


export default exerciseData;