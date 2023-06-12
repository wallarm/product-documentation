[img-quick-help-howto]:     ../../images/onboarding/common/1-quick-help.png
[img-fast-5mins-button]:    ../../images/onboarding/common/2-fast-in-5mins.png
[img-intro]:                ../../images/onboarding/common/3-intro.png
[img-deploy]:               ../../images/onboarding/common/4-deploy.png
[img-cont-deployed]:        ../../images/onboarding/common/5-cont-deployed.png
[img-ff-proxy-settings]:    ../../images/onboarding/common/6-ff-proxy.png
[img-create-testrun]:       ../../images/onboarding/common/7-create-testrun.png
[img-recording]:            ../../images/onboarding/common/8-check-recording.png
[img-http-request]:         ../../images/onboarding/common/9-request.png
[img-gruyere-app]:          ../../images/onboarding/common/10-gruyere-app.png
[img-stop-recording]:       ../../images/onboarding/common/11-stop-recording.png
[img-results]:              ../../images/onboarding/common/12-detected-vuln.png
[img-detailed-results]:     ../../images/onboarding/common/13-vuln-details.png
[img-finish]:               ../../images/onboarding/common/14-finish.png

[link-wl-portal]:           https://us1.my.wallarm.com
[link-docker-install-docs]: https://docs.docker.com/install/overview/
[link-firefox-proxy]:       https://support.mozilla.org/en-US/kb/connection-settings-firefox
[link-gruyere-app]:         http://google-gruyere.appspot.com/
[link-qsg]:                 ../qsg/deployment-options.md

#   FAST Onboarding

 --8<-- "../include/fast/cloud-note.md"

 On your very first login to a [Wallarm portal][link-wl-portal] you will have the opportunity to gain familiarity with FAST by taking a five-step onboarding process.

!!! info "Controlling the onboarding process"
    You can stop the onboarding process by clicking the ✕ button in the onboarding panel at any time.
    
    You will be presented with the option to either skip the onboarding completely or resume the process later from the step you are on.
    
    If you have skipped the onboarding and wish to start it, press the question mark in the top right corner of the Wallarm portal and choose the “FAST in 5 minutes” item in the opened sidebar:            
    
    ![“The Quick Help” button][img-quick-help-howto]
    
    If you want to resume the onboarding process you delayed earlier, then click on the “FAST in 5 minutes” button in the bottom right corner of the Wallarm portal:
    
    ![The “FAST in 5 minutes” button][img-fast-5mins-button]

To get a quick introduction to FAST, do the following:
1.  Read about the FAST solution.
    
    ![A general information about the FAST solution][img-intro]
    
    Click the “Deploy FAST Node →” button to go to the next step.
    
2.  Deploy a Docker container with the FAST node on your machine. To do so, copy and execute the `docker run` command shown to you in this step. The command is already filled in with all necessary parameters.
    
    ![The deployment hint][img-deploy]
    
    !!! info "Installing Docker"
        If you do not have Docker, then [install it][link-docker-install-docs]. Either Docker edition is considered suitable—Community Edition or Enterprise Edition.
    
    FAST node will listen to incoming connections on `127.0.0.1:8080` after it starts.
    
    ![The deployed FAST node][img-cont-deployed]

    Configure a browser on your machine to use `127.0.0.1:8080` as its HTTP proxy. You may use any browser except the one the Wallarm portal is opened in. We recommend Mozilla Firefox (see the [instructions][link-firefox-proxy] on how to configure Firefox to use proxy).
    
    ![The proxy settings in Mozilla Firefox][img-ff-proxy-settings]
    
    !!! info "Using a different port number"
        If you do not want to provide the `8080` port  to the FAST node (e.g., there is another service listening on that port), you can set another port number to be used by FAST. To do so, pass the desired port number via the `-p` parameter of the `docker run` command. For example, to use port `9090` you would write the following: `-p 9090:8080`.
    
    Click the “Create a Test Run →” button to go to the next step.
    
    !!! info "Returning to the previous step"
        Note that you can always go back to the previous step by clicking the button with the previous step’s name (e.g., “← Understanding FAST”).
   
3.  Create a test run by clicking the “Create test run” button. Select a name for the test run and then choose the necessary test policy and node from the drop-down lists as stated in the onboarding hint:

    ![The creation of a test run][img-create-testrun]
    
    Press the “Create and run” button to complete the test run’s creation process.
    
    Click the “Discover Vulnerabilities →” button to go to the next step.
    
4.  Make sure that the `Recording baselines for TestRun...` message is displayed in the FAST node’s console:
    
    ![The FAST node's console][img-recording]
    
    Then send a request to the vulnerable application named [Google Gruyere][link-gruyere-app] to begin the process of testing for vulnerabilities with FAST.
    
    To do so, copy the HTTP request that is provided in the onboarding hint, paste it to the address bar of the browser that you earlier set up to use FAST node as a proxy, and execute the request:
    
    ![The HTTP request in the hint][img-http-request]
    
    ![The execution of the HTTP request][img-gruyere-app]
    
    After the request is sent, stop the request recording process by selecting the “Stop recording” entry in the “Actions” drop-down menu. Confirm the action by pressing the “Yes” button:
    
    ![Stopping the request recording process][img-stop-recording]
    
    Wait until the testing is complete. FAST should detect an XSS vulnerability in the Google Gruyere application. The vulnerability identifier and type should be displayed in the “Results” column of the test run:
    
    ![The result of testing][img-results]
    
    !!! info "Analyzing the vulnerability
        You can click on the value in the “Results” column of the test run to get some insights into the discovered vulnerability:
        
        ![The detailed information about the vulnerability][img-detailed-results]
    
    Click the “Run With It!” button to go to the next step.
    
5.  By this step, you have successfully familiarized yourself with FAST and discovered a vulnerability in a web application.
    
    ![The end of the onboarding process][img-finish]
    
    Navigate to the [“Quick Start guide”][link-qsg] to get more detailed information about how to start with FAST.
    
    Click the “Finish” button to complete the onboarding process.
    
    !!! info "Additional actions to take
        You can shut down the FAST node’s Docker container and disable proxying in the browser upon successful detection of the vulnerability.
