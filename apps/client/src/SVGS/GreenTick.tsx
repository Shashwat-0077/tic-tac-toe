import React, { SVGProps } from "react";

export default function GreenTick({ className }: { className?: string }) {
    return (
        <svg
            width="18px"
            height="18px"
            viewBox="0 0 48 48"
            version="1"
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 48 48"
            className={className}
        >
            <polygon
                fill="#43A047"
                points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9"
            />
        </svg>
    );
}
