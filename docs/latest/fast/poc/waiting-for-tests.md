[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

#   Waiting for the Testing to Finish

!!! info "Chapter Prerequisites"
    To follow the steps described in this chapter, you need to obtain:
    
    * a [token][doc-get-token].
    * an [identifier][doc-get-testrun-id] of a test run.
    
    The following values are used as example values throughout the chapter:
        
    * `token_Qwe12345` as a token.
    * `tr_1234` as an identifier of a test run.

The processes of creating and executing the test requests begin when the first baseline request is recorded and could take a significant amount of time after the process of baseline requests recording has been stopped. You could check the state of the test run periodically to get some insights into the performing processes.

After executing [the API call][doc-get-testrun-status], you will get a response from an API server with information regarding the test run state.

It is possible to make a conclusion on the presence or absence of vulnerabilities in the application on the basis of the `state` and `vulns` parameters’ values.

??? info "Example"
    A process, that is querying the test run state by making the API call periodically, could terminate with the exit code `0` if there was the `state:passed` parameter found in the API server’s response and with the exit code `1` if there was the `state:failed` parameter found in the API server’s response.

    The exit code value could be employed by the CI/CD tool in order to calculate the overall CI/CD job’s status. 

    If a FAST node is deployed via [CI mode](integration-overview-ci-mode.md), then FAST node's exit code might be sufficient to interpret the overall CI/CD job’s status. 

    It is possible to establish even more complex logic of how the FAST-enabled CI/CD job should interact with the CI/CD tool. To do so, use other pieces of data that could be found in the API server’s response.

 You could refer back to the [“CI/CD Workflow with FAST”][doc-integration-overview] document if necessary.