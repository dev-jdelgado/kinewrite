const About = () => {
    return (
        <section className="min-h-screen sm:py-16 py-8 sm:px-6 px-1">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About <span className="text-primary">KineWrite</span>
                    </h1>

                    <p className="text-lg opacity-70 max-w-2xl mx-auto">
                        An interactive typing platform designed to help users
                        improve their typing speed, accuracy, and confidence.
                    </p>
                </div>

                {/* What is KineWrite */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-3">
                        What is KineWrite?
                    </h2>

                    <p className="leading-7 opacity-80">
                        KineWrite is an interactive typing and learning platform
                        designed to help users develop and improve their typing
                        skills through engaging and practical activities.
                        Instead of relying only on repetitive typing exercises,
                        KineWrite provides an interactive environment where
                        users can practice their typing speed, accuracy, and
                        confidence.
                    </p>
                </div>

                {/* Purpose */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-3">
                        Our Purpose
                    </h2>

                    <p className="leading-7 opacity-80">
                        KineWrite aims to make typing practice more accessible,
                        engaging, and enjoyable. Typing is an essential digital
                        skill used in academic, professional, and everyday
                        activities. Through interactive exercises, timed
                        challenges, and performance feedback, KineWrite
                        encourages users to practice consistently and improve
                        their skills.
                    </p>
                </div>

                {/* Features */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-5">
                        Key Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="card bg-base-200 p-5">
                            <h3 className="font-bold text-lg mb-2">
                                ⌨️ Typing Practice
                            </h3>
                            <p className="opacity-70">
                                Practice typing through different exercises
                                designed to improve your keyboard skills.
                            </p>
                        </div>

                        <div className="card bg-base-200 p-5">
                            <h3 className="font-bold text-lg mb-2">
                                🎯 Speed & Accuracy
                            </h3>
                            <p className="opacity-70">
                                Track your typing speed and accuracy to identify
                                areas that need improvement.
                            </p>
                        </div>

                        <div className="card bg-base-200 p-5">
                            <h3 className="font-bold text-lg mb-2">
                                ⏱️ Timed Challenges
                            </h3>
                            <p className="opacity-70">
                                Test your typing skills through challenging
                                activities with time limits.
                            </p>
                        </div>

                        <div className="card bg-base-200 p-5">
                            <h3 className="font-bold text-lg mb-2">
                                📊 Performance Results
                            </h3>
                            <p className="opacity-70">
                                Review your results and understand your typing
                                performance after every activity.
                            </p>
                        </div>

                        <div className="card bg-base-200 p-5">
                            <h3 className="font-bold text-lg mb-2">
                                🔊 Interactive Feedback
                            </h3>
                            <p className="opacity-70">
                                Sound effects and visual feedback make typing
                                practice more engaging and interactive.
                            </p>
                        </div>

                        <div className="card bg-base-200 p-5">
                            <h3 className="font-bold text-lg mb-2">
                                📈 Progress Improvement
                            </h3>
                            <p className="opacity-70">
                                Practice regularly and use your performance
                                results to improve your typing skills over time.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Why KineWrite */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-3">
                        Why KineWrite?
                    </h2>

                    <p className="leading-7 opacity-80">
                        Typing is more than simply pressing keys. Developing
                        proper typing skills allows users to work faster,
                        complete digital tasks more efficiently, and communicate
                        more effectively. KineWrite provides a simple and
                        interactive way to develop these skills through regular
                        practice.
                    </p>
                </div>

                {/* Goal */}
                <div className="text-center bg-primary text-primary-content rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-3">
                        Our Goal
                    </h2>

                    <p className="max-w-2xl mx-auto mb-4">
                        Our goal is to transform typing practice into an
                        engaging learning experience that helps users become
                        faster, more accurate, and more confident keyboard
                        users.
                    </p>

                    <p className="text-xl font-bold">
                        Practice. Improve. Type with Confidence.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default About;