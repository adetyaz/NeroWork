// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NeroEscrowNative {
    address public owner;
    
    enum JobStatus { Created, InProgress, Completed, Cancelled }
    
    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        JobStatus status;
        string description;
    }
    
    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;

    event JobCreated(uint256 indexed jobId, address indexed client, uint256 amount, string description);
    event FreelancerAssigned(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event JobCancelled(uint256 indexed jobId);

    constructor() {
        owner = msg.sender;
        jobCounter = 0;
    }

    // Create a new job with native NERO funding
    function createJob(string calldata description) external payable {
        require(msg.value > 0, "Must send NERO");
        uint256 jobId = jobCounter++;
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: msg.value,
            status: JobStatus.Created,
            description: description
        });
        clientJobs[msg.sender].push(jobId);
        emit JobCreated(jobId, msg.sender, msg.value, description);
    }

    function assignFreelancer(uint256 jobId, address freelancer) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client, "Only client can assign");
        require(job.status == JobStatus.Created, "Job not open");
        require(freelancer != address(0), "Invalid freelancer");
        job.freelancer = freelancer;
        job.status = JobStatus.InProgress;
        freelancerJobs[freelancer].push(jobId);
        emit FreelancerAssigned(jobId, freelancer);
    }

    function completeJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.InProgress, "Job not in progress");
        require(msg.sender == job.client, "Only client can complete");
        job.status = JobStatus.Completed;
        payable(job.freelancer).transfer(job.amount);
        emit JobCompleted(jobId, job.freelancer, job.amount);
    }

    function cancelJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client, "Only client can cancel");
        require(job.status == JobStatus.Created, "Job not open");
        job.status = JobStatus.Cancelled;
        payable(job.client).transfer(job.amount);
        emit JobCancelled(jobId);
    }

    // View functions
    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }
    function getClientJobs(address client) external view returns (uint256[] memory) {
        return clientJobs[client];
    }
    function getFreelancerJobs(address freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[freelancer];
    }
}
