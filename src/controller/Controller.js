import { isAddress } from "ethers";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";

export class Controller {
    chainId = null;
    walletProvider = null;
    constructor(_chainId, _walletProvider) {
        this.chainId = _chainId
        this.walletProvider = _walletProvider
    }
    handleDelegate = async (to) => {
        if (!isSupportedChain(this.chainId)) return console.error("Wrong network");
        if (!isAddress(to)) return console.error("Invalid address");

        const readWriteProvider = getProvider(this.walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const transaction = await contract.delegate(to);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                return console.log("delegate successfull!");
            }

            console.log("delegate failed!");
        } catch (error) {
            console.log(error);
            let errorText;
            if (error.reason === "Has no right to vote") {
                errorText = "You have not right to vote";
            } else if (error.reason === "Already voted.") {
                errorText = "You have already voted";
            } else {
                errorText = "An unknown error occured";
            }

            console.error("error: ", errorText);
        }
    };



    handleVote = async (id) => {
        if (!isSupportedChain(this.chainId)) return console.error("Wrong network");
        const readWriteProvider = getProvider(this.walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const transaction = await contract.vote(id);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                return console.log("vote successfull!");
            }

            console.log("vote failed!");
        } catch (error) {
            console.log(error);
            let errorText;
            if (error.reason === "Has no right to vote") {
                errorText = "You have not right to vote";
            } else if (error.reason === "Already voted.") {
                errorText = "You have already voted";
            } else {
                errorText = "An unknown error occured";
            }

            console.error("error: ", errorText);
        }
    };
}

