import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { useAddress, useContract, useConnect, metamaskWallet, useContractWrite, SmartContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

interface StateContextProps {
    address: string | undefined;
    contract: SmartContract<ethers.BaseContract> | undefined;
    connect: () => Promise<void> | Promise<any>;
    createCampaign: (form: Form) => Promise<void>;
    getCampaigns: () => Promise<any>;
    getUserCampaigns: () => Promise<any>;
    donate: (pId: any, amount: any) => Promise<any>;
    getDonations: (pId: any) => Promise<any>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const StateContext = createContext<StateContextProps | null>(null);

interface Form {
    title: string;
    description: string;
    target: ethers.BigNumber;
    deadline: string;
    image: string;
}

interface StateContextProviderProps {
    children: ReactNode;
}

const metamaskConfig = metamaskWallet();

export const StateContextProvider = ({ children }: StateContextProviderProps) => {
    const { contract } = useContract('0x268E84125454776BDbacDCE77621aB6a04E03AE8');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const address = useAddress();
    const Connect = useConnect();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const connectMetamask = async () => {
            const connected = await Connect(metamaskConfig);
        };

        connectMetamask();
    }, [Connect]);

    const publishCampaign = async (form: Form) => {
        const data = await createCampaign({
            args: [
                address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                0,
                form.image
            ]
        });
    };

    const getCampaigns = async () => {
        let campaigns;

        if (contract) {
            campaigns = await contract.call('getCampaigns');
        }

        const parsedCampaigns = campaigns.map((campaign: any, i: number) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filtered = allCampaigns.filter((campaign: any) =>
            campaign.owner === address
        );

        return filtered;
    }

    const donate = async (pId: any, amount: any) => {
        const data = await contract?.call('donateToCompaign', pId, { value: ethers.utils.parseEther(amount) });
        return data;
    }

    const getDonations = async (pId: any) => {
        const donations = await contract?.call('getDonators', pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect: Connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                searchTerm,
                setSearchTerm
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('Missing context');
    }
    return context;
};
