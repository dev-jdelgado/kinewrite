import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import PreferenceCard from "./PreferenceCard";
import { useSound } from "../../contexts/SoundContext";

export default function Preferences() {

    const { darkMode, setDarkMode } = useTheme();

    const [animationEffects, setAnimationEffects] = useState(true);
    const [showExerciseTips, setShowExerciseTips] = useState(true);
    const [handwritingGuide, setHandwritingGuide] = useState(true);

    const {
        soundEnabled,
        setSoundEnabled,

        websiteMusicEnabled,
        setWebsiteMusicEnabled,
        startWebsiteMusic,
        stopWebsiteMusic,

        musicVolume,
        setMusicVolume,

        soundVolume,
        setSoundVolume

    } = useSound();

    return (

        <div>

            <h2 className="text-3xl font-bold mb-10">
                Preference
            </h2>


            {/* ========================= */}
            {/* Appearance */}
            {/* ========================= */}

            <PreferenceCard
                title="Dark Mode"
                description="Enable dark theme interface"
                checked={darkMode}
                onChange={() => {
                    setDarkMode(prev => !prev);
                }}
            />


            {/* ========================= */}
            {/* Exercise Experience */}
            {/* ========================= */}

            <h3 className="text-lg font-bold mt-8 mb-3">
                Exercise Experience
            </h3>

            <div className="space-y-3">

                {/* ========================= */}
                {/* Sound Effects */}
                {/* ========================= */}

                <PreferenceCard
                    title="Sound Effects"
                    description="Play sounds during activities"
                    checked={soundEnabled}
                    onChange={() => {

                        setSoundEnabled(prev => !prev);

                    }}
                />


                {/* ========================= */}
                {/* Background Music */}
                {/* ========================= */}

                <PreferenceCard
                    title="Background Music"
                    description="Play background music while using KineWrite"
                    checked={websiteMusicEnabled}
                    onChange={() => {

                        if (websiteMusicEnabled) {

                            // Turn music OFF
                            stopWebsiteMusic();
                            setWebsiteMusicEnabled(false);

                        } else {

                            // Turn music ON
                            setWebsiteMusicEnabled(true);
                            startWebsiteMusic();

                        }

                    }}
                />

                <div className="mt-6">

                    <h3 className="text-lg font-bold mb-4">
                        Volume Mixer
                    </h3>

                    {/* Background Music */}
                    <div className="mb-5">

                        <div className="flex justify-between items-center mb-2">

                            <span className="font-semibold">
                                Background Music
                            </span>

                            <span className="text-sm text-gray-500">
                                {Math.round(musicVolume * 100)}%
                            </span>

                        </div>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={musicVolume}
                            onChange={(e) =>
                                setMusicVolume(Number(e.target.value))
                            }
                            className="range range-primary w-full"
                        />

                    </div>


                    {/* Sound Effects */}
                    <div>

                        <div className="flex justify-between items-center mb-2">

                            <span className="font-semibold">
                                Sound Effects
                            </span>

                            <span className="text-sm text-gray-500">
                                {Math.round(soundVolume * 100)}%
                            </span>

                        </div>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={soundVolume}
                            onChange={(e) =>
                                setSoundVolume(Number(e.target.value))
                            }
                            className="range range-primary w-full"
                        />

                    </div>

                </div>
            </div>

        </div>
    );
}