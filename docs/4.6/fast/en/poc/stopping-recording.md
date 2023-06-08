[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

#   Stopping the Recording Process

>   #### Info:: Chapter Prerequisites
>   
>   To follow the steps described in this chapter, you need to obtain:
>   *   A [token][doc-get-token].
>   *   An [identifier][doc-get-testrun-id] of a test run.
>   
>   The following values are used as example values throughout the chapter:
>   *   `token_Qwe12345` as a token.
>   *   `tr_1234` as an identifier of a test run.

Stop the baseline requests recording process via API by following the steps described [here][doc-stop-recording].

The process of testing the target application against the vulnerabilities could last a long time after the recording process was stopped. Use information from [this document][doc-waiting-for-tests] to determine if the FAST security tests are completed.

<!-- -->

You could refer back to the [“CI/CD Workflow with FAST”][doc-integration-overview] document if necessary.