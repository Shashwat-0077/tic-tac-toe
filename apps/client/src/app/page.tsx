import RoomButtons from "@/components/roomButtons";
import Image from "next/image";

export default function Home() {
    return (
        <div className="w-full h-[100svh] grid place-content-center">
            <Image
                src={"/logo.png"}
                alt="TicTacToe"
                width={821}
                height={304}
                className="w-96 select-none"
                priority
            />
            <RoomButtons />
        </div>
    );
}
