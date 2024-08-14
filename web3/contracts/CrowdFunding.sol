// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    constructor() {}

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image; 
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign (address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, uint256 _amountCollected, string memory _image) public returns(uint256) {

        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = _amountCollected;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns-1;
    } 

    function donateToCompaign (uint256 _id) public payable {

        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donations.push(amount);
        campaign.donators.push(msg.sender);

        (bool success,) = campaign.owner.call{ value : amount}("");

        if(success) {
            campaign.amountCollected += amount ;
        }
    }

    function getDonators (uint256 _id) public view returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {

        Campaign[] memory allCampaign = new Campaign[](numberOfCampaigns);

        for(uint i=0; i < numberOfCampaigns; i++) {
            allCampaign[i] = campaigns[i];
        }

        return allCampaign;
    }
}