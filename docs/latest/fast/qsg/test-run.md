[img-fast-node-internals]: ../../images/fast/qsg/en/test-run/18-qsg-fast-test-run-proxy-internals.png
[img-view-recording-cloud]: ../../images/fast/qsg/common/test-run/20-qsg-fast-test-run-baselines-recording.png
[img-request-exec-result]:  ../../images/fast/qsg/common/test-run/22-qsg-fast-test-run-gruyere-request.png
[img-incoming-baselines]:   ../../images/fast/qsg/common/test-run/23-qsg-fast-test-run-processing.png    
[img-xss-found]:            ../../images/fast/qsg/common/test-run/24-qsg-fast-test-run-vuln.png


[link-deployment]:          deployment.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-previous-chapter]:    test-preparation.md
[link-create-tr-gui]:       ../operations/create-testrun.md#creating-a-test-run-via-web-interface

[anchor1]:  #1-create-and-run-the-test-run  
[anchor2]:  #2-execute-the-https-baseline-request-you-created-earlier 

    
    
#   Running the test

This chapter will guide you through the process of generating and executing a security test set. The test set will be constructed using the test policy and baseline request you created [earlier][link-previous-chapter]. Upon the completion of all necessary steps, you will find an XSS vulnerability as a result of your testing.

To begin application security testing, a test run should be created. *Test run* describes a one-time vulnerability testing process. Each test run has a unique identifier, which is crucial for correct FAST operation. When you create a test run, a test run ID and test policy are sent to the FAST node. Then the security testing process is started on the node.

FAST generates and executes a security test set in the following way:

1.  The node transparently proxies all the incoming requests until the test policy and the test run ID are sent to it.

2.  Given that the test run is created and run, the FAST node will receive the test policy and the test run ID from the Wallarm cloud.

3.  If the node receives a baseline request to the target application, then:
    1.  The node marks the incoming request with the test run ID
    2.  The marked request is saved to the Wallarm cloud
    3.  The initial baseline request is sent to the target application unmodified
    
    !!! info "The baseline requests recording process"
        This process is often referred to as baseline requests recording. You could stop the recording either from the web interface of the cloud or by making an API call to the Wallarm API. The node will continue sending initial baselines to the target application.
    
    The baseline recording begins if the node receives the test policy and the test run ID first.
    
    The FAST node determines if a request is a baseline one by examining the `ALLOWED_HOSTS` environment variable. This variable was set up during the FAST node [deployment process][link-deployment]. If the request’s target domain is allowed by the variable, then the request is considered baseline. If you have followed the guide, all the requests to the `google-gruyere.appspot.com` domain would be considered baseline.
    
    All the other requests that are not targeted to the application are transparently proxied without any modifications.

4.  The FAST node fetches all the recorded baseline requests from the Wallarm cloud based on test run ID.

5.  The FAST node generates security tests for each baseline request using the test policy received from the cloud.

6.  A generated security test set is executed by sending the requests to the target application from the node. Testing results are associated with the test run ID and stored in the cloud.

    ![FAST node internal logic][img-fast-node-internals]

    !!! info "Note on a test run in use"
        In any given period of time, only one test run can be running on the FAST node. If you create another test run for the same node, the current test run execution is interrupted.
       
To start the security test set generation and execution process, do the following:

1.  [Create and run the test run][anchor1]
2.  [Execute the HTTPS baseline request you created earlier][anchor2]
    
##  1.  Create and run the test run  

Create a test run via Wallarm account web interface following the [instructions][link-create-tr-gui].

After following the instruction, set the following basic parameters when creating a test run:

* test run name: `DEMO TEST RUN`;
* test policy: `DEMO POLICY`;
* FAST node: `DEMO NODE`.

These instructions do not contain advanced settings.

After the test run is saved, its ID will be automatically passed to FAST node. In the “Testruns” tab you will see the created test run with a blinking red dot indicator. This indicator means that baseline requests for the test run are being recorded.

You can click on the “Baseline req.” column to see all the baseline requests that are being recorded.

![Viewing recorded baseline requests][img-view-recording-cloud]

!!! info "The node readiness for the recording"
    You should wait until you see the console output signalling that the FAST node named `DEMO NODE` is ready to record baseline requests for the test run named `DEMO TEST RUN`
    
    If the node is ready to record the baseline request, you will see a similar message in the console output:
    
    `[info] Recording baselines for TestRun#N ‘DEMO TEST RUN’`
    
    The node will be able to generate a security test set based on the baseline requests only after this message is shown.	

It is observable from the console output that the FAST node named `DEMO NODE` is ready for recording baseline requests for the test run named `DEMO TEST RUN`:

--8<-- "../include/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
##  2.  Execute the HTTPS baseline request you created earlier

To do that, navigate to the link you [created][link-previous-chapter] using the pre-configured Mozilla Firefox browser.

!!! info "Example of a link"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

The result of the request execution is shown below:

![The result of the request execution][img-request-exec-result]

It is observable from the console output that the FAST node has recorded a baseline request:

--8<-- "../include/fast/console-include/qsg/fast-node-testing.md"

You can observe some baseline requests being saved to the Wallarm cloud:

![Incoming baseline requests][img-incoming-baselines]

This document suggests that only one request be executed for demonstration purposes. Given that there are no additional requests to the target application, stop the baseline recording process by selecting the **Stop recording** option from the “Actions” drop-down menu.

!!! info "Controlling the test run execution process"
    A security test set was generated quite fast for the test run you created. However, the process could take a significant amount of time, depending on the number of baseline requests, the test policy in use, and the responsiveness of the target application. You could pause or stop the testing process by selecting an appropriate option from the “Actions” drop-down menu.

The test run stops automatically when the testing process is finished, given that no baseline recording is in progress. Some brief information about the detected vulnerabilities will be displayed in the “Result” column. FAST should find some XSS vulnerabilities for the executed HTTPS request:

![The discovered vulnerability][img-xss-found]
    
Now, you should have all of the chapter goals completed, along with the result of testing the HTTPS request to the Google Gruyere application. The result shows three found XSS vulnerabilities.
    