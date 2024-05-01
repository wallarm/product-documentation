[img-sample-job-recording]:     ../../images/fast/poc/en/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/en/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#test-run
[doc-container-deployment]:     node-deployment.md#deployment-of-the-docker-container-with-the-fast-node
[doc-testrun-creation]:         node-deployment.md#creating-a-test-run 
[doc-testrun-copying]:          node-deployment.md#copying-a-test-run     
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#test-record
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #deployment-via-the-api-when-baseline-requests-recording-takes-place 
[anchor-no-recording]:          #deployment-via-the-api-when-prerecorded-baseline-requests-are-used

[doc-integration-overview]:     integration-overview.md

#   Integration via Wallarm API

There are several methods of deployment:
1.  [Deployment via the API when baseline requests recording takes place.][anchor-recording]
2.  [Deployment via the API when pre-recorded baseline requests are used.][anchor-no-recording]


##  Deployment via the API when Baseline Requests Recording Takes Place

A [test run][doc-testrun] is created in this scenario. Baseline requests will be recorded into a test record that corresponds to the test run.

The corresponding workflow steps are:

1.  Building and deploying the target application.

2.  Deploying and setting up the FAST node:
    
    1.  [Deploying a Docker container with the FAST node][doc-container-deployment].
    
    2.  [Creating a test run][doc-testrun-creation].
    
        After you perform these actions, make sure that the FAST node is ready to begin the baseline requests recording process.
    
3.  Preparing and setting up a test tool:
    
    1.  Deploying and performing a basic configuration of the test tool.
    
    2.  [Configuring the FAST node as a proxy server][doc-proxy-configuration].
    
4.  Running the existing tests.
    
    The FAST node will begin to create and execute the security test set when it receives the first baseline request.
    
5.  Stopping the baseline requests recording process.
    
    The recording process [should be stopped][doc-stopping-recording] after all of the existing tests are executed.
    
    Now, the [test record][doc-testrecord] that holds the recorded baseline requests, is ready to be reused in the CI/CD workflow that works with the already recorded baseline requests.  
    
6.  Waiting for the FAST security tests to finish.
    
    Periodically check the status of the test run by making an API request. This helps [to determine whether the security tests are completed or not][doc-waiting-for-tests].
    
7.  Obtaining the results of the testing.

This scenario is shown on the picture below:

![An example of a CI/CD job with requests recording][img-sample-job-recording]


##  Deployment via the API when Prerecorded Baseline Requests are Used

A test run is copied in this scenario. While copying, an existing test record identifier is passed to the test run. The test record is acquired in the CI/CD workflow with baseline requests recording.

The corresponding workflow steps are:

1.  Building and deploying the target application.

2.  Deploying and setting up the FAST node:
    
    1.  [Deploying a Docker container with the FAST node][doc-container-deployment].
    
    2.  [Copying a test run][doc-testrun-copying].    

3.  Extracting the baseline requests from the given test record with the FAST node. 

4.  Conducting security testing of the target application with the FAST node.

5.  Waiting for the FAST security tests to finish.
    
    Periodically check the status of the test run by making an API request. This helps [to determine whether the security tests are completed or not][doc-waiting-for-tests].
    
6.  Obtaining the results of the testing.

![An example of a CI/CD job with use of pre-recorded requests][img-sample-job-no-recording]   


##  A FAST Node Container's Lifecycle (Deployment via API)

This scenario assumes that the Docker container with the FAST node runs only once for a given CI/CD job and is removed when the job ends.
 
If the FAST node does not encounter critical errors during operation, it runs in an infinite loop, waiting for new test runs and baseline requests to test the target application again.
  
The Docker container with the node should be stopped explicitly by the CI/CD tool when the CI/CD job is finished. 

<!-- -->
You could refer back to the [“CI/CD Workflow with FAST”][doc-integration-overview] document if necessary.
