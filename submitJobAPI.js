const AWS = require('aws-sdk');

AWS.config.credentials = {
    batch: '2021-04-06',
    accessKeyId: '', // Add the access key id and Access Key of yor registered AWS account
    secretAccessKey: '',
    apiVersion: '2021-04-06',
    region: 'us-east-1'
  };

  var batch = new AWS.Batch(AWS.config.credentials);

const ArrayOfJobs = [
  params = {
    jobDefinition: "ExampleFromAPI:1", 
    jobName: "nodeJsCliJob1", 
    jobQueue: "HighPriority",
  arrayProperties: {
    size: 2
  },
  containerOverrides: {
    command: [
      "-n","John","-s","1"
    ],
    resourceRequirements: [
      {
        type: "VCPU",
        value: "1" /* required */,
        type: "MEMORY",
        value: "2048"
      },
      /* more items */
    ],
  },
  timeout: {
    attemptDurationSeconds: 60
  }
},
params = {
  jobDefinition: "ExampleFromAPI:1", 
  jobName: "nodeJsCliJob2", 
  jobQueue: "HighPriority",
arrayProperties: {
  size: 2
},
containerOverrides: {
  command: [
    "-n","Pradeep","-s","2"
  ],
  resourceRequirements: [
    {
      type: "VCPU",
      value: "10" /* required */,
      type: "MEMORY",
      value: "1024"
    },
    /* more items */
  ],
},
timeout: {
  attemptDurationSeconds: 60
}
},
params = {
  jobDefinition: "ExampleFromAPI:1", 
  jobName: "nodeJsCliJob3", 
  jobQueue: "HighPriority",
containerOverrides: {
  command: [
    "-n","Prince","-s","4"
    // String which has the URL, Params
  ],
  resourceRequirements: [
    {
      type: "VCPU",
      value: "4" /* required */,
      type: "MEMORY",
      value: "512"
    },
    /* more items */
  ],
},
timeout: {
  attemptDurationSeconds: 120
}
},
params = {
  jobDefinition: "ExampleFromAPI:1", 
  jobName: "nodeJsCliJob4", 
  jobQueue: "HighPriority",
containerOverrides: {
  command: [
    "-n","Reality AI","-s","4"
  ],
  resourceRequirements: [
    {
      type: "VCPU",
      value: "2" /* required */,
      type: "MEMORY",
      value: "2048"
    },
    /* more items */
  ],
},
timeout: {
  attemptDurationSeconds: 180
}
}
];


ArrayOfJobs.map((params) => {
batch.submitJob(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
})
