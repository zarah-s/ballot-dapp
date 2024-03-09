import { isAddress } from "ethers";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import { toast } from "react-toastify";

export class Controller {
    chainId = null;
    walletProvider = null;
    loading = false;


    constructor(_chainId, _walletProvider) {
        this.chainId = _chainId
        this.walletProvider = _walletProvider
    }


    handleDelegate = async (to) => {
        if (this.loading) return;
        if (!isSupportedChain(this.chainId)) return toast.error("Wrong network");
        if (!isAddress(to)) return toast.error("Invalid address");
        this.loading = true;
        const toastId = toast.loading("Processing");
        const readWriteProvider = getProvider(this.walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getProposalsContract(signer);
        try {
            const transaction = await contract.delegate(to);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            toast.dismiss(toastId)
            if (receipt.status) {
                toast.success("delegate successfull!", { autoClose: 3000 })
                this.loading = false;
            }
            toast.error("delegate failed!", { autoClose: 3000 })
            this.loading = false;
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error?.reason ?? "An unknown error occured", { autoClose: 3000 })
            this.loading = false;
        }
    };


    handleVote = async (id) => {
        if (this.loading) return;
        if (!isSupportedChain(this.chainId)) return toast.error("Wrong network");
        this.loading = true;
        const toastId = toast.loading("Processing");
        const readWriteProvider = getProvider(this.walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getProposalsContract(signer);
        try {
            const transaction = await contract.vote(id);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();
            console.log("receipt: ", receipt);
            toast.dismiss(toastId)
            if (receipt.status) {
                toast.success("vote successfull!", { autoClose: 3000 })
                this.loading = false;
                return;
            }
            toast.error("vote failed!", { autoClose: 3000 })
            this.loading = false;
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error?.reason ?? "An unknown error occured", { autoClose: 3000 })
            this.loading = false;
        }
    };
}

