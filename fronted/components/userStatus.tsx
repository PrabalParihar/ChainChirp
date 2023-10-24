import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead, useDisconnect } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import { useState } from "react";
import Lottie from "lottie-react";
import loadingLottie from "../public/loadingLottie.json";
import { truncateAddress } from "../utils/truncateAddress";
import Link from "next/link";

export default function UserStatus() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const [newStatus, setNewStatus] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const characterDecoration = characterCount >= 140 ? 'text-red-500' : 'text-gray-500';

  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const {
    data: myStatus,
    isLoading: isMyStatusLoading,
  } = useContractRead(contract, "getStatus", [address]);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ConnectWallet
          modalSize="compact"
          dropdownPosition={{
            side: "bottom",
            align: "start",
          }}
        />
        <p className="mt-2">Please connect your wallet.</p>
      </div>
    );
  }

  if (isMyStatusLoading) {
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
    <div className="max-w-md mx-auto text-black">
      <div className="flex justify-between items-center mb-4">
      <Link 
          href={`/account/${address}`} 
          className="text-blue-500 hover:underline"
        >
          {truncateAddress(address)}
        </Link>
        <button
          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          onClick={() => disconnect()}
        >
          Logout
        </button>
      </div>
      {!isMyStatusLoading && myStatus && (
        <p className="bg-gray-100 p-4 rounded mb-4">{myStatus}</p>
      )}
      <button
        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mb-4 w-full"
        onClick={() => setIsStatusModalOpen(true)}
      >
        Update
      </button>

      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <p>New Status:</p>
              <button onClick={() => setIsStatusModalOpen(false)}>Close</button>
            </div>
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value)
                setCharacterCount(e.target.value.length)
              }}
              placeholder="Enter your status"
            />
            <div className="mb-2">
              <p className={characterDecoration}>{characterCount}/140</p>
            </div>
            <Web3Button
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full"
              contractAddress={STATUS_CONTRACT_ADDRESS}
              action={(contract) => contract.call("setStatus", [newStatus])}
              isDisabled={characterCount === 0 || characterCount > 140}
              onSuccess={() => {
                setIsStatusModalOpen(false);
                setNewStatus("");
              }}
            >
              Update Status
            </Web3Button>
          </div>
        </div>
      )}
    </div>
  );
};
