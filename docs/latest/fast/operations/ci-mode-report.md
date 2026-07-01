[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# Getting the Report with Test Results

The FAST node allows you to get test results in TXT and JSON formats:

* The TXT file contains brief test results — baseline statistics and detected vulnerabilities list.
* The JSON file contains detailed test results — details on the security test and basic requests, as well as the detected vulnerabilities list. JSON file content corresponds to the data provided on your Wallarm account > **Test runs**.

To get the report, select the report generation method and follow the instructions below:

* [Running FAST node in report mode][anchor-report-mode]
* [Running FAST node in testing mode with the option to download a report][doc-ci-mode-testing-report]

## Running FAST Node in Report Mode

To run FAST node in report mode, perform the following steps when [deploying the Docker container][deploy-docker-with-fast-node]:

<ol start="1"><li>Set environment variables:</li></ol>

| Variable           	| Description 	| Required 	|
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| A [token][doc-get-token] from the Wallarm cloud. | Yes |
| `WALLARM_API_HOST`   	| The address of the Wallarm API server. <br>Allowed values: <br>`us1.api.wallarm.com` for the server in the Wallarm US cloud and <br>`api.wallarm.com` for the server in the Wallarm EU cloud.| Yes |
| `CI_MODE`            	| The FAST node's operation mode.<br>Must be `report`. | Yes |
| `TEST_RUN_ID`      	| The test run ID needed to get the report.<br>The ID is displayed on your Wallarm account > **Test runs** and in logs of running the FAST node in testing mode.<br>By default, ID of the last test run is used. | No |

<ol start="2"><li>Pass the path to the folder for reports via the  <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code> option.</li></ol>

**Example of the command to run the FAST node Docker container in report mode:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## Getting the Report

If the command was successfully executed, you will get brief data about the test run in the terminal:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

When the report generation is finished, you will find the following files with reports in the `DIRECTORY_FOR_REPORTS` folder:

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`