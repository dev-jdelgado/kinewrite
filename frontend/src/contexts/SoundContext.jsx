import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import clickSound from "../assets/sound/click.wav";
import successSound from "../assets/sound/success.wav";
import errorSound from "../assets/sound/error.wav";
import completeSound from "../assets/sound/complete.wav";

import websiteSound from "../assets/sound/websitesound.mp3";
import gameSound from "../assets/sound/gamesound.mp3";


const SoundContext = createContext();


export function SoundProvider({ children }) {

    // =========================
    // Sound Effects
    // =========================

    // =========================
    // Persistent Sound Settings
    // =========================

    const [soundEnabled, setSoundEnabled] = useState(() => {

        const saved = localStorage.getItem("soundEnabled");

        return saved !== null
            ? JSON.parse(saved)
            : true;

    });

    const [musicVolume, setMusicVolume] = useState(() => {

        const saved = localStorage.getItem("musicVolume");

        return saved !== null
            ? Number(saved)
            : 0.15;

    });

    const [soundVolume, setSoundVolume] = useState(() => {

        const saved = localStorage.getItem("soundVolume");

        return saved !== null
            ? Number(saved)
            : 0.5;

    });

    const [websiteMusicEnabled, setWebsiteMusicEnabled] = useState(() => {

        const saved = localStorage.getItem(
            "websiteMusicEnabled"
        );

        return saved !== null
            ? JSON.parse(saved)
            : true;

    });

    // =========================
    // Save Sound Settings
    // =========================

    useEffect(() => {

        localStorage.setItem(
            "soundEnabled",
            JSON.stringify(soundEnabled)
        );

    }, [soundEnabled]);


    useEffect(() => {

        localStorage.setItem(
            "websiteMusicEnabled",
            JSON.stringify(websiteMusicEnabled)
        );

    }, [websiteMusicEnabled]);


    useEffect(() => {

        localStorage.setItem(
            "musicVolume",
            musicVolume
        );

    }, [musicVolume]);


    useEffect(() => {

        localStorage.setItem(
            "soundVolume",
            soundVolume
        );

    }, [soundVolume]);


    const websiteMusicRef = useRef(null);
    const gameMusicRef = useRef(null);
    const soundEffectsRef = useRef([]);

    const startGameMusic = () => {

        if (!websiteMusicEnabled) return;

        stopWebsiteMusic();

        if (!gameMusicRef.current) {

            gameMusicRef.current = new Audio(gameSound);

            gameMusicRef.current.loop = true;
        }

        gameMusicRef.current.volume = musicVolume;

        gameMusicRef.current
            .play()
            .catch((error) => {
                console.log(
                    "Game music could not play:",
                    error
                );
            });
    };

    const stopGameMusic = () => {

        if (gameMusicRef.current) {

            gameMusicRef.current.pause();

            gameMusicRef.current.currentTime = 0;
        }
    };

    // =========================
    // General Sound Player
    // =========================

    const playSound = (src) => {

        if (!soundEnabled) return;

        const audio = new Audio(src);

        audio.volume = soundVolume;

        audio.play().catch((error) => {
            console.log(
                "Sound could not be played:",
                error
            );
        });
    };


    // =========================
    // Specific Sounds
    // =========================

    const playClick = () => {
        playSound(clickSound);
    };

    const playSuccess = () => {
        playSound(successSound);
    };

    const playError = () => {
        playSound(errorSound);
    };

    const playComplete = () => {
        playSound(completeSound);
    };


    // =========================
    // Website Music
    // =========================

    const startWebsiteMusic = () => {

        if (!websiteMusicEnabled) return;

        if (!websiteMusicRef.current) {

            websiteMusicRef.current = new Audio(websiteSound);

            websiteMusicRef.current.loop = true;
            websiteMusicRef.current.volume = musicVolume;
        }

        websiteMusicRef.current.volume = musicVolume;

        websiteMusicRef.current
            .play()
            .catch((error) => {
                console.log(
                    "Website music could not play:",
                    error
                );
            });
    };


    const stopWebsiteMusic = () => {

        if (websiteMusicRef.current) {

            websiteMusicRef.current.pause();

            websiteMusicRef.current.currentTime = 0;
        }
    };

    // =========================
    // Update Music Volume
    // =========================

    useEffect(() => {

        console.log("Music volume:", musicVolume);

        if (websiteMusicRef.current) {
            websiteMusicRef.current.volume = musicVolume;
        }

        if (gameMusicRef.current) {
            gameMusicRef.current.volume = musicVolume;
        }

    }, [musicVolume]);



    // =========================
    // Global Click Sound
    // =========================

    useEffect(() => {

        const handleClick = (event) => {

            const clickable = event.target.closest(
                "button, a, [role='button'], input[type='checkbox'], input[type='radio'], select"
            );

            if (!clickable) return;

            if (clickable.disabled) return;

            // Allow specific elements to disable click sound
            if (clickable.dataset.noClickSound !== undefined) {
                return;
            }

            playClick();
        };

        document.addEventListener(
            "click",
            handleClick
        );

        return () => {

            document.removeEventListener(
                "click",
                handleClick
            );

        };

    }, [soundEnabled, soundVolume]);


    // =========================
    // Start Website Music
    // After First User Interaction
    // =========================

    useEffect(() => {

        const startMusicAfterInteraction = () => {

            if (websiteMusicEnabled) {
                startWebsiteMusic();
            }

            document.removeEventListener(
                "click",
                startMusicAfterInteraction
            );
        };

        document.addEventListener(
            "click",
            startMusicAfterInteraction
        );

        return () => {

            document.removeEventListener(
                "click",
                startMusicAfterInteraction
            );

        };

    }, [websiteMusicEnabled]);


    // =========================
    // Cleanup Music
    // =========================

    useEffect(() => {

        return () => {

            // Stop website music
            if (websiteMusicRef.current) {

                websiteMusicRef.current.pause();

                websiteMusicRef.current = null;
            }

            // Stop game music
            if (gameMusicRef.current) {

                gameMusicRef.current.pause();

                gameMusicRef.current = null;
            }

        };

    }, []);


    // =========================
    // Provider
    // =========================

    return (
        <SoundContext.Provider
            value={{

                // Sound Effects
                soundEnabled,
                setSoundEnabled,

                playSound,
                playClick,
                playSuccess,
                playError,
                playComplete,

                // Website Music
                websiteMusicEnabled,
                setWebsiteMusicEnabled,

                startWebsiteMusic,
                stopWebsiteMusic,

                startGameMusic,
                stopGameMusic,

                // Volume
                musicVolume,
                setMusicVolume,

                soundVolume,
                setSoundVolume

            }}
        >
            {children}
        </SoundContext.Provider>
    );
}


export function useSound() {
    return useContext(SoundContext);
}