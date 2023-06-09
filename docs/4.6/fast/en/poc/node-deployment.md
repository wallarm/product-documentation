[anchor-node]:                      #deployment-of-the-docker-container-with-the-fast-node
[anchor-testrun]:                   #obtaining-a-test-run
[anchor-testrun-creation]:          #creating-a-test-run
[anchor-testrun-copying]:           #copying-a-test-run

[doc-limit-requests]:               ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-inactivity-timeout]:           ../operations/internals.md#test-run
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3--prepare-a-file-containing-the-necessary-environment-variables
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2--create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-docker-run-fast]:              ../qsg/deployment.md#4--deploy-the-fast-node-docker-container
[doc-state-description]:            ../operations/check-testrun-status.md
[doc-testing-scenarios]:            ../operations/internals.md#test-run
[doc-testrecord]:                   ../operations/internals.md#test-record
[doc-create-testrun]:               ../operations/create-testrun.md
[doc-copy-testrun]:                 ../operations/copy-testrun.md
[doc-waiting-for-tests]:            waiting-for-tests.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general

[link-docker-envfile]:              https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file
[link-docker-run]:                  https://docs.docker.com/engine/reference/commandline/run/
[link-docker-rm]:                   https://docs.docker.com/engine/reference/run/#clean-up---rm

[doc-integration-overview]:         integration-overview.md
[doc-integration-overview-api]:     integration-overview-api.md


#   Running FAST Node via the Wallarm API

>   #### Info:: Chapter Prerequisites
>   
>   To follow the steps described in this chapter, you need to obtain a [token][doc-get-token].
>   
>   The following values are used as examples throughout this chapter:
>   *   `token_Qwe12345` as a token.
>   *   `tr_1234` as an identifier of a test run.
>   *   `rec_0001` as an identifier of a test record.

Running and configuration of FAST node comprises the following steps:
1.  [Deployment of the Docker Container with the FAST Node.][anchor-node]
2.  [Obtaining a Test Run.][anchor-testrun]

##  Deployment of the Docker Container with the FAST Node

>   #### Warning:: Grant Access to Wallarm API Servers
>   
>   It is crucial for the proper operation for the FAST node to have access to the `us1.api.wallarm.com` or `us1.api.wallarm.com` Wallarm API servers via the HTTPS protocol (`TCP/443`).
>   
>   Make sure that your firewall does not restrict the Docker host from accessing the Wallarm API servers.

Some configuration is required prior to running the Docker container with the FAST node. To configure the node, place the token into the container using the `WALLARM_API_TOKEN` environment variable. Additionally, you could use the `ALLOWED_HOSTS` variable if you need [to limit the number of requests to be recorded][doc-limit-requests].

To pass the environment variables to the container, place the variables in a text file and specify the path to the file using the [`--env-file`][link-docker-envfile] parameter of the  [`docker run`][link-docker-run] command (see the [instructions][doc-docker-run-fast] in the “Quick Start” guide).

Run a container with the FAST node by executing the following command:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

This guide assumes that the container runs only once for the given CI/CD job and is removed when the job ends. Therefore, the [`--rm`][link-docker-rm] parameter was added to the command listed above.

Please refer to the “Quick Start” guide for a [detailed description][doc-docker-run-fast] of the command’s parameters.

{% collapse title="Example." %}

This example assumes that the FAST node uses the `token_Qwe12345` token and is set up to record all the incoming baseline requests which have `example.local` as a substring of the `Host` header’s value.  

The content of a file with environment variables is shown in the following example:

| fast.cfg |
| -------- |
| `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

The command below runs the Docker container named `fast-poc-demo` with the following behavior:
*   The container is removed after its job is done.
*   The environment variables are passed to the container using the `fast.cfg` file. 
*   The container’s `8080` port is published to the Docker host’s `9090` port.

```
docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
```
{% endcollapse %}

If the FAST node deployment is successful, the container’s console and log file will contain the following informational messages:

```
[info] Node connected to Wallarm Cloud
[info] Waiting for TestRun to check…
```

Now the FAST node is listening on the Docker host’s IP address, and the port you specified earlier with the `-p` parameter of the `docker run` command.

##  Obtaining a Test Run

You need either to [create][anchor-testrun-creation] a test run or [copy][anchor-testrun-copying] one. The choice depends on the [test run creation scenario][doc-testing-scenarios] that is suitable to you.

### Acquiring a Test Policy Identifier

If you plan to employ your own [test policy][doc-testpolicy], then [create one][link-wl-portal-new-policy] and get the policy’s identifier. Later, pass the identifier to the `policy_id` parameter when doing an API call to create or copy the test run. 

Otherwise, if you choose to use the default test policy, then the `policy_id` parameter should be omitted from the API call.

>   #### Info:: Example of Test Policy
>   
>   The “Quick Start” guide contains [step-by-step instructions][doc-testpolicy-creation-example] on how to create a sample test policy.


### Creating a Test Run

When a test run is created, a new [test record][doc-testrecord] is created as well.

This method of test run creation should be used if it is required to test a target application along with recording of baseline requests.

>   #### Info:: How to Create a Test Run
>   
>   This process is described in detail [here][doc-create-testrun].

The FAST node needs a certain amount of time to pass after the creation of the test run in order to record requests.

Make sure that the FAST node is ready to record requests before you send any requests to the target application using the test tool.

To do so, periodically check the test run status by issuing the following API call:

{% api "Do One-Time Check of Test Run State", method="GET", url="https://us1.api.wallarm.com/v1/test_run/test_run_id" %}

!INCLUDE "include/api-check-testrun-status-recording.md"

{% endapi %}

If the request to the API server is successful, you will be presented with the server’s response. This response provides useful information, including the state of the recording process (the `ready_for_recording` parameter’s value).

If the parameter’s value is `true`, then the FAST node is ready to record and you can fire up your test tool to start sending requests to the target application.

Otherwise, repeatedly issue the same API call until the node is ready.


### Copying a Test Run

When a test run is being copied, an existing [test record][doc-testrecord] is reused.

This way of test run creation is to be used if it is required to test a target application using already recorded baseline requests.

>   #### Info:: How to Copy a Test Run
>   
>   This process is described in detail [here][doc-copy-testrun].

Provided that a test run's has been successfully created, the FAST node begins testing immediately. There is no need to take any additional actions.


## The Next Steps

The testing process can take a lot of time to complete. Use information from [this document][doc-waiting-for-tests] to determine if security testing with FAST has finished.

 You could refer back to the [“Deployment via API”][doc-integration-overview-api] or the [“CI/CD Workflow with FAST”][doc-integration-overview] documents if necessary. 