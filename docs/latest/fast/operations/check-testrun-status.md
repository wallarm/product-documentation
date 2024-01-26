[doc-about-tr-token]:   internals.md

[img-testrun-velocity]: ../../images/fast/poc/en/checking-testrun-status/testrun-velocity.png
[img-testrun-avg-rps]:  ../../images/fast/poc/en/checking-testrun-status/testrun-avg-rps.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-test-runs]:            ../../images/fast/poc/en/checking-testrun-status/test-runs.png

[link-wl-portal-testruns-in-progress]:  https://us1.my.wallarm.com/testing/?status=running

[link-integration-chapter]:         integration-overview.md
[link-vuln-list]:                   ../vuln-list.md

[anchor-testrun-estimates]:         #estimates-of-test-runs-execution-speed-and-time-to-completion

[doc-testrun-copying]:              copy-testrun.md
[doc-stop-recording]:               stop-recording.md


#   Checking of Test Run State

The processes of creating and executing the test requests begin when the first baseline request is recorded and could last a significant amount of time after the process of baseline requests recording has been [stopped][doc-stop-recording]. You could check the state of the test run to get some insights into the performing processes. For this, the following methods can be used:

* [Checking the state via Wallarm UI](#checking-the-state-via-wallarm-ui)
* [Checking the state using API method](#checking-the-state-using-api-method)

## Checking the State via Wallarm UI

The test run state is displayed in Wallarm UI in real-time mode. To check the state:

1. Log in to your Wallarm account in [US cloud](https://us1.my.wallarm.com/) or [EU cloud](https://my.wallarm.com/).
2. Open the **Test runs** section and click the required test run.

![Test run example][img-test-runs]

The state is displayed for each baseline request:

* **Passed** ![Status: Passed][img-status-passed]
        
    No vulnerabilities were found for the given baseline request.
        
* **In progress** ![Status: In progress][img-status-inprogress]
              
    The baseline request is being tested for vulnerabilities.

* **Failed** ![Status: Failed][img-status-failed]  
        
    Vulnerabilities were found for the given baseline request. The number of vulnerabilities and the link for details are displayed for each baseline request.
            
* **Error** ![Status: Error][img-status-error]  
            
    The testing process was stopped due to the displayed error:

    * `Connection failed`: network error
    * `Auth failed`: authentication parameters are not passed or passed incorrectly
    * `Invalid policies`: failed to apply configured test policy
    * `Internal exception`: incorrect security testing configuration
    * `Recording error`: incorrect or missed request parameters

* **Waiting** ![Status: Waiting][img-status-waiting]      
        
    The baseline request is queued for testing. Only a limited number of requests can be tested simultaneously. 
            
* **Interrupted** ![Status: Interrupted][img-status-interrupted]
        
    The testing process was either interrupted by the **Interrupt testing** button or another test run was executed on the same FAST node.

## Checking the State Using API Method

!!! info "Necessary data"
    To proceed with the steps described below, the following pieces of data are required:
    
    * a token
    * a test run identifier
    
    You can get detailed information about test run and token [here][doc-about-tr-token].
    
    The following values are used as example values in this document:

    * `token_Qwe12345` as a token.
    * `tr_1234` as an identifier of a test run.


!!! info "How to choose the right period of time to perform check of a test run"
    You can check the state of the test run in the pre-defined period of time (e.g., 15 seconds). Alternatively, you can employ the estimated time of completion for a test run to determine when the next check is to be done. You can obtain this estimate while checking the state of a test run. [See details below.][anchor-testrun-estimates]

To perform a single check of the test run state, send the GET request to the URL `https://us1.api.wallarm.com/v1/test_run/test_run_id`:

--8<-- "../include/fast/operations/api-check-testrun-status.md"

If the request to the API server is successful, you are presented with the server’s response. The response provides a lot of useful information, including:

* `vulns`: an array that contains information about the detected vulnerabilities in the target application. Each of the vulnerability records holds the following data regarding the certain vulnerability:
    * `id`: an identifier of the vulnerability.
    
    * `threat`: the number in the range from 1 to 100, that describes the threat level for the vulnerability. The higher the level, the more severe the vulnerability.
    * `code`: a code assigned to the vulnerability.

    * `type`: the vulnerability type. The parameter can take one of the values which are described [here][link-vuln-list].
    
* `state`: the test run’s state. The parameter can take one of the following values:
    * `cloning`: cloning of the baseline requests is in progress (when [creating a copy][doc-testrun-copying] of a test run).
    * `running`: the test run is running and executing.
    * `paused`: the test run execution is paused.
    * `interrupted`: the test run execution is interrupted (e.g. a new test run for the FAST node was created while the current test run was being conducted by this node).
    * `passed`: the test run execution has completed successfully (no vulnerabilities were found).
    * `failed`: the test run execution has completed unsuccessfully (some vulnerabilities were found).
    
* `baseline_check_all_terminated_count`: the number of baseline requests for which all of the test request checks are completed.
    
* `baseline_check_fail_count`: the number of baseline requests for which some of the test request checks are failed (in other words, FAST found a vulnerability).
    
* `baseline_check_tech_fail_count`: the number of baseline requests for which some of the test request checks are failed due to the technical issues (e.g. if the target application was unavailable for some period of time).
    
* `baseline_check_passed_count`: the number of baseline requests for which all of the test request checks are passed (in other words, FAST did not find a vulnerability). 
    
* `baseline_check_running_count`: the number of baseline requests for which the test request checks are still in progress.
    
* `baseline_check_interrupted_count`: the number of baseline requests for which all of the test request checks were interrupted (e.g. due to interruption of the test run)
    
* `sended_requests_count`: the total number of test requests that were sent to the target application.
    
* `start_time` and `end_time`: time when the test run started and ended, respectively. The time is specified in the UNIX time format.
    
* `domains`: the list of the target application’s domain names the baseline requests were targeted to. 
    
* `baseline_count`: the number of recorded baseline requests.
    
* `baseline_check_waiting_count`: the number of baseline requests that are waiting to be checked;

* `planing_requests_count`: the total number of test requests that are queued to be sent to the target application.

###  Estimates of test run's execution speed and time to completion

There is a separate group of parameters in the API server's response, that allows you to estimate a test run's execution speed and time to completion. The group comprises the following parameters:

* `current_rps`—the current speed with which FAST sends requests to the target application (in the moment of obtaining the test run's state).

    This value is the average requests per second (RPS). This average RPS is calculated as the number of requests FAST sent to the target application in the 10 second interval before the test run's state was acquired. 

    **Example:**
    If the test run's state is acquired in 12:03:01 that the `current_rps` parameter's value is calculated as *(the number of requests sent in [12:02:51-12:03:01] time interval)/10*.

* `avg_rps`—the average speed with which FAST sends requests to the target application (in the moment of obtaining the test run's state).

    This value is the average number of requests per second (RPS) that FAST sent to the target application in *the whole test run's execution time*:

    * From the start of the test run's execution to the current moment of time if the test run is still executing (which is equal to `current time`-`start_time`).
    * From the start of the test run's execution to the end of the test run's execution if the test run's execution is complete (which is equal to `end_time`-`start_time`).

        The value of the `avg_rps` parameter is calculated as *(`sended_requests_count`/(the whole test run's execution time))*.
    
* `estimated_time_to_completion`—the amount of time (in seconds) after which test run's execution is likely to be completed (in the moment of obtaining the test run's state). 

    The parameter's value is `null` if:
    
    * There are no vulnerability checks in progress yet (e.g., there are no baseline requests recorded for the newly created test run so far).
    * Test run is not executing (i.e., it is in any state, excluding `"state":"running"`).

    The value of the `estimated_time_to_completion` parameter is calculated as *(`planing_requests_count`/`current_rps`)*.
    
!!! warning "The possible values of the parameters related to test run's execution speed and time estimates"
    The aforementioned parameters' values are `null` in the first 10 seconds of a test run's execution.

You can employ the `estimated_time_to_completion` parameter's value to determine when the next test run's state check is to be done. Note that the value may either increase or decrease.

**Example:**

To check a test run's state in an `estimated_time_to_completion` period of time, do the following:

1.  After the test run's execution begins, acquire the test run's state several times. For example, you can do it in the 10 seconds interval. Continue to do so until the `estimated_time_to_completion` parameter's value is not `null`.

2.  Perform the next checking of the test run's state after the `estimated_time_to_completion` seconds.

3.  Repeat the previous step until the test run's execution is complete.

!!! info "The graphical representation of the estimates"
    You can obtain the estimates' values by using the Wallarm web interface as well.
    
    To do so, log in to the Wallarm portal and navigate to [the list of test runs][link-wl-portal-testruns-in-progress] which are executing now:
    
    ![Test run's speed and execution time estimates][img-testrun-velocity]
    
    When the test run's execution is complete, you are presented with the average requests per second value:
    
    ![Average requests per second value][img-testrun-avg-rps]
