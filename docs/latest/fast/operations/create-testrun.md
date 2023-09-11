[img-test-run-creation]:            ../../images/fast/operations/common/create-testrun/test-run-create.png
[img-testrun-adv-settings]:         ../../images/fast/operations/common/create-testrun/test-run-settings.png

[doc-token-information]:    internals.md#token
[doc-state-description]:    check-testrun-status.md
[doc-copying-testrun]:      copy-testrun.md
[doc-testrecord]:           internals.md#test-record

[link-stopping-recording-chapter]:  stop-recording.md
[link-create-policy]:               test-policy/general.md
[link-create-node]:                 create-node.md
[doc-inactivity-timeout]:           internals.md#test-run

#   Creating a Test Run

!!! info "Necessary data"
    To create a test run via API methods, you need a token.
    
    To create a test run via the web interface, you need a Wallarm account.
    
    You can get detailed information about token [here][doc-token-information].
    
    The `token_Qwe12345` value is used as an example token in this document.

When a test run is being created, a new [test record][doc-testrecord] is created as well.

This way of test run creation is to be used if it is required to test a target application along with recording of baseline requests.

## Creating a Test Run via API

To create a test run, send the POST request to the URL `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include/fast/operations/api-create-testrun.md"

If the request to the API server is successful, you are presented with the server’s response. The response provides useful information, including:

1.  `id`: the identifier of a newly created test run (e.g., `tr_1234`).
    
    You will need the id parameter value to perform the following actions, required to integrate FAST into CI/CD:
    
    1.  Checking for the FAST node to start the recording process.  
    2.  Stopping the baseline requests recording process.
    3.  Waiting for the FAST security tests to finish.
    
2.  `state`: the state of the test run.
    
    A newly created test run is in the `running` state.
    A comprehensive description of all the values of the `state` parameter can be found [here][doc-state-description].
    
3.  `test_record_id`: the identifier of a newly created test record (e.g., `rec_0001`). All baseline requests will be placed into this test record.    

##  Creating a Test Run via Web Interface
      
To create a test run via your Wallarm account interface, follow the steps below:

1. Go to your Wallarm account > **Test runs** by [this link](https://my.wallarm.com/testing/testruns) for the EU cloud or by [this link](https://us1.my.wallarm.com/testing/testruns) for the US cloud.

2. Click the **Create test run** button.

3. Enter the name of your test run.

4. Select the test policy from the **Test policy** drop-down list. To create a new test policy, please follow this [instructions][link-create-policy]. Also, you can use the default policy.

5. Select FAST node from the **Node** drop-down list. To create FAST node, please follow this [instruction][link-create-node].

    ![Creating test run][img-test-run-creation]

6. Add **Advanced settings** if required. This block of settings includes the following points:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![Test run advanced settings][img-testrun-adv-settings]

7.  Click the **Create and run** button.

## Reusing test record

When the requests are sent from a requests source to the target application, and the [recording process is stopped][link-stopping-recording-chapter], it is possible to [reuse the test record][doc-copying-testrun] with other test runs.