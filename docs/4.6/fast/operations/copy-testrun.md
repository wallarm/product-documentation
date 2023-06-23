[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

#   Copying a Test Run

!!! info "Necessary Data"
    To copy a test run via an API call, the following pieces of data are required:
    
    * a token
    * an existing test record identifier

    To copy a test run via a web interface, a Wallarm account is required.

    You can get detailed information about token and test records [here][doc-tr-information].
    
    The following values are used as examples in this document:

    * `token_Qwe12345` as a token.
    * `rec_0001` as a test record.

When a test run is being copied, an existing [test record][doc-testrecord] is reused.

This method of test run creation should be used if it is necessary to test a target application using already recorded baseline requests.


##  Rules of Test Run Copying

The things to be taken into account when copying a test run are:
* You can specify any test policy to be used by a copied test run. This policy may differ from the policy used in the original test run.
* You can copy test runs in the following states: `failed`, `interrupted`, `passed`, `paused`, `running`. Descriptions of these test run states are given [here][doc-state-description]. 
* It is not possible to copy a test run using an empty test record with no baseline requests in it.
* If some baseline requests are being recorded in a test record, this record cannot be used to copy a test run.
 
    If you try to copy a test run based on an unfinished test record, you will get the `400` error code (`Bad Request`) from the API server and an error message similar to the one below:

    ```
     {
       "status": 400,
       "body": {
         "test_record_id": {
         "error": "not_ready_for_cloning",
         "value": rec_0001
         }
       }
     }
     ```
    
    It is not possible to copy a test run from the web interface unless the recording process has been stopped.

##  Copying a Test Run via an API

To copy and execute a test run, send the POST request to the URL `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include/fast/operations/api-copy-testrun.md"

If the request to the API server is successful, you will be presented with the server’s response. The response provides useful information, including:

1.  `id`: the identifier of a test run's copy (e.g., `tr_1234`).
    
    You will need the `id` parameter value to control the test run execution status.
    
2.  `state`: the state of the test run.
    
    A newly copied test run is in the `running` state.
    
    A comprehensive description of all the values of the `state` parameter can be found [here][doc-state-description].

    
##  Copying a Test Run via Web Interface    

To copy and execute a test run via the Wallarm portal's web interface:
1.  Log in to the portal with your Wallarm account, then navigate to the “Test runs” tab.
2.  Select a test run to copy, then open the action menu on the right of the test run.
3.  Select the “Create similar testrun” menu entry. 

    ![!The “Create similar test run” menu entry][img-similar-tr-item]

4.  Select the following items in the opened sidebar:
    * the name of the test run's copy
    * the policy to use with the test run's copy
    * the node on which the test run's copy will be executed
    
    ![!The “Test run” sidebar][img-similar-tr-sidebar]
    
    You may configure additional settings by selecting “Advanced settings” (if necessary):
--8<-- "../include/fast/test-run-adv-settings.md"    
    
5.  Make sure that the “Use baselines from `<the name of the test record to reuse>`” option is checked.

    !!! info "Reusing a Test Record"
        Note that it is the test record name that is displayed in the option, not the test run name.
        
        A test record name is often omitted: for example, if [a test run is created][doc-create-testrun] without the `test_record_name` parameter specified, then the name of the test record is the same as the name of the test run.
        
        The figure above shows the copy dialogue that mentions a test record where the name is not equivalent to the name of the test run wthat made use of this test record in the past (the `MY TEST RECORD` test record was used by the `DEMO TEST RUN` test run). 

6.  Execute the test run by clicking on the “Create and run” button.    