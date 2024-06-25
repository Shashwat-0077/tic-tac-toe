import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
    initialSeconds: number;
    setGameState: React.Dispatch<React.SetStateAction<"launched" | "ended">>;
}

export default function CountDownTimer({
    initialSeconds,
    setGameState,
}: CountdownTimerProps) {
    const [seconds, setSeconds] = useState<number>(initialSeconds);

    useEffect(() => {
        if (seconds > 0) {
            const timerId = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else {
            // Perform an action when the counter hits zero
            setGameState("launched");
        }
    }, [seconds, setGameState]);

    return <p>{seconds}</p>;
}
