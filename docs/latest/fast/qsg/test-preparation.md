[img-test-scheme]:                  ../../images/fast/qsg/en/test-preparation/12-qsg-fast-test-prep-scheme.png
[img-google-gruyere-startpage]:     ../../images/fast/qsg/common/test-preparation/13-qsg-fast-test-prep-gruyere.png
[img-policy-screen]:                ../../images/fast/qsg/common/test-preparation/14-qsg-fast-test-prep-policy-screen.png
[img-wizard-general]:               ../../images/fast/qsg/common/test-preparation/15-qsg-fast-test-prep-policy-wizard-general.png
[img-wizard-insertion-points]:      ../../images/fast/qsg/common/test-preparation/16-qsg-fast-test-prep-policy-wizard-ins-points.png

[link-previous-chapter]:            deployment.md
[link-https-google-gruyere]:        https://google-gruyere.appspot.com
[link-https-google-gruyere-start]:  https://google-gruyere.appspot.com/start
[link-wl-console]:                  https://us1.my.wallarm.com

[doc-policy-in-detail]:             ../operations/test-policy/overview.md

[gl-element]:                       ../terms-glossary.md#baseline-request-element
[gl-testpolicy]:                    ../terms-glossary.md#test-policy

[anchor1]:  #1-prepare-the-baseline-request                       
[anchor2]:  #2-create-a-test-policy-targeted-at-xss-vulnerabilities
    
    
#   Setting the environment for testing

This chapter will guide you through the process of configuring FAST to detect XSS vulnerabilities in the Google Gruyere application. Upon completion of all necessary steps, you will be ready to proxy an HTTPS baseline request through the FAST node in order to find XSS vulnerabilities.

To generate a security test set, Wallarm FAST requires the following:
* A deployed FAST node, proxying baseline requests
* A connection of the FAST node to the Wallarm cloud 
* A baseline request
* A test policy

You have successfully deployed a FAST node and connected it to the cloud in the [previous chapter][link-previous-chapter]. In this chapter you will focus on creating a [test policy][gl-testpolicy] and a baseline request.

![The test scheme in use][img-test-scheme]

!!! info "Creating a test policy"
    It is strongly recommended that you create a dedicated policy for each target application under the test. However, you could make use of the default policy that is automatically created by the Wallarm cloud. This document will guide you through the process of creating a dedicated policy, while the default policy is beyond the scope of this guide.
    
To set the environment for testing, do the following:

1.  [Prepare the baseline request][anchor1]
2.  [Create the test policy targeted at XSS vulnerabilities][anchor2]
    
!!! info "Target application"
    The current example uses [Google Gruyere][link-https-google-gruyere] as the target application. If you construct the baseline request to your local application, please use the IP address of the machine running this application instead of Google Gruyere address.
    
    To get the IP address, you can use tools like `ifconfig` or `ip addr`.
        
##  1.  Prepare the baseline request

1.  Provided baseline request is targeted to the [Google Gruyere][link-https-google-gruyere] application, you should create a sandboxed instance of the application first. Then you should obtain a unique identifier of the instance.
    
    To do that, navigate to this [link][link-https-google-gruyere-start]. You will be given the identifier of the Google Gruyere instance, which you should copy. Read the terms of service and select the **Agree & Start** button.
    
    ![Google Gruyere start page][img-google-gruyere-startpage]

    The isolated Google Gruyere instance will be run. It will be made accessible to you by the following address:
    
    `https://google-gruyere.appspot.com/<your instance ID>/`

2.  Construct the baseline request to your instance of the Google Gruyere application.     It is suggested in the guide that you use a legitimate request.

    The request is as follows:

    ```
    https://google-gruyere.appspot.com/<your instance ID>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "Example of a request"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  Create a test policy targeted at XSS vulnerabilities

1.  Log in to the [My Wallarm portal][link-wl-console] using the account you created [earlier][link-previous-chapter].

2.  Select the “Test policies” tab and click the **Create test policy** button.

    ![Test policy creation][img-policy-screen]

3.  In the “General” tab set a meaningful name and description for the policy. It is suggested in this guide that you use the name `DEMO POLICY`. 

    ![Test policy wizard: the “General” tab.][img-wizard-general]

4.  In the “Insertion points” tab set the [baseline request elements][gl-element] that are eligible for processing during the process of security test set requests generation. It is are sufficient for the purposes of this guide to allow the processing of all GET parameters. To allow this, please add the `GET_.*` expression in the “Where to include” block. When creating a policy, FAST allows processing of some parameters by default. You can delete them using the «—» symbol.

    ![Test policy wizard: the “Insertion points” tab.][img-wizard-insertion-points]

5.  In the “Attacks to test” tab select one type of attack to exploit the vulnerability in the target application — XSS.

6.  Make sure that the policy preview in the column on the very right looks as follows:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  Select the **Save** button to save the policy.

8.  Return to the test policy list by selecting the **Back to test policies** button.
    
    
!!! info "Test policy details"
    Detailed information about test policies is available by the [link][doc-policy-in-detail].

Now you should have all of the chapter goals completed, with the HTTPS baseline request to the Google Gruyere application and the test policy targeted at XSS vulnerabilities.    
