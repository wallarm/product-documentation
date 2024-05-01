[img-testpolicy-id]:                        ../../images/fast/operations/common/internals/policy-id.png
[img-execution-timeline-recording]:         ../../images/fast/operations/en/internals/execution-timeline.png
[img-execution-timeline-no-recording]:      ../../images/fast/operations/en/internals/execution-timeline-existing-testrecord.png
[img-testrecord]:                           ../../images/fast/operations/en/internals/testrecord-explained.png           
[img-fast-node]:                            ../../images/fast/operations/common/internals/fast-node.png
[img-reuse-token]:                          ../../images/fast/operations/common/internals/reuse-token.png
[img-components-relations]:                 ../../images/fast/operations/common/internals/components-relations.png
[img-common-timeline-no-recording]:         ../../images/fast/operations/en/internals/common-timeline-existing-testrecord.png

[doc-ci-intro]:                     ../poc/integration-overview.md
[doc-node-deployment-api]:          ../poc/node-deployment.md
[doc-node-deployment-ci-mode]:      ../poc/ci-mode-recording.md
[doc-quick-start]:                  ../qsg/deployment-options.md
[doc-integration-overview]:         ../poc/integration-overview.md

[link-create-policy]:               test-policy/general.md
[link-use-policy]:                  test-policy/using-policy.md
[doc-policy-in-detail]:             test-policy/overview.md

[anchor-testpolicy]:    #fast-test-policy
[anchor-testrun]:       #test-run
[anchor-token]:         #token
[anchor-testrecord]:    #test-record

[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-about-timeout]:                create-testrun.md
[doc-node-deployment]:              ../poc/node-deployment.md#deployment-of-the-docker-container-with-the-fast-node

[link-wl-portal-new-policy]:    https://us1.my.wallarm.com/testing/policies/new#general 
[link-wl-portal-policy-tab]:    https://us1.my.wallarm.com/testing/policies
[link-wl-portal-node-tab]:      https://us1.my.wallarm.com/testing/nodes

#   How FAST Operates

--8<-- "../include/fast/cloud-note.md"

!!! info "A short note on the document content"
    The relationships between the entities (see below) and the testing scenarios that are described in this chapter relate to testing with the use of the Wallarm API. This kind of testing employs all entities; therefore, it is possible to provide the reader with integral insights into how these entities interact with each other.
    
    When integrating FAST into a CI/CD workflow, these entities remain unchanged; however, the order of steps may differ for a particular case. Read [this document][doc-ci-intro] for extra details.

FAST makes use of the following entities:

* [Test record.][anchor-testrecord]
* [FAST test policy.][anchor-testpolicy]
* [Test run.][anchor-testrun]
* [Token.][anchor-token]

There are a few important relationships between the entities mentioned earlier:
* A test policy and a test record may be used by several test runs and FAST nodes.
* A token relates to a single FAST node in the Wallarm cloud, a single Docker container with that FAST node, and a single test run.
* You can pass the existing token value into a Docker container with the FAST node, provided that the token is not in use by any other Docker container with the node.
* If you create a new test run for the FAST node while another test run is in place, then the current test run will stop and be replaced by the new one.

![Relations between the components][img-components-relations]

##   The Entities Used by FAST

The FAST node acts as a proxy for all requests from the request source to the target application. According to Wallarm terminology, these requests are called *baseline requests*.

When FAST node receives requests, it saves them into the special “test record” object to later create security tests based on them. According to Wallarm terminology, this process is called “baseline requests recording”.

After recording the baseline requests, the FAST node creates a security test set according to a [*test policy*][anchor-testpolicy]. Then, the security test set is executed to evaluate the target application against vulnerabilities.

The test record allows for previously recorded baseline requests to be reused to test the same target application or another target application again; there is no need to repeat the sending of identical baseline requests through the FAST node. This is only possible if the baseline requests in the test record are suitable for testing the application.


### Test Record

FAST creates a security test set from baseline requests that are stored in the test record.

To populate a test record with some baseline requests, a [test run][anchor-testrun] that is tied to this test record and a FAST node must be executed and some baseline requests must be sent through the FAST node.  

Alternatively, it is possible to populate a test record without creation of a test run. To do so, you must run the FAST node in recording mode. See [this document][doc-node-deployment-ci-mode] for details. 

Given that the test record is populated with requests, it is possible to use it with another test run if an application under the test can be evaluated for vulnerabilities using a subset of the baseline requests stored in the test record.  

A single test record could be employed by multiple FAST nodes and test runs. This may be useful if:
* The same target application is being tested again.
* Multiple target applications are being tested concurrently with the same baseline requests.

![Working with a test record][img-testrecord]
 

### FAST Test Policy

A *test policy* defines a set of rules for conducting the process of vulnerability detection. In particular, you can select the vulnerability types that the application should be tested for. In addition, the policy determines which parameters in the baseline request are eligible to be processed while creating a security test set. These pieces of data are used by FAST to create test requests that are used to find out if the target application is exploitable.

You can [create][link-create-policy] a new policy or [use an existing][link-use-policy] one.

!!! info "Choosing the Appropriate Test Policy"
    The choice of the test policy depends on how the tested target application works. It is recommended that you create a distinct test policy for each of the applications you test.

!!! info "Additional Information"

    * [Test policy example][doc-testpolicy-creation-example] from the Quick Start guide
    * [Test policy details][doc-policy-in-detail]

### Test Run

A *test run* describes the single iteration of the vulnerability testing process.

A test run contains:

* [Test policy][anchor-testpolicy] identifier
* [Test record][anchor-testrecord] identifier

FAST node employs these values while conducting a security test of a target application.

