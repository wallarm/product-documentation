[img-dashboard]:            ../../images/fast/qsg/common/test-interpretation/25-qsg-fast-test-int-dashboard.png
[img-testrun]:              ../../images/fast/qsg/common/test-interpretation/27-qsg-fast-test-int-testrun-screen.png
[img-test-run-expanded]:    ../../images/fast/qsg/common/test-interpretation/28-qsg-fast-testrun-opened.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-testrun-expanded]:     ../../images/fast/qsg/common/test-interpretation/29-qsg-fast-test-int-testrun-expanded.png
[img-log]:                  ../../images/fast/qsg/common/test-interpretation/30-qsg-fast-test-int-testrun-log.png
[img-vuln-description]:     ../../images/fast/qsg/common/test-interpretation/31-qsg-fast-test-int-events-vuln-description.png     
[img-vuln-details]:         ../../images/fast/qsg/common/test-interpretation/32-qsg-fast-int-issue-details.png

[link-previous-chapter]:    test-run.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-how-to-search]:       https://docs.wallarm.com/en/user-en/use-search-en.html    

    
    
#   Interpreting the testing results

This chapter will provide you with an overview of test result interpreting tools on the [My Wallarm portal][link-wl-console]. Upon completion of this chapter, you will have obtained some additional information about the XSS vulnerability discovered in the [previous chapter][link-previous-chapter].

1.  Click the "Dashboards → FAST" tab to have a quick look at what is going on. The dashboard provides you with a summary of all the test runs and their statuses, along with vulnerability counts for a chosen period of time.

    ![Dashboard][img-dashboard]

    <!-- You can use an event search tool as well. To do that, select the “Events” tab, and enter the necessary request into the search box. Help is available through the link “How to search”, which is located near the search box.   -->

    <!-- See the [link][link-how-to-search] for more information about using the search tool. -->

2.  If you select the “Test runs” tab, you can observe the list of all the test runs along with some brief information about each of them, such as:

    * Test run status (in progress, successful, or failed)
    * If a baseline request recording is in progress
    * How many baseline requests were recorded
    * What vulnerabilities were found (if any)
    * The domain name of the target application
    * Where the test generation and execution process took place (node or cloud)

    ![Testruns][img-testrun]

3.  Explore a test run in detail by clicking on it:

    ![Test run expanded][img-test-run-expanded]

    You can obtain the following information from an expanded test run:

    * The number of processed baseline requests
    * The test run creation date
    * The test run duration
    * The number of requests that were sent to the target application
    * The status of the baseline requests testing process:

        * **Passed** ![Status: Passed][img-status-passed]
        
            No vulnerabilities were found for the given baseline request (it depends on the chosen test policy- if you choose another one, then some vulnerabilities might be found) or the test policy is not applicable to the request.
        
        * **Failed** ![Status: Failed][img-status-failed]  
        
            Vulnerabilities were found for the given baseline request.
            
        * **In progress** ![Status: In progress][img-status-inprogress]
              
            The baseline request is being tested for vulnerabilities.
            
        * **Error** ![Status: Error][img-status-error]  
            
            The testing process was stopped due to errors.
            
        * **Waiting** ![Status: Waiting][img-status-waiting]      
        
            The baseline request is queued for testing. Only a limited number of requests can be tested simultaneously. 
            
        * **Interrupted** ![Status: Interrupted][img-status-interrupted]
        
            The testing process was either interrupted manually («Actions» → «Interrupt») or another test run was executed on the same FAST node.   

4.  To explore a baseline request in detail, click on it:

    ![Test run expanded][img-testrun-expanded]
    
    For each individual baseline request the following information is provided:

    * Creation time
    * The number of test requests that were generated and sent to the target application
    * The test policy in use
    * The request processing status

5.  To view the full log of the request processing, select the “Details” link on the very right:

    ![Request processing log][img-log]

6.  To obtain an overview of vulnerabilities found, click on the “Issue” link:

    ![Vulnerabilities brief description][img-vuln-description]

    To explore a vulnerability in detail, click on the vulnerability description:

    ![Vulnerability details][img-vuln-details]
            
Now, you should be familiar with the tools that help you to interpret the testing results.
