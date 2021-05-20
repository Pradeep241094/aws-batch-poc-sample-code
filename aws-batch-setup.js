// To run the setup - In the directory, just do node awsBatchAPI.js
// Dont forget to add the Access Key ID and Secret Access Key

const AWS = require('aws-sdk');

AWS.config.credentials = {
    batch: '2021-04-06',
    accessKeyId: '', //accesskeyId
    secretAccessKey: '', //secretAccessKeyId
    apiVersion: '2021-04-06',
    region: 'us-east-1'
  };
  
var batch = new AWS.Batch(AWS.config.credentials);

var largeJobsComputeEnvironmentParams = {
  type: "MANAGED", 
  computeEnvironmentName: "LargeEC2Compute", // define the compute name
  computeResources: {
   type: "SPOT", // specify the type of Instance whether it is EC2 spot / EC2 / Fargate
   desiredvCpus: 0, // In order to not initialize compute upfront, set it to 0
   instanceRole: "ecsInstanceRole", 
   spotIamFleetRole: "arn:aws:iam::1234567890:role/AmazonEC2SpotFleetTaggingRole",
   instanceTypes: [     // define Instance Pool
     "m5n.8xlarge",
     "r5.4xlarge",
     "r5a.4xlarge"
   ], 
    // cost for large EC2 compute  m5n.8xlarge	$0.3193 per Hour, r5.4xlarge $1.008 per hour, r5a 4x large 0.904$
   maxvCpus: 16, // default maxVcpus
   minvCpus: 0, 
   securityGroupIds: [
     '' // security group id
   ], 
   subnets: [
      "subnet-b57204ed",
      "subnet-4a461c77",
      "subnet-535c3479",
      "subnet-54acf722",
      "subnet-fe78eef2",
      "subnet-52402a37"
   ], // list of subnets
   tags: {
    "Name": "Batch Instance - LargeEc2Compute"
   }
  }, 
  serviceRole: "arn:aws:iam::1234567890:role/service-role/AWSBatchServiceRole",  // batch service role definition
  state: "ENABLED"
 };

 var smallJobsComputeEnvironmentParams = {
  type: "MANAGED", 
  computeEnvironmentName: "smallEC2Compute", // ec2 Small
  computeResources: {
   type: "SPOT", // specify the type of Instance whether it is EC2 spot / EC2 / Fargate
   desiredvCpus: 0, // In order to not initialize compute upfront, set it to 0
   instanceRole: "ecsInstanceRole", 
   spotIamFleetRole: "arn:aws:iam::1234567890:role/AmazonEC2SpotFleetTaggingRole",
   // for small compute m5n.2xlarge	$0.0798 per Hour, r5.2xlarge $0.505 per hour, r5a 2x large $0.452
   instanceTypes: [     // define Instance Pool
     "m5n.2xlarge",
     "r5a.2xlarge",
     "r5.2xlarge",
   ], 
   maxvCpus: 8, // default maxVcpus
   minvCpus: 0, 
   securityGroupIds: [
     'sg-0aa16fb48a5631a77'
   ], 
   subnets: [
      "subnet-b57204ed",
      "subnet-4a461c77",
      "subnet-535c3479",
      "subnet-54acf722",
      "subnet-fe78eef2",
      "subnet-52402a37"
   ], // list of subnets
   tags: {
    "Name": "Batch Instance - smallEc2Compute"
   }
  }, 
  serviceRole: "arn:aws:iam::1234567890:role/service-role/AWSBatchServiceRole",  // batch service role definition
  state: "ENABLED"
 };

 var largeJobDefinitionParams = {
  type: "container", 
  containerProperties: {
   command: [], // arguments for the Image passed through the command
   image: "1234567890.dkr.ecr.us-east-1.amazonaws.com/nodejs-client:latest", // container image address from ecr
   executionRoleArn: "arn:aws:iam::1234567890:role/ecsTaskExecutionRole", 
   memory: 102400, // memory definition
   vcpus: 16, // vcpus 
   jobRoleArn: "arn:aws:iam::1234567890:role/ecsExecutionRoleDockerHub"
  }, 
  jobDefinitionName: "tools-nodejs-cli-large-jobs", // define job name
  tags: {
   "tools-nodejscli": "largejobs", 
   "User": "Pradeep"
  }
 };

 var smallJobDefinitionParams = {
  type: "container", 
  containerProperties: {
   command: [], // arguments for the Image passed through the command
   image: "1234567890.dkr.ecr.us-east-1.amazonaws.com/nodejs-client:latest", // container image address from ecr
   executionRoleArn: "arn:aws:iam::1234567890:role/ecsTaskExecutionRole", 
   memory: 30720, // memory definition
   vcpus: 8, // vcpus 
   jobRoleArn: "arn:aws:iam::1234567890:role/ecsExecutionRoleDockerHub"
  }, 
  jobDefinitionName: "tools-nodejs-cli-small-jobs", // define job name
  tags: {
   "tools-nodejscli": "smalljobs", 
   "User": "Pradeep"
  }
 };


 var largeJobqueueParams = {
  computeEnvironmentOrder: [
     {
    computeEnvironment: "LargeEC2Compute", 
    order: 1
   }
  ], 
  jobQueueName: "newlargejobqueue", 
  priority: 1, 
  state: "ENABLED"
 };


var smallJobqueueParams = {
  computeEnvironmentOrder: [
     {
    computeEnvironment: "smallEC2Compute", 
    order: 1
   }
  ], 
  jobQueueName: "newsmalljobqueue", 
  priority: 1, 
  state: "ENABLED"
 };

const defineLargeJobComputeEnvironment =    
batch.createComputeEnvironment(largeJobsComputeEnvironmentParams, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log('>>>>>>>>>Successfully created Large Compute environment', data); 
 // response contains the ComputeEnvironment ARN and Name.

});


const defineSmallJobComputeEnvironment =    
batch.createComputeEnvironment(smallJobsComputeEnvironmentParams, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log('>>>>>>>>>Successfully created Small Compute environment', data); 
 // response contains the ComputeEnvironment ARN and Name.

});

function main () {
    new Promise((resolve, reject) => {
        console.log('Start the Compute Infrastucture for AWS Batch')
    })
    .then(
        new Promise((resolve, reject) => {
            defineLargeJobComputeEnvironment
        })
    )
    .then(
        new Promise((resolve, reject) => {
            defineSmallJobComputeEnvironment
        })
    )
    .then(
        new Promise((resolve, reject) => {
            batch.registerJobDefinition(largeJobDefinitionParams, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log('Large Job Definition Successfully created', data); // successful response
              }
          )
        })
    )
    .then(
      new Promise((resolve, reject) => {
          batch.registerJobDefinition(smallJobDefinitionParams, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else     console.log('Small Job Definition Successfully created', data); // successful response
            }
        )
      })
  )
    .then(
        new Promise((resolve, reject) => {
            setTimeout(() => {
                batch.createJobQueue(largeJobqueueParams, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log('Large Job Queue Successfully created>>>>>>>>>>>', data);   // successful response
                  })
            }, 10000);
            
        })
    )
    .then(
        new Promise((resolve, reject) => {
            setTimeout(() => {
                batch.createJobQueue(smallJobqueueParams, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else console.log('Small Job Queue Successfully created>>>>>>>>>>>', data);  // successful response
                  })
            }, 10000);
            
        })
    )
    }

main();