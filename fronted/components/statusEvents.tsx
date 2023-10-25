import { useContract, useContractEvents } from "@thirdweb-dev/react"
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import EventCard from "./eventCard";
import Lottie from 'lottie-react';
import loadingLottie from "../public/loadingLottie.json";
import { useEffect, useState } from "react";

export default function StatusEvents() {
    const [isLoading, setIsLoading] = useState(true);
    
    const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

    const { data: statusEvents, isLoading: isStatusEventsLoading } = useContractEvents(
        contract, 
        "StatusUpdated",
        { subscribe: true }
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
              <Lottie 
                animationData={loadingLottie} 
                loop={true} 
                style={{ width: 100, height: 100 }} 
              />
            </div>
          );
    }

    return (
        <div className="p-4">
            {!isStatusEventsLoading && statusEvents && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black ">
                    {statusEvents.slice(0, 30).map((event, index) => (
                        <EventCard
                            key={index}
                            walletAddress={event.data.user}
                            newStatus={event.data.newStatus}
                            timeStamp={event.data.timestamp}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