Each test run is tightly coupled with a single FAST node. If you create a new test run `B` for the FAST node while there is another test run `A` in progress for this node, then the test run `A`’s execution is aborted and replaced by test run `B`.

It is possible to create a test run for two different testing scenarios:
* In the first scenario, a target application is being tested for vulnerabilities and the baseline requests' recordings are taking place simultaneously (to a new test record). The requests should flow from the request source to the target application through the FAST node for the baseline requests to be recorded. 

    A creation of a test run for this scenario will be referred to as “test run creation”  throughout the guide.

* In the second scenario, a target application is being tested for vulnerabilities with the baseline requests extracted from an existing, non-empty test record. In this scenario, it is not necessary to deploy any request source.

    A creation of a test run for this scenario will be referred to as “test run copying”  throughout the guide.

When you create or copy a test run, its execution begins immediately. Depending on the testing scenario in action, the execution process will follow different steps (see below).

### Test Run Execution Flow (baseline requests recording takes place)

When you create a test run, its execution begins immediately and follows the following steps:

1.  A FAST node awaits a test run. 

    When the FAST node determines that the test run has started, the node fetches the test policy and the test record identifiers from the test run.
    
2.  After obtaining the identifiers, the *baseline requests recording process* starts.
    
    Now the FAST node is ready to receive requests from the request source to the target application.
    
3.  Given that the request recording is active, it is time to start the execution of existing tests. HTTP and HTTPS requests are sent through the FAST node, which recognizes them as baseline requests.

    All baseline requests will be stored in the test record that corresponds to the test run.
    
4.  After the test execution is finished, you can stop the recording process.
    
    There is a special timeout value set after the creation of a test run. It determines how long FAST should wait for new baseline requests before stopping the recording process due to the absence of baseline requests (the [`inactivity_timeout`][doc-about-timeout] parameter).
    
    If you do not stop the recording process manually, then: 
    
    * The test run continues its execution until the timeout value expires, even if the FAST security tests are already finished.
    * Other test runs are not able to reuse the test record until this test run stops. 
    
    You could stop the recording process on the FAST node if there are no more baseline requests awaiting. Note the following:

    *  The processes of creation and execution of the security tests are not to be stopped. Test run execution stops when the evaluation of the target application against the vulnerabilities finishes. This behavior helps to decrease the execution time of the CI/CD job.
    *  Other test runs gain the ability to reuse the test record once recording is stopped.
    
5.  The FAST node creates one or more test requests based on each of the incoming baseline requests (only if the baseline request satisfies the applied test policy).
     
6.  The FAST node executes the test requests by sending them to the target application.

Stopping the baseline requests' recording process has no impact on the processes of creation and execution of the test requests.

The processes of baseline requests recording and the creation and execution of the FAST security tests run in parallel:

![Test run execution flow (baseline request recording takes place)][img-execution-timeline-recording]

Note: the chart above shows the flow described in the [FAST quick start guide][doc-quick-start]. A flow with baseline requests recording is suitable either for manual security testing or automated security testing using CI/CD tools.

In this scenario, Wallarm API is required to manipulate the test run. See [this document][doc-node-deployment-api] for details. 


### Test Run Execution Flow (pre-recorded baseline requests are used)

When you copy a test run, its execution begins immediately and follows the following steps:

1.  A FAST node awaits a test run. 

    When the FAST node determines that the test run has started, the node fetches the test policy and the test record identifiers from the test run.
    
2.  After obtaining the identifiers, the node extracts the baseline requests from the test record.

3.  The FAST node creates one or more test requests based on each of the extracted baseline requests (only if the baseline request satisfies the applied test policy).

4.  The FAST node executes the test requests by sending them to the target application.

The process of baseline request extracting takes place prior to the creation and execution of the FAST security tests:

![Test run execution flow (pre-recorded baseline requests are used)][img-execution-timeline-no-recording]

Note that it is the execution flow that is used in the [FAST quick start guide][doc-quick-start]. The flow that makes use of pre-recorded baseline requests is suitable for automated security testing with use of CI/CD tools.

In this scenario, the Wallarm API or FAST node in CI mode can be used to manipulate the test run. See [this document][doc-integration-overview] for details.

The chart below shows the most commonly encountered CI/CD workflow, which complies with the timeline shown above:

![Test run execution flow (CI Mode)][img-common-timeline-no-recording]


##  Working with Test Runs

While reading this guide, you will learn how to manage the test run execution process using API calls, specifically:
* How to stop the baseline requests recording process if there are no more requests from the request source.
* How to check the test run execution status.

You need to obtain a [*token*][anchor-token] in order to make such API calls and to bind the test run to the FAST node.

### Token

A FAST node comprises of:
* The up and running Docker container with FAST software.
    
    This is where the process of traffic proxying, security test creation, execution take place.
    
* The Wallarm cloud FAST node.

A token binds the running Docker container with the FAST node in the cloud:

![FAST node][img-fast-node]

To deploy a FAST node, do the following:
1.  Create a FAST node in the Wallarm cloud using the [Wallarm portal][link-wl-portal-node-tab]. Copy the provided token.
2.  Deploy a Docker container with the node and pass the token value into the container (this process is described in detail [here][doc-node-deployment]).

The token serves the following purposes as well:
* Connecting the test run with the FAST node.
* Allowing you to manage the test run execution process by making API calls.

You could create as many FAST nodes in the Wallarm cloud as you need and obtain a token for each of the nodes. For example, if you have several CI/CD jobs where FAST is required, you may spin up a FAST node in the cloud for each job.

It is possible to reuse tokens you obtained earlier if the tokens are not in use by other active Docker containers with the FAST node (e.g., any Docker container with a node that employs the same token is stopped or removed):

![Reusing the token][img-reuse-token]