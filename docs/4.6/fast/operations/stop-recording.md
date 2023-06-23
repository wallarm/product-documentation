[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   Stopping the Recording Process

!!! info "Necessary data"
    To stop recording via API, the following pieces of data are required:
    
    * a token
    * a test run identifier

    To stop recording via web interface, you need a Wallarrm account.
    
    You can get detailed information about test run and token [here][doc-about-tr-token].
    
    The following values are used as example values in this document:
        
    * `token_Qwe12345` as a token.
    * `tr_1234` as an identifier of a test run.

The need to stop baseline requests recording is described by the [link][link-stop-explained]. 

## Stopping the Recording Process via API

To stop the recording process, send the POST request to the URL `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop`:

--8<-- "../include/fast/operations/api-stop-recording.md"

If the request to the API server is successful, you are presented with the server’s response. The response provides useful information, including:
* the state of the recording process (the `recording` parameter’s value).
* the identifier of the corresponding test record (the `test_record_id` parameter).

If the parameter’s value is `false`, then the stop is successful.

If the stop is successful, it is possible to use the test record with the `test_record_id` identifier to [copy test runs][doc-testrun-copying-api].

## Stopping the Recording Process via Web Interface

To stop the recording process via the web interface, please follow the steps below:

1. Go to your Wallarm account > **Test runs** by [this link](https://my.wallarm.com/testing/testruns) for the EU cloud or by [this link](https://us1.my.wallarm.com/testing/testruns) for the US cloud.

2. Select the test run to stop recording for and open the action menu.

3. Select **Stop recording**.

    ![!Stopping the recording via web interface][img-stop-recording-item]

The REQ indicator to the left of the **Baseline req.** column will be switched off when the recording is stopped.

ID of the test record is displayed in the **Test record name/Test record ID** column.

If required, you can [copy this test run][doc-testrun-copying-gui] using the web interface and the new test will reuse the mentioned test record.