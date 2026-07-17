import {
    Clock3,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

const CountdownTimer = ({

    initialSeconds = 0,

    autoStart = true,

    onFinish = null,

}) => {

    const [seconds, setSeconds] =
        useState(initialSeconds);

    const [running, setRunning] =
        useState(autoStart);

    useEffect(() => {

        if (!running) return;

        const timer = setInterval(() => {

            setSeconds((previous) => {

                if (previous <= 0) {

                    clearInterval(timer);

                    setRunning(false);

                    onFinish?.();

                    return 0;

                }

                return previous - 1;

            });

        }, 1000);

        return () =>
            clearInterval(timer);

    }, [

        running,
        onFinish,

    ]);

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return (

        <div
            className="
                inline-flex
                items-center
                gap-3

                rounded-full

                bg-white

                px-6
                py-3

                shadow-lg
                border
                border-slate-200
            "
        >

            <Clock3
                size={24}
                className="
                    text-[#9b4c00]
                "
            />

            <span
                className="
                    text-xl
                    font-bold
                    text-slate-800
                "
            >

                {String(minutes)
                    .padStart(2, "0")}

                :

                {String(remainingSeconds)
                    .padStart(2, "0")}

            </span>

        </div>

    );

};

export default CountdownTimer;