[img-sample-job-ci-mode]:       ../../images/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#running-a-fast-node-in-recording-mode
[doc-testing-mode]:             ci-mode-testing.md#running-a-fast-node-in-testing-mode
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[doc-recording-variables]:      ci-mode-recording.md#environment-variables-in-recording-mode
[doc-integration-overview]:     integration-overview.md


#   Integration via FAST Node: Principles and Steps

To conduct a security testing in CI mode, a FAST node must be sequentially run in two modes:
1.  [Recording mode][doc-recording-mode]
2.  [Testing mode][doc-testing-mode]

The `CI_MODE` environment variable defines the operation mode of a FAST node. This variable can take the following values:
*   `recording`
*   `testing`

In this scenario, the FAST node first creates a test record and writes baseline requests to it. When the recording is finished, the node creates a test run that uses the prerecorded baseline requests as a basis for its security testing.  

This scenario is shown in the picture below:

![An example of a CI/CD job with FAST node in the CI Mode][img-sample-job-ci-mode]

The corresponding workflow steps are:

1.  Building and deploying the target application.   

2.  [Running the FAST node in recording mode][doc-recording-mode].

    In recording mode the FAST node performs the following actions:
    *   Proxies baseline requests from the requests' source to the target application.
    *   Records these baseline requests in the test record to later create the security test set based on them.
    
    !!! info "Note on Test Runs"
        A test run is not created in the recording mode.

3.  Preparing and setting up a test tool:
    
    1.  Deploying and performing a basic configuration of the test tool.
    
    2.  [Configuring the FAST node as a proxy server][doc-proxy-configuration].
        
4.  Running the existing tests.
    
    The FAST node will proxy and record baseline requests to the target application.
    
5.  Stopping and removing the FAST node container.

    If the FAST node does not encounter critical errors during operation, it runs until either the [`INACTIVITY_TIMEOUT`][doc-recording-variables] timer ticks out or the CI/CD tool explicitly stops the container.
    
    After the existing tests are complete, the FAST node [needs to be stopped][doc-fast-container-stopping]. This will stop the baseline requests recording process. Then the node container may be disposed of.          

6.  [Running the FAST node in testing mode][doc-testing-mode].

    In testing mode, the FAST node performs the following actions:
    *   Creates a test run based on the baseline requests recorded on the step 4.
    *   Starts to create and execute a security test set.
    
7.  Obtaining the results of the testing. Stopping the FAST node container.    
    
    If the FAST node does not encounter critical errors during operation, it runs until the security tests are complete. The node shuts down automatically. Then the node container may be disposed of.

##  A FAST Node Container's Lifecycle (Deployment via CI Mode)
   
This scenario assumes that the Docker container with the FAST node first runs in the recording mode, then in the testing mode. 
 
After FAST node execution is finished in any of the modes, the node container is removed. In other words, a FAST node container is recreated every time the operation mode changes. 