// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NeroEscrow {
    address public owner;
    IERC20 public paymentToken;
    
    enum JobStatus { Created, InProgress, Completed, Cancelled }
    
    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        JobStatus status;
        string description;
    }
    
    // Job tracking
    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;
    
    // Events for frontend integration
    event JobCreated(uint256 indexed jobId, address indexed client, uint256 amount, string description);
    event FreelancerAssigned(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event JobCancelled(uint256 indexed jobId);

    constructor(address _paymentToken) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
        jobCounter = 0;
    }

    // Create a new job with funding
    function createJob(uint256 amount, string calldata description) external {
        // Transfer tokens from client to this contract
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // Create new job
        uint256 jobId = jobCounter++;
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0), // Not assigned yet
            amount: amount,
            status: JobStatus.Created,
            description: description
        });
        
        // Add to client's job list
        clientJobs[msg.sender].push(jobId);
        
        // Emit event
        emit JobCreated(jobId, msg.sender, amount, description);
    }
    
    // Assign a freelancer to a job
    function assignFreelancer(uint256 jobId, address freelancer) external {
        Job storage job = jobs[jobId];
        
        // Only the client or contract owner can assign a freelancer
        require(msg.sender == job.client || msg.sender == owner, "Not authorized");
        require(job.status == JobStatus.Created, "Job not in created state");
        require(freelancer != address(0), "Invalid freelancer address");
        
        // Update job
        job.freelancer = freelancer;
        job.status = JobStatus.InProgress;
        
        // Add to freelancer's job list
        freelancerJobs[freelancer].push(jobId);
        
        // Emit event
        emit FreelancerAssigned(jobId, freelancer);
    }
    
    // Complete a job and release funds to the freelancer
    function completeJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        
        // Only the client or contract owner can complete a job
        require(msg.sender == job.client || msg.sender == owner, "Not authorized");
        require(job.status == JobStatus.InProgress, "Job not in progress");
        require(job.freelancer != address(0), "Freelancer not assigned");
        
        // Update job status
        job.status = JobStatus.Completed;
        
        // Transfer funds to freelancer
        require(paymentToken.transfer(job.freelancer, job.amount), "Token transfer failed");
        
        // Emit event
        emit JobCompleted(jobId, job.freelancer, job.amount);
    }
    
    // Cancel a job and return funds to client
    function cancelJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        
        // Only the client, freelancer or contract owner can cancel a job
        require(msg.sender == job.client || msg.sender == job.freelancer || msg.sender == owner, "Not authorized");
        require(job.status == JobStatus.Created || job.status == JobStatus.InProgress, "Cannot cancel completed job");
        
        // Update job status
        job.status = JobStatus.Cancelled;
        
        // Return funds to client
        require(paymentToken.transfer(job.client, job.amount), "Token transfer failed");
        
        // Emit event
        emit JobCancelled(jobId);
    }
    
    // Get job details
    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }
    
    // Get all jobs for a client
    function getClientJobs(address client) external view returns (uint256[] memory) {
        return clientJobs[client];
    }
    
    // Get all jobs for a freelancer
    function getFreelancerJobs(address freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[freelancer];
    }
}