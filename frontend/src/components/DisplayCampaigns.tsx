import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loader } from '../assets';
import FundCard from './FundCard';

import { useStateContext } from '../context';

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: any;
}

const DisplayCampaigns: React.FC<DisplayCampaignsProps> = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  
  const {searchTerm, setSearchTerm} = useStateContext();

  const handleNavigate = (campaign: any) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign })
  };

  const filteredCampaigns = campaigns.filter((campaign: any) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className='font-epilogue font-semibold text-[18px] text-white text-left'>
        {title} ({filteredCampaigns.length})
      </h1>
      <div className='flex flex-wrap mt-[20px] gap-[26px]'>
        {isLoading && (
          <img src={loader} className='w-[100px] h-[100px] object-contain' alt='Loading...' />
        )}
        {!isLoading && filteredCampaigns.length === 0 && (
          <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
            No Campaigns
          </p>
        )}
        {!isLoading && filteredCampaigns.length > 0 && filteredCampaigns.map((campaign: any) => (
          <FundCard 
            key={campaign.id}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;