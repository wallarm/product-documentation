[doc-get-token]:                    prerequisites.md#anchor-token
[doc-recording-mode]:               ci-mode-recording.md
[doc-testing-mode]:                 ci-mode-testing.md

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

#   Introduction

>   #### Info:: Chapter Prerequisites
>   
>   To follow the steps described in this chapter, you need to obtain a [token][doc-get-token].
>   
>   The following values are used as examples throughout this chapter:
>   *   `token_Qwe12345` as a token.
>   *   `tr_1234` as an identifier of a test run.
>   *   `rec_0001` as an identifier of a test record.
>   *   `bl_7777` as an identifier of a baseline request.

 >   #### Info:: Install `docker-compose`
>   
>   The [`docker-compose`][link-docker-compose] tool will be used throughout this chapter to demonstrate how FAST node operates in the recording and testing modes.
>   
>   The installation instructions for this tool are available [here][link-docker-compose-install].

To conduct a security testing in CI mode, a FAST node must be sequentially run in two modes:
1.  [Recording mode][doc-recording-mode].
    
    While in this mode, FAST node:
    1.  Serves as a proxy for the HTTP and HTTPS requests from the requests source to the target application.
    2.  Records the baseline requests and places them into a test record.
    
2.  [Testing mode][doc-testing-mode].

    While in this mode, FAST node:
    1.  Creates and runs a test run based on the test record crafted in the previous step.
    2.  Tests the target application for the vulnerabilities by executing test requests.

    The `CI_MODE` environment variable defines the operation mode of a FAST node. This variable can take the following values:
    *   `recording` for the recording mode.
    *   `testing` for the testing mode.
    
The operation modes are discussed in detail later in this chapter.