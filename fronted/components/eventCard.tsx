import Link from "next/link";
import { truncateAddress } from "../utils/truncateAddress";
import { BigNumber } from "ethers";

type EventCardProps = {
    walletAddress: string;
    newStatus: string;
    timeStamp: BigNumber;
};

export default function EventCard({ walletAddress, newStatus, timeStamp }: EventCardProps) {
    const date = new Date(timeStamp.toNumber() * 1000);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
            <Link 
          href={`/account/${walletAddress}`} 
          className="text-blue-500 hover:underline"
        >
          {truncateAddress(walletAddress)}
        </Link>

                <p className="text-sm text-gray-600">{date.toLocaleString()}</p>
            </div>
            <p>{newStatus}</p>
        </div>
    );
};
