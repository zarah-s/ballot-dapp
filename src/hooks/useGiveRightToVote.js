import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";

const useGiveRightToVote = (address) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return toast.error("Wrong network");
        if (!isAddress(address)) return toast.error("Invalid address");
        const toastId = toast.loading("Processing");

        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const estimatedGas = await contract.giveRightToVote.estimateGas(
                address
            );
            // console.log("estimatedGas: ", estimatedGas);

            // const feeData = await readWriteProvider.getFeeData();

            // console.log("feeData: ", feeData);

            // const gasFee = estimatedGas * feeData.gasPrice;

            // console.log("estimated: ", gasFee);

            const transaction = await contract.giveRightToVote(address, {
                gasLimit: estimatedGas,
            });
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            toast.dismiss(toastId)
            if (receipt.status) {
                toast.success("giveRightToVote successfull!", { autoClose: 3000 })
                return;
            }
            toast.error("giveRightToVote failed!", { autoClose: 3000 })

            // console.log("giveRightToVote failed!");
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error?.reason ?? "An unknown error occured", { autoClose: 3000 })
            // console.error("error: ", error);
        }
    }, [address, chainId, walletProvider]);
};

export default useGiveRightToVote;
