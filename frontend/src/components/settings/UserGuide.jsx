import { useState } from "react";
import LoginImage from "../../assets/userguide/Login.png";
import SigninImage from "../../assets/userguide/Signin.png";
import DashboardImage from "../../assets/userguide/Dashboard.png";

import ActImage from "../../assets/userguide/Act.png";
import StartExercisesImage from "../../assets/userguide/StartExercises.png";

import ResultImage from "../../assets/userguide/Result.png";
import ReviewImage from "../../assets/userguide/Review.png";
import AnalysisImage from "../../assets/userguide/Analysis.png";

import StudentManagementImage from "../../assets/userguide/StudentManagement.png";
import StudentRecordsImage from "../../assets/userguide/StudentRecords.png";

import SettingsImage from "../../assets/userguide/Settings.png";
import GeneralSettingsImage from "../../assets/userguide/GeneralSettings.png";
import ChangePasswordImage from "../../assets/userguide/ChangePassword.png";

import AboutImage from "../../assets/userguide/About.png";
export default function UserGuide() {
    const [activeSection, setActiveSection] = useState("getting-started");

    const sections = [
        {
            id: "getting-started",
            icon: "🚀",
            title: "Getting Started",
        },
        {
            id: "typing-practice",
            icon: "⌨️",
            title: "Typing Practice",
        },
        {
            id: "exercises",
            icon: "📝",
            title: "Exercises",
        },
        {
            id: "results",
            icon: "📊",
            title: "Results & Performance",
        },
        {
            id: "settings",
            icon: "⚙️",
            title: "Settings",
        },
        {
            id: "typing-tips",
            icon: "💡",
            title: "Tips for Better Typing",
        },
        {
            id: "troubleshooting",
            icon: "🔧",
            title: "Troubleshooting",
        },
    ];

    const renderContent = () => {
        switch (activeSection) {

            case "getting-started":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Getting Started
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Learn how to access KineWrite, create an account,
                            navigate the dashboard, and start your first activity.
                        </p>


                        {/* Login */}
                        <div className="mb-10">

                            <h3 className="text-xl font-bold text-[#17365D] mb-3">
                                1. How to Log In
                            </h3>

                            <p className="text-slate-600 leading-7 mb-4">
                                To access KineWrite, users must first log in
                                using their registered account.
                            </p>

                            <div className="space-y-3">

                                <div className="flex gap-3">
                                    <span className="font-bold text-[#3B9BEF]">
                                        Step 1:
                                    </span>

                                    <p className="text-slate-600">
                                        Open the KineWrite website using a
                                        supported web browser.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <span className="font-bold text-[#3B9BEF]">
                                        Step 2:
                                    </span>

                                    <p className="text-slate-600">
                                        Enter your registered username and
                                        password.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <span className="font-bold text-[#3B9BEF]">
                                        Step 3:
                                    </span>

                                    <p className="text-slate-600">
                                        Click the <strong>Login</strong> button.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <span className="font-bold text-[#3B9BEF]">
                                        Step 4:
                                    </span>

                                    <p className="text-slate-600">
                                        After successful authentication, you
                                        will be redirected to the dashboard.
                                    </p>
                                </div>

                            </div>


                            {/* Login Image */}
                            <div className="mt-6">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                    <img
                                        src={LoginImage}
                                        alt="KineWrite Login Page"
                                        className="w-full max-w-4xl mx-auto rounded-xl"
                                    />
                                </div>

                                <p className="text-sm text-slate-500 text-center mt-3">
                                    Figure 1. KineWrite Login Page
                                </p>
                            </div>


                            {/* Tip */}
                            <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tip:</strong> Your password is
                                    case-sensitive. Make sure your username
                                    and password are entered correctly.
                                </p>
                            </div>

                        </div>


                        {/* Create Account */}
                        <div className="mb-10">

                            <h3 className="text-xl font-bold text-[#17365D] mb-3">
                                2. Creating an Account
                            </h3>

                            <p className="text-slate-600 leading-7 mb-4">
                                If you do not have an account, click
                                <strong> Create an account</strong> on the
                                Login page.
                            </p>


                            <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                School Information
                            </h4>

                            <ul className="list-disc ml-6 space-y-2 text-slate-600">
                                <li>
                                    <strong>School Name</strong> – Enter the
                                    complete name of your school.
                                </li>

                                <li>
                                    <strong>School Code</strong> – Enter the
                                    unique code assigned to your school.
                                </li>
                            </ul>


                            <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                Administrator Information
                            </h4>

                            <ul className="list-disc ml-6 space-y-2 text-slate-600">
                                <li>Full Name</li>
                                <li>Username</li>
                                <li>Email Address</li>
                                <li>Password</li>
                                <li>Confirm Password</li>
                            </ul>


                            {/* Signup Image */}
                            <div className="mt-6">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                    <img
                                        src={SigninImage}
                                        alt="KineWrite Create School Account"
                                        className="w-full max-w-4xl mx-auto rounded-xl"
                                    />
                                </div>

                                <p className="text-sm text-slate-500 text-center mt-3">
                                    Figure 2. KineWrite Create School Account Page
                                </p>
                            </div>


                            <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                Email Verification
                            </h4>

                            <p className="text-slate-600 leading-7 mb-3">
                                The email address is verified using an
                                <strong> OTP (One-Time Password)</strong>.
                            </p>

                            <ol className="list-decimal ml-6 space-y-2 text-slate-600">
                                <li>Enter your email address.</li>
                                <li>Click <strong>Send OTP</strong>.</li>
                                <li>
                                    Check your email for the verification code.
                                </li>
                                <li>Enter the OTP when prompted.</li>
                                <li>
                                    Continue with the registration process.
                                </li>
                            </ol>


                            <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                Password Requirements
                            </h4>

                            <ul className="list-disc ml-6 space-y-2 text-slate-600">
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character</li>
                            </ul>


                            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <p className="text-sm text-amber-800">
                                    ⚠️ <strong>Important:</strong> Keep your
                                    username and password secure. Never share
                                    your account credentials with other users.
                                </p>
                            </div>

                        </div>


                        {/* Dashboard */}
                        <div className="mb-10">

                            <h3 className="text-xl font-bold text-[#17365D] mb-3">
                                3. Understanding the Dashboard
                            </h3>

                            <p className="text-slate-600 leading-7 mb-4">
                                The dashboard serves as the main area for
                                accessing KineWrite's features and activities.
                                From the dashboard, users can navigate to
                                typing activities, exercises, performance
                                results, account settings, and other available
                                features.
                            </p>


                            {/* Dashboard Image */}
                            <div className="mt-6">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                    <img
                                        src={DashboardImage}
                                        alt="KineWrite Dashboard"
                                        className="w-full max-w-4xl mx-auto rounded-xl"
                                    />
                                </div>

                                <p className="text-sm text-slate-500 text-center mt-3">
                                    Figure 3. KineWrite Dashboard
                                </p>
                            </div>

                        </div>


                        {/* Starting Activity */}
                        <div>

                            <h3 className="text-xl font-bold text-[#17365D] mb-3">
                                4. Starting an Activity
                            </h3>

                            <p className="text-slate-600 leading-7 mb-4">
                                KineWrite provides activities that allow users
                                to practice typing and improve their skills.
                                Activities can be accessed from the dashboard.
                            </p>

                            <ol className="list-decimal ml-6 space-y-2 text-slate-600">
                                <li>
                                    Log in to your KineWrite account.
                                </li>

                                <li>
                                    Locate the available activity.
                                </li>

                                <li>
                                    Select the activity you want to complete.
                                </li>

                                <li>
                                    Read the instructions carefully.
                                </li>

                                <li>
                                    Click the appropriate Start button.
                                </li>

                                <li>
                                    Complete the activity according to the
                                    instructions.
                                </li>
                            </ol>


                            {/* Activity Image */}
                            <div className="mt-6">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                    <img
                                        src={ActImage}
                                        alt="KineWrite Activities"
                                        className="w-full max-w-4xl mx-auto rounded-xl"
                                    />
                                </div>

                                <p className="text-sm text-slate-500 text-center mt-3">
                                    Figure 4. KineWrite Activity Selection
                                </p>
                            </div>


                            {/* Tip */}
                            <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tip:</strong> Always read the
                                    instructions before starting an activity.
                                </p>
                            </div>

                        </div>

                    </section>
                );

            case "typing-practice":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Typing Practice
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Learn how to complete typing practice activities
                            and understand your typing performance.
                        </p>


                        {/* 1. How to Begin Typing Practice */}
                        <GuideBlock
                            title="1. How to Begin Typing Practice"
                            content={
                                <>
                                    <p>
                                        Typing practice allows you to improve
                                        your typing speed and accuracy through
                                        guided activities.
                                    </p>

                                    <ol className="list-decimal ml-6 mt-4 space-y-2">
                                        <li>
                                            Open the <strong>Typing Practice </strong>
                                            activity.
                                        </li>

                                        <li>
                                            Read the instructions provided before
                                            beginning the activity.
                                        </li>

                                        <li>
                                            Position your hands comfortably on
                                            the keyboard.
                                        </li>

                                        <li>
                                            Click the appropriate
                                            <strong> Start </strong>
                                            button to begin.
                                        </li>

                                        <li>
                                            Start typing when the activity begins.
                                        </li>

                                        <li>
                                            Continue typing until the activity
                                            is completed.
                                        </li>
                                    </ol>


                                    {/* Typing Practice Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={StartExercisesImage}
                                                alt="KineWrite Typing Practice"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 5. KineWrite Typing Practice Activity
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Do not rush when
                                            starting. Focus on typing correctly before
                                            trying to increase your speed.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 2. How to Follow the Displayed Text */}
                        <GuideBlock
                            title="2. How to Follow the Displayed Text"
                            content={
                                <>
                                    <p>
                                        During typing practice, text or words
                                        will be displayed on the screen. Your
                                        task is to type the displayed text as
                                        accurately as possible.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>
                                            Type the text exactly as displayed.
                                        </li>

                                        <li>
                                            Pay attention to spelling.
                                        </li>

                                        <li>
                                            Observe capitalization.
                                        </li>

                                        <li>
                                            Use the correct punctuation.
                                        </li>

                                        <li>
                                            Avoid unnecessary spaces.
                                        </li>

                                        <li>
                                            Try to maintain a consistent typing
                                            rhythm.
                                        </li>
                                    </ul>


                                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-sm text-amber-800">
                                            ⚠️ <strong>Important:</strong> Incorrect
                                            characters may affect your accuracy score.
                                            Carefully follow the text displayed on
                                            the screen.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 3. How Speed and Accuracy Are Measured */}
                        <GuideBlock
                            title="3. How Speed and Accuracy Are Measured"
                            content={
                                <>
                                    <p>
                                        KineWrite evaluates typing performance
                                        using typing metrics such as speed and
                                        accuracy.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4 mt-5">

                                        <InfoCard
                                            icon="⚡"
                                            title="Typing Speed"
                                            text="Typing speed measures how quickly you can type and is commonly represented as Words Per Minute (WPM)."
                                        />

                                        <InfoCard
                                            icon="🎯"
                                            title="Accuracy"
                                            text="Accuracy measures how correctly you typed the required text and reflects the number of errors made."
                                        />

                                    </div>


                                    {/* Measurement Explanation */}
                                    <div className="mt-6 grid md:grid-cols-2 gap-4">

                                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                                            <h4 className="font-bold text-[#17365D] mb-2">
                                                WPM
                                            </h4>

                                            <p className="text-sm text-slate-600 leading-6">
                                                WPM stands for <strong>Words Per Minute</strong>.
                                                It indicates approximately how many words
                                                you can type within one minute.
                                            </p>
                                        </div>

                                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                                            <h4 className="font-bold text-[#17365D] mb-2">
                                                Accuracy Percentage
                                            </h4>

                                            <p className="text-sm text-slate-600 leading-6">
                                                Accuracy is expressed as a percentage
                                                and indicates how much of the required
                                                text was typed correctly.
                                            </p>
                                        </div>

                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> A good typing
                                            performance should balance both speed
                                            and accuracy. Increasing speed is not
                                            helpful if accuracy decreases significantly.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                    </section>
                );

            case "exercises":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Exercises
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Learn how to select, answer, and submit KineWrite
                            exercises.
                        </p>


                        {/* 1. How to Select an Exercise */}
                        <GuideBlock
                            title="1. How to Select an Exercise"
                            content={
                                <>
                                    <p className="mb-4">
                                        KineWrite provides different exercises that
                                        allow users to practice their knowledge and
                                        skills. Select an available exercise based
                                        on the activity assigned to you.
                                    </p>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Open the <strong>Exercises</strong> section.
                                        </li>

                                        <li>
                                            Review the available activities.
                                        </li>

                                        <li>
                                            Select the exercise you want to complete.
                                        </li>

                                        <li>
                                            Read the instructions carefully.
                                        </li>

                                        <li>
                                            Click the appropriate button to begin
                                            the exercise.
                                        </li>
                                    </ol>


                                    {/* Exercise Selection Image */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={ActImage}
                                                alt="KineWrite Exercise Selection"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 5. KineWrite Exercise Selection
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Read the exercise
                                            instructions before starting so you know
                                            what type of answer is expected.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 2. How to Answer Different Question Types */}
                        <GuideBlock
                            title="2. How to Answer Different Question Types"
                            content={
                                <>
                                    <p className="mb-5">
                                        KineWrite exercises may contain different
                                        types of questions. Follow the instructions
                                        for each question type carefully.
                                    </p>


                                    {/* Multiple Choice */}
                                    <h4 className="font-bold text-[#17365D] mb-2">
                                        Multiple Choice
                                    </h4>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Read the question carefully.
                                        </li>

                                        <li>
                                            Review the available choices.
                                        </li>

                                        <li>
                                            Select the answer you believe is correct.
                                        </li>

                                        <li>
                                            Review your selected answer before
                                            submitting.
                                        </li>
                                    </ol>


                                    {/* Identification */}
                                    <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                        Identification
                                    </h4>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Read the question carefully.
                                        </li>

                                        <li>
                                            Type your answer in the provided field.
                                        </li>

                                        <li>
                                            Check your spelling and wording.
                                        </li>

                                        <li>
                                            Review your answer.
                                        </li>

                                        <li>
                                            Submit your answer.
                                        </li>
                                    </ol>


                                    {/* Enumeration */}
                                    <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                        Enumeration
                                    </h4>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Read the question carefully.
                                        </li>

                                        <li>
                                            Identify all the items being requested.
                                        </li>

                                        <li>
                                            Enter each answer in the appropriate
                                            field.
                                        </li>

                                        <li>
                                            Make sure all required items are provided.
                                        </li>

                                        <li>
                                            Review your answers before submitting.
                                        </li>

                                        <li>
                                            Submit your answers.
                                        </li>
                                    </ol>


                                    {/* Practical */}
                                    <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                        Practical Activities
                                    </h4>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Read the instructions carefully.
                                        </li>

                                        <li>
                                            Follow the required procedure.
                                        </li>

                                        <li>
                                            Complete the assigned task.
                                        </li>

                                        <li>
                                            Review your work.
                                        </li>

                                        <li>
                                            Submit the activity when finished.
                                        </li>
                                    </ol>


                                    {/* Exercise Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={StartExercisesImage}
                                                alt="KineWrite Exercise Activity"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 6. KineWrite Exercise Activity
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-sm text-amber-800">
                                            ⚠️ <strong>Important:</strong> Make sure
                                            you provide the required answer before
                                            submitting the question.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 3. How to Submit an Answer */}
                        <GuideBlock
                            title="3. How to Submit an Answer"
                            content={
                                <>
                                    <p className="mb-4">
                                        Before submitting an answer, carefully review
                                        your response to minimize avoidable errors.
                                    </p>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Read the question carefully.
                                        </li>

                                        <li>
                                            Review your answer.
                                        </li>

                                        <li>
                                            Check for spelling or typing errors.
                                        </li>

                                        <li>
                                            Confirm that all required fields are
                                            completed.
                                        </li>

                                        <li>
                                            Click the <strong>Submit</strong> button.
                                        </li>
                                    </ol>


                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Always review
                                            your answer before clicking Submit,
                                            especially for identification and
                                            enumeration questions.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 4. What Happens After Submission */}
                        <GuideBlock
                            title="4. What Happens After Submission"
                            content={
                                <>
                                    <p>
                                        After submitting an answer, KineWrite
                                        evaluates your response according to the
                                        rules of the activity.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>
                                            Correct answers may receive points.
                                        </li>

                                        <li>
                                            Incorrect answers may be marked
                                            accordingly.
                                        </li>

                                        <li>
                                            Your score may be updated.
                                        </li>

                                        <li>
                                            Your progress may be recorded.
                                        </li>

                                        <li>
                                            You may proceed to the next question
                                            or view the results.
                                        </li>
                                    </ul>


                                    <div className="mt-5 p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="text-sm text-green-800">
                                            ✅ <strong>Remember:</strong> Your answers
                                            are evaluated by the system after
                                            submission. Review your responses
                                            carefully before submitting.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                    </section>
                );

            case "results":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Results & Performance
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Understand your typing and exercise performance,
                            review your mistakes, and track your progress over time.
                        </p>


                        {/* 1. Understanding WPM */}
                        <GuideBlock
                            title="1. Understanding WPM"
                            content={
                                <>
                                    <p>
                                        <strong>WPM (Words Per Minute)</strong> is
                                        a measurement of typing speed. It represents
                                        approximately how many words you can type
                                        within one minute. A higher WPM generally
                                        indicates faster typing.
                                    </p>

                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Focus on maintaining
                                            accuracy while gradually increasing your
                                            typing speed.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 2. Understanding Accuracy */}
                        <GuideBlock
                            title="2. Understanding Accuracy"
                            content={
                                <>
                                    <p>
                                        Accuracy represents how correctly you typed
                                        or answered the required content. A higher
                                        accuracy percentage indicates better control
                                        and fewer mistakes.
                                    </p>

                                    <div className="mt-5 p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="text-sm text-green-800">
                                            🎯 <strong>Remember:</strong> High typing
                                            speed is more useful when it is combined
                                            with good accuracy.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 3. Understanding Your Score */}
                        <GuideBlock
                            title="3. Understanding Your Score"
                            content={
                                <>
                                    <p>
                                        Your score represents your overall performance
                                        in an activity. The score is based on the
                                        results of your answers and the criteria used
                                        by the specific activity.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>Correct answers</li>
                                        <li>Incorrect answers</li>
                                        <li>Completed items</li>
                                        <li>Typing accuracy</li>
                                        <li>Typing speed</li>
                                        <li>Other activity-specific criteria</li>
                                    </ul>


                                    {/* Result Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={ResultImage}
                                                alt="KineWrite Results"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 7. KineWrite Results Page
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Review your results
                                            after completing an activity to understand
                                            your strengths and areas that need improvement.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 4. Reviewing Mistakes */}
                        <GuideBlock
                            title="4. Reviewing Mistakes"
                            content={
                                <>
                                    <p>
                                        Reviewing mistakes helps you identify areas
                                        that need improvement. KineWrite provides
                                        information that can help you recognize
                                        common typing and answering errors.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>Frequently misspelled words</li>
                                        <li>Incorrect characters</li>
                                        <li>Incorrect answers</li>
                                        <li>Frequently pressed wrong keys</li>
                                        <li>Areas where typing speed decreases</li>
                                    </ul>


                                    {/* Review Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={ReviewImage}
                                                alt="KineWrite Review Mistakes"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 8. KineWrite Review Page
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-sm text-amber-800">
                                            ⚠️ <strong>Important:</strong> Do not focus
                                            only on your score. Review your mistakes
                                            to determine what you need to practice.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 5. Tracking Improvement */}
                        <GuideBlock
                            title="5. Tracking Improvement"
                            content={
                                <>
                                    <p>
                                        Regularly reviewing your performance can help
                                        you determine whether your typing skills are
                                        improving. Compare your results from different
                                        practice sessions and identify changes in your
                                        speed, accuracy, and overall performance.
                                    </p>


                                    <div className="grid md:grid-cols-3 gap-4 mt-5">

                                        <InfoCard
                                            icon="⚡"
                                            title="WPM"
                                            text="Monitor whether your typing speed increases over time."
                                        />

                                        <InfoCard
                                            icon="🎯"
                                            title="Accuracy"
                                            text="Monitor whether you are making fewer typing mistakes."
                                        />

                                        <InfoCard
                                            icon="📈"
                                            title="Progress"
                                            text="Compare your results across different practice sessions."
                                        />

                                    </div>


                                    {/* Analysis Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={AnalysisImage}
                                                alt="KineWrite Performance Analysis"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 9. KineWrite Performance Analysis
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="text-sm text-green-800">
                                            📈 <strong>Tip:</strong> Practice regularly
                                            and compare your performance over time.
                                            Improvement is achieved through consistent
                                            practice.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                    </section>
                );

            case "settings":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Settings
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Customize your KineWrite experience and manage your
                            account using the available settings.
                        </p>


                        {/* Settings Overview */}
                        <GuideBlock
                            title="Settings Overview"
                            content={
                                <>
                                    <p>
                                        The Settings section allows you to customize
                                        the KineWrite interface, manage audio preferences,
                                        and access your account and profile settings.
                                    </p>

                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={SettingsImage}
                                                alt="KineWrite Settings"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 10. KineWrite Settings
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* Dark Mode */}
                        <GuideBlock
                            title="1. Dark Mode"
                            content={
                                <>
                                    <p>
                                        Dark Mode changes the appearance of the KineWrite
                                        interface to a darker theme. This can be useful
                                        when using the system in low-light environments.
                                    </p>

                                    <ol className="list-decimal ml-6 mt-4 space-y-2">
                                        <li>
                                            Open <strong>Settings</strong>.
                                        </li>

                                        <li>
                                            Select the <strong>General</strong> section.
                                        </li>

                                        <li>
                                            Locate the <strong>Dark Mode</strong> option.
                                        </li>

                                        <li>
                                            Turn the toggle <strong>ON</strong> to
                                            enable Dark Mode.
                                        </li>

                                        <li>
                                            Turn the toggle <strong>OFF</strong> to
                                            return to the light theme.
                                        </li>
                                    </ol>
                                </>
                            }
                        />


                        {/* Sound Effects */}
                        <GuideBlock
                            title="2. Sound Effects"
                            content={
                                <>
                                    <p>
                                        Sound Effects controls the sounds played by
                                        KineWrite during supported activities.
                                    </p>

                                    <ol className="list-decimal ml-6 mt-4 space-y-2">
                                        <li>
                                            Open <strong>Settings → General</strong>.
                                        </li>

                                        <li>
                                            Locate the <strong>Sound Effects</strong>
                                            option.
                                        </li>

                                        <li>
                                            Turn the toggle <strong>ON</strong> to
                                            enable sound effects.
                                        </li>

                                        <li>
                                            Turn the toggle <strong>OFF</strong> to
                                            disable sound effects.
                                        </li>
                                    </ol>
                                </>
                            }
                        />


                        {/* Background Music */}
                        <GuideBlock
                            title="3. Background Music"
                            content={
                                <>
                                    <p>
                                        Background Music allows music to play while
                                        using KineWrite. This feature can be enabled
                                        or disabled according to your preference.
                                    </p>

                                    <ol className="list-decimal ml-6 mt-4 space-y-2">
                                        <li>
                                            Open <strong>Settings → General</strong>.
                                        </li>

                                        <li>
                                            Locate the <strong>Background Music</strong>
                                            option.
                                        </li>

                                        <li>
                                            Turn the toggle <strong>ON</strong> to
                                            enable background music.
                                        </li>

                                        <li>
                                            Turn the toggle <strong>OFF</strong> to
                                            disable background music.
                                        </li>
                                    </ol>
                                </>
                            }
                        />


                        {/* Volume Mixer */}
                        <GuideBlock
                            title="4. Volume Mixer"
                            content={
                                <>
                                    <p>
                                        The Volume Mixer allows you to independently
                                        adjust the volume of Background Music and
                                        Sound Effects using the available sliders.
                                    </p>

                                    <ol className="list-decimal ml-6 mt-4 space-y-2">
                                        <li>
                                            Open <strong>Settings → General</strong>.
                                        </li>

                                        <li>
                                            Locate the <strong>Volume Mixer</strong>.
                                        </li>

                                        <li>
                                            Adjust the <strong>Background Music</strong>
                                            slider to control music volume.
                                        </li>

                                        <li>
                                            Adjust the <strong>Sound Effects</strong>
                                            slider to control sound effect volume.
                                        </li>
                                    </ol>


                                    {/* General Settings Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={GeneralSettingsImage}
                                                alt="KineWrite General Settings"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 11. KineWrite General Settings
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Adjust the music and
                                            sound effect volumes separately to create
                                            a comfortable audio level while using KineWrite.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* Account / Profile Settings */}
                        <GuideBlock
                            title="5. Account / Profile Settings"
                            content={
                                <>
                                    <p>
                                        The Account section allows you to manage
                                        available profile and account information.
                                        Depending on your account permissions, you
                                        may be able to update your name, username,
                                        email, profile picture, password, and other
                                        account information.
                                    </p>

                                    <h4 className="font-bold text-[#17365D] mt-6 mb-2">
                                        Changing Your Password
                                    </h4>

                                    <p className="text-slate-600 leading-7 mb-4">
                                        KineWrite allows you to change your account password through the
                                        <strong> Account</strong> section of Settings. For security purposes,
                                        you must provide your current password before creating a new one.
                                    </p>

                                    <ol className="list-decimal ml-6 space-y-2 text-slate-600">
                                        <li>
                                            Open <strong>Settings</strong>.
                                        </li>

                                        <li>
                                            Select the <strong>Account</strong> section.
                                        </li>

                                        <li>
                                            Scroll down to the <strong>Change Password</strong> section.
                                        </li>

                                        <li>
                                            Enter your current password in the{" "}
                                            <strong>Current Password</strong> field.
                                        </li>

                                        <li>
                                            Enter your desired password in the{" "}
                                            <strong>New Password</strong> field.
                                        </li>

                                        <li>
                                            Make sure your new password meets all the password requirements.
                                        </li>

                                        <li>
                                            Enter the same password in the{" "}
                                            <strong>Confirm Password</strong> field.
                                        </li>

                                        <li>
                                            Click <strong>Change Password</strong>.
                                        </li>
                                    </ol>

                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Use a strong password that is difficult
                                            for others to guess. Do not share your password with other users.
                                        </p>
                                    </div>


                                    {/* Change Password Screenshot */}
                                    <div className="mt-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm">
                                            <img
                                                src={ChangePasswordImage}
                                                alt="KineWrite Change Password Settings"
                                                className="w-full max-w-4xl mx-auto rounded-xl"
                                            />
                                        </div>

                                        <p className="text-sm text-slate-500 text-center mt-3">
                                            Figure 12. KineWrite Change Password Settings
                                        </p>
                                    </div>


                                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-sm text-amber-800">
                                            ⚠️ <strong>Important:</strong> Make sure
                                            your account information is correct before
                                            saving changes. Keep your password private
                                            and do not share your login credentials.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                    </section>
                );

            case "typing-tips":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Tips for Better Stylus Writing
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Follow these tips to develop better stylus writing habits,
                            improve accuracy, and gradually improve your writing speed.
                        </p>


                        {/* 1. Proper Stylus Grip */}
                        <GuideBlock
                            title="1. Hold the Stylus Properly"
                            content={
                                <>
                                    <p>
                                        Hold the stylus comfortably using a relaxed grip.
                                        Avoid holding it too tightly because excessive
                                        pressure can make writing uncomfortable and may
                                        reduce your control over the stylus.
                                    </p>

                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Keep your hand relaxed
                                            and use a comfortable grip that allows you to
                                            move the stylus smoothly across the screen.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 2. Proper Writing Position */}
                        <GuideBlock
                            title="2. Maintain a Comfortable Writing Position"
                            content={
                                <>
                                    <p>
                                        Position your hand, wrist, and arm comfortably while
                                        writing. Make sure the screen or writing surface is
                                        positioned at a comfortable angle and height.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>
                                            Keep your wrist relaxed.
                                        </li>

                                        <li>
                                            Avoid excessive pressure on the screen.
                                        </li>

                                        <li>
                                            Keep your writing surface stable.
                                        </li>

                                        <li>
                                            Maintain a comfortable sitting position.
                                        </li>

                                        <li>
                                            Avoid awkward wrist or arm movements.
                                        </li>
                                    </ul>

                                    <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <p className="text-sm text-slate-600">
                                            ✍️ <strong>Remember:</strong> A comfortable
                                            writing position helps you maintain better
                                            control and write for longer periods without
                                            unnecessary strain.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 3. Follow the Displayed Text */}
                        <GuideBlock
                            title="3. Follow the Displayed Text Carefully"
                            content={
                                <>
                                    <p>
                                        During KineWrite activities, carefully observe the
                                        text or instructions displayed on the screen.
                                        Write the required content using the stylus as
                                        accurately as possible.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>
                                            Read the displayed text carefully.
                                        </li>

                                        <li>
                                            Pay attention to spelling.
                                        </li>

                                        <li>
                                            Observe capitalization when required.
                                        </li>

                                        <li>
                                            Follow punctuation and spacing correctly.
                                        </li>

                                        <li>
                                            Avoid unnecessary marks or strokes.
                                        </li>
                                    </ul>
                                </>
                            }
                        />


                        {/* 4. Focus on Accuracy */}
                        <GuideBlock
                            title="4. Focus on Accuracy First"
                            content={
                                <>
                                    <p>
                                        Do not focus entirely on writing as quickly as
                                        possible. Prioritize accuracy first. Once you
                                        become comfortable writing accurately with the
                                        stylus, gradually work on improving your speed.
                                    </p>

                                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-lg font-bold text-[#3B9BEF]">

                                        <div className="px-5 py-3 rounded-xl bg-blue-50">
                                            Accuracy
                                        </div>

                                        <span className="hidden sm:block">
                                            →
                                        </span>

                                        <div className="px-5 py-3 rounded-xl bg-blue-50">
                                            Consistency
                                        </div>

                                        <span className="hidden sm:block">
                                            →
                                        </span>

                                        <div className="px-5 py-3 rounded-xl bg-blue-50">
                                            Speed
                                        </div>

                                    </div>

                                    <div className="mt-5 p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="text-sm text-green-800">
                                            🎯 <strong>Remember:</strong> Accurate and
                                            controlled writing is more important than
                                            writing quickly.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* 5. Use Smooth Strokes */}
                        <GuideBlock
                            title="5. Use Smooth and Controlled Strokes"
                            content={
                                <>
                                    <p>
                                        Try to make each stroke deliberate and controlled.
                                        Avoid unnecessary movements or repeatedly correcting
                                        the same character.
                                    </p>

                                    <ul className="list-disc ml-6 mt-4 space-y-2">
                                        <li>
                                            Move the stylus smoothly.
                                        </li>

                                        <li>
                                            Avoid excessive pressure.
                                        </li>

                                        <li>
                                            Keep your strokes consistent.
                                        </li>

                                        <li>
                                            Take your time when writing unfamiliar
                                            characters.
                                        </li>

                                        <li>
                                            Practice difficult letters and symbols
                                            repeatedly.
                                        </li>
                                    </ul>
                                </>
                            }
                        />


                        {/* 6. Practice Regularly */}
                        <GuideBlock
                            title="6. Practice Regularly"
                            content={
                                <>
                                    <p>
                                        Regular practice is one of the best ways to improve
                                        your stylus writing skills. Consistent practice can
                                        help develop better hand control, accuracy,
                                        coordination, writing speed, and confidence.
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-4 mt-5">

                                        <InfoCard
                                            icon="✍️"
                                            title="Hand Control"
                                            text="Regular practice helps you develop better control over stylus movements."
                                        />

                                        <InfoCard
                                            icon="🎯"
                                            title="Accuracy"
                                            text="Repeated practice helps you produce more accurate characters and strokes."
                                        />

                                        <InfoCard
                                            icon="⚡"
                                            title="Speed"
                                            text="As your control and accuracy improve, your writing speed can gradually increase."
                                        />

                                    </div>

                                    <div className="mt-6 p-5 rounded-xl bg-blue-50 border border-blue-100">
                                        <h4 className="font-bold text-[#17365D] mb-2">
                                            Recommended Practice Habit
                                        </h4>

                                        <p className="text-sm text-blue-800 leading-6">
                                            Practice consistently instead of trying to
                                            complete a large amount of practice in one
                                            session. Short and regular practice sessions
                                            can help you develop better stylus writing
                                            habits over time.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                    </section>
                );

            case "troubleshooting":
                return (
                    <section>
                        <h2 className="text-3xl font-bold text-[#17365D] mb-2">
                            Troubleshooting
                        </h2>

                        <p className="text-slate-500 mb-8">
                            Find solutions to common problems you may encounter
                            while using KineWrite.
                        </p>


                        {/* Music / Sound */}
                        <GuideBlock
                            title="1. Music or Sound Is Not Working"
                            content={
                                <>
                                    <p className="mb-4">
                                        If you cannot hear background music or sound
                                        effects, check the following settings:
                                    </p>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Make sure your device is not muted.
                                        </li>

                                        <li>
                                            Check your computer or device system volume.
                                        </li>

                                        <li>
                                            Open <strong>Settings → General</strong>.
                                        </li>

                                        <li>
                                            Check the <strong>Volume Mixer</strong> and
                                            make sure the volume levels are not set too low.
                                        </li>

                                        <li>
                                            Make sure <strong>Sound Effects</strong> are
                                            enabled.
                                        </li>

                                        <li>
                                            Make sure <strong>Background Music</strong>
                                            is enabled if you want to hear music.
                                        </li>

                                        <li>
                                            Check whether your browser has blocked audio.
                                        </li>

                                        <li>
                                            Refresh the KineWrite page and try again.
                                        </li>
                                    </ol>

                                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-sm text-amber-800">
                                            ⚠️ <strong>Important:</strong> Some browsers
                                            may prevent audio from playing until you
                                            interact with the page.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* Activity Loading */}
                        <GuideBlock
                            title="2. Activity Is Not Loading"
                            content={
                                <>
                                    <p className="mb-4">
                                        If an activity does not load properly or remains
                                        on the loading screen, try the following steps:
                                    </p>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Check your internet connection.
                                        </li>

                                        <li>
                                            Wait a few seconds for the activity to load.
                                        </li>

                                        <li>
                                            Refresh the page.
                                        </li>

                                        <li>
                                            Try opening the activity again.
                                        </li>

                                        <li>
                                            Make sure you are using a supported and
                                            up-to-date web browser.
                                        </li>

                                        <li>
                                            If the problem continues, contact the
                                            system administrator.
                                        </li>
                                    </ol>

                                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Tip:</strong> Avoid repeatedly
                                            refreshing the page while an activity is
                                            loading. Give the system a few seconds to
                                            respond first.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* Answer Submission */}
                        <GuideBlock
                            title="3. Answer Is Not Submitting"
                            content={
                                <>
                                    <p className="mb-4">
                                        If your answer cannot be submitted, check whether
                                        the required information has been provided.
                                    </p>

                                    <ol className="list-decimal ml-6 space-y-2">
                                        <li>
                                            Check that all required fields are completed.
                                        </li>

                                        <li>
                                            Review your answer for missing information.
                                        </li>

                                        <li>
                                            Make sure an answer has been selected when
                                            required.
                                        </li>

                                        <li>
                                            For identification questions, make sure you
                                            entered an answer in the text field.
                                        </li>

                                        <li>
                                            For enumeration questions, make sure all
                                            required items have been entered.
                                        </li>

                                        <li>
                                            Check your internet connection.
                                        </li>

                                        <li>
                                            Try clicking the <strong>Submit </strong>
                                            button again.
                                        </li>

                                        <li>
                                            If the issue persists, contact the system
                                            administrator.
                                        </li>
                                    </ol>

                                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-sm text-amber-800">
                                            ⚠️ <strong>Important:</strong> Review your
                                            answer before submitting because some
                                            activities may not allow you to return to
                                            a previous question.
                                        </p>
                                    </div>
                                </>
                            }
                        />


                        {/* Other Common Problems */}
                        <GuideBlock
                            title="4. Other Common Problems"
                            content={
                                <>
                                    {/* Page Looks Incorrect */}
                                    <h4 className="font-bold text-[#17365D] mb-2">
                                        Page Looks Incorrect
                                    </h4>

                                    <p className="mb-3">
                                        If some elements of the KineWrite interface do
                                        not appear correctly:
                                    </p>

                                    <ul className="list-disc ml-6 space-y-2">
                                        <li>
                                            Refresh the page.
                                        </li>

                                        <li>
                                            Maximize your browser window.
                                        </li>

                                        <li>
                                            Make sure your browser is up to date.
                                        </li>

                                        <li>
                                            Try using another supported browser.
                                        </li>

                                        <li>
                                            Clear the browser cache if necessary.
                                        </li>
                                    </ul>


                                    {/* Slow Performance */}
                                    <h4 className="font-bold text-[#17365D] mt-7 mb-2">
                                        KineWrite Is Responding Slowly
                                    </h4>

                                    <p>
                                        If KineWrite is slow or takes longer than expected
                                        to respond, check your internet connection and
                                        close unnecessary browser tabs or applications.
                                        You may also refresh the page and try again.
                                    </p>



                                    {/* Login Problems */}
                                    <h4 className="font-bold text-[#17365D] mt-7 mb-2">
                                        Cannot Log In
                                    </h4>

                                    <ul className="list-disc ml-6 space-y-2">
                                        <li>
                                            Check that your username is entered correctly.
                                        </li>

                                        <li>
                                            Check that your password is entered correctly.
                                        </li>

                                        <li>
                                            Remember that passwords are case-sensitive.
                                        </li>

                                        <li>
                                            Check your internet connection.
                                        </li>

                                        <li>
                                            Try refreshing the login page.
                                        </li>

                                        <li>
                                            Use the account recovery procedure if you
                                            forgot your password.
                                        </li>
                                    </ul>


                                    {/* Final Help */}
                                    <div className="mt-7 p-5 rounded-xl bg-blue-50 border border-blue-100">
                                        <h4 className="font-bold text-[#17365D] mb-2">
                                            Still Having Problems?
                                        </h4>

                                        <p className="text-sm text-blue-800 leading-6">
                                            If you have tried the recommended solutions
                                            and the problem continues, contact your
                                            system administrator and provide a description
                                            of the problem. If possible, include the
                                            activity or page where the problem occurred.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mt-10">

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-[#17365D]">
                    KineWrite User Guide
                </h1>

                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                    Learn how to use KineWrite, complete activities,
                    understand your results, and customize your experience.
                </p>
            </div>

            {/* Guide Layout */}
            <div className="grid lg:grid-cols-[250px_1fr] gap-8">

                {/* Sidebar */}
                <aside>
                    <div className="lg:sticky lg:top-6 space-y-2">

                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`
                                    w-full flex items-center gap-3
                                    px-4 py-3 rounded-xl
                                    text-left font-semibold
                                    transition-all duration-200
                                    ${activeSection === section.id
                                        ? "bg-[#3B9BEF] text-white shadow-md"
                                        : "text-slate-600 hover:bg-blue-50 hover:text-[#3B9BEF]"
                                    }
                                `}
                            >
                                <span className="text-lg">
                                    {section.icon}
                                </span>

                                <span>
                                    {section.title}
                                </span>
                            </button>
                        ))}

                    </div>
                </aside>

                {/* Content */}
                <main className="min-w-0">
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
                        {renderContent()}
                    </div>
                </main>

            </div>
        </div>
    );
}


/* -------------------------------- */
/* Reusable Guide Block             */
/* -------------------------------- */

function GuideBlock({ title, content }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-[#17365D] mb-3">
                {title}
            </h3>

            <div className="text-slate-600 leading-7 space-y-3">
                {content}
            </div>
        </div>
    );
}


/* -------------------------------- */
/* Reusable Info Card               */
/* -------------------------------- */

function InfoCard({ icon, title, text }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-2xl mb-2">
                {icon}
            </div>

            <h4 className="font-bold text-[#17365D] mb-1">
                {title}
            </h4>

            <p className="text-sm text-slate-500 leading-6">
                {text}
            </p>
        </div>
    );
}