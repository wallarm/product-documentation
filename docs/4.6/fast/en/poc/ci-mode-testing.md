[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2--create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-waiting-for-tests]:            waiting-for-tests.md
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general
[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode
[anchor-testing-variables]:         #environment-variables-in-testing-mode
[anchor-stopping-fast-node]:        ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode

#  Running a FAST Node in Testing Mode

While in testing mode, the FAST node creates a test run based on the test record that was populated from baseline requests in recording mode and executes the security test set for the target application.

>   #### Info:: Chapter Prerequisites
>   
>   To follow the steps described in this chapter, you need to obtain a [token][doc-get-token].
>   
>   The following values are used as examples throughout this chapter:
>   *   `tr_1234` as an identifier of a test run
>   *   `rec_0001` as an identifier of a test record
>   *   `bl_7777` as an identifier of a baseline request

<!-- -->

>   #### Info:: Install `docker-compose`
>   
>   The [`docker-compose`][link-docker-compose] tool will be used throughout this chapter to demonstrate how the FAST node operates in the testing mode.
>   
>   The installation instructions for this tool are available [here][link-docker-compose-install].


## Environment Variables in Testing Mode

FAST node configuration is done via environment variables. The table below holds all environment variables that can be used to configure a FAST node in testing mode.

| Environment Variable   | Value  | Required? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| The token for a node. | Yes |
| `WALLARM_API_HOST`   	| The domain name of the Wallarm API server to use. <br>Allowed values: <br>`us1.api.wallarm.com` for use with the US cloud;<br>`api.wallarm.com` for use with the EU cloud.| Yes |
| `CI_MODE`            	| The FAST node's operation mode. <br>Required value: `testing`. | Yes |
| `WORKERS` | The number of concurrent threads that work with multiple baseline requests in a parallel fashion.<br>Default value: `10`.| No |
| `TEST_RECORD_ID` | The identifier of a test record.<br>Default: empty value. | No |
| `TEST_RUN_NAME` | The name of the test run.<br>The default value is in a similar format: “TestRun Sep 24 12:31 UTC”. | No |
| `TEST_RUN_DESC` | The description of the test run.<br>The default value: empty string. | No |
| `TEST_RUN_POLICY_ID` | The identifier of the test policy.<br>If the parameter is missing, then the default policy takes action. | No |
| `TEST_RUN_RPS` | The parameter specifies a limit on the number of test requests (*RPS*, *requests per second*) to be sent to the target application during test run execution.<br>Allowed value range: from 1 to 1000 (requests per second)<br>Default value: unlimited. | No |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | This parameter specifies FAST’s behavior when a vulnerability is detected:<br>`true`: stops the execution of the test run on the first detected vulnerability.<br>`false`: processes all the baseline requests regardless of whether any vulnerability is detected.<br>Default value: `false`. | No |
| `TEST_RUN_URI` | A URI of the target application.<br>The IP address of the target application may change during the CI/CD process, so you can use the application URI. <br>For example, the URI of the application deployed via `docker-compose` can look like `http://app-test:3000`.  | No |
| `BUILD_ID` | The identifier of a CI/CD workflow. This identifier allows several FAST nodes to work concurrently using the same cloud FAST node. See [this][doc-concurrent-pipelines] document for details.| No |
| `FILE_EXTENSIONS_TO_EXCLUDE` | The list of static file extensions that should be excluded from the evaluation process during testing.<br>You can enumerate these extensions using the <code>&#124;</code> character: <br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | No |
| `PROCESSES`            | The number of processes that can be used by FAST node. Each process uses the number of threads specified in the `WORKERS` variable.<br>Default number of processes: `1`.<br>Special value: `auto` equal to half of the CPU number calculated using the [nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation) command. | No |

<!-- -->

>   #### Info:: See also:
>   
>   The descriptions of the environment variables that are not specific to a certain FAST node operation mode are available [here][doc-env-variables].

<!-- -->

## Acquiring a Test Policy Identifier

If you plan to employ your own [test policy][doc-testpolicy], then [create one][link-wl-portal-new-policy] in the Wallarm cloud. Later, pass the identifier to the FAST node's Docker container via the `TEST_RUN_POLICY_ID` environment variable when running the FAST node in testing mode. 

Otherwise, if you choose to use the default test policy, then do not set the `TEST_RUN_POLICY_ID` environment variable for the container.

>   #### Info:: How to Create a Test Policy
>   
>   The “Quick Start” guide contains [step-by-step instructions][doc-testpolicy-creation-example] on how to create a sample test policy.

## Obtaining a test record identifier
 
To use a specific test record in testing mode, you can pass the test record's identifier to the FAST node using the [`TEST_RECORD_ID`][anchor-testing-variables] parameter.
Thus, there is no need to run the FAST node in the recording mode first. Rather, you can use a pre-formed test record to perform the same security tests several times in different nodes and test runs.
 
You can get the identifier of the test record in the Wallarm portal interface or from the FAST node log in the testing mode.
If you do not use the `TEST_RECORD_ID` parameter, then the FAST node will use the last test record of the node.

## Deployment of a FAST Node in the Testing Mode

The `docker-compose.yaml` file that was created earlier is suitable for running a FAST node in testing mode.
To do so, it is necessary to alter the `CI_MODE` environment variable's value to the `testing` one.

You either can change the variable's value by modifying it in the `docker-compose.yaml` file or passing the environment variable with the required value to the Docker container via the `-e` option of the `docker-compose run` command:

```
docker-compose run --rm -e CI_MODE=testing fast
```

> #### Info:: Getting the report about the test
> To get the report with the test results, mount the directory to download the report via the `-v {DIRECTORY_FOR_REPORTS}:/opt/reports/` option when deploying the FAST node Docker container. 
> 
> When security testing is finished, you will find the brief `<TEST RUN NAME>.<UNIX TIME>.txt` report and the detailed `<TEST RUN NAME>.<UNIX TIME>.json` report in the `{DIRECTORY_FOR_REPORTS}` directory.

<!-- -->

>   #### Info:: Options of the `docker-compose` command
>   
>   You can pass any of the environment variables described above to a FAST node Docker container via the `-e` option. 
>   
>   The `--rm` option is also used in the example above, so that the FAST node container will be automatically disposed of when the node is stopped.

If the command executes successfully, then a console output similar to the one shown here will be generated:

```
 __      __    _ _
 \ \    / /_ _| | |__ _ _ _ _ __
  \ \/\/ / _` | | / _` | '_| '  \
   \_/\_/\__,_|_|_\__,_|_| |_|_|_|
            ___ _   ___ _____
           | __/_\ / __|_   _|
           | _/ _ \\__ \ | |
           |_/_/ \_\___/ |_|

Loading...
INFO synccloud[13]: Registered new instance 16dd487f-3d40-4834-xxxx-8ff17842d60b
INFO [1]: Loaded 0 custom extensions for fast scanner
INFO [1]: Loaded 44 default extensions for fast scanner
INFO [1]: Use TestRecord#rec_0001 for creating TestRun
INFO [1]: TestRun#tr_1234 created
```

This output informs us that the test record with the `rec_0001` identifier was used to create a test run with the `tr_1234` identifier, and this operation was completed successfully.

Next, security tests are created and executed by the FAST node for each baseline request in the test record that satisfies the test policy. The console output will contain similar messages to these:

```
INFO [1]: Running a test set for the baseline #bl_7777
INFO [1]: Test set for the baseline #bl_7777 is running
INFO [1]: Retrieving the baseline request Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Use TestPolicy with name 'Default Policy'
```

This output informs us that the test set is running for the baseline requests with the `bl_7777` identifier. Also, it tells us that the default test policy is being used due to a lack of the `TEST_RUN_POLICY_ID` environment variable.

## Stopping and Removing the Docker Container with the FAST Node in Testing Mode

Depending on the testing results obtained, FAST nodes can terminate in different ways.

If some vulnerabilities are detected in the target application, then the FAST node shows a message similar to this:

```
INFO [1]: Found 4 vulnerabilities, marking the test set for baseline #bl_7777 as failed
ERROR [1]: TestRun#tr_1234 failed
```

In this case, four vulnerabilities were found. A test set for the baseline with the `bl_7777` identifier is considered failed. The corresponding test run with the `tr_1234` identifier is also marked as failed.

If no vulnerabilities are detected in the target application, the FAST node shows a message similar to this:

```
INFO [1]: No issues found. Test set for baseline #bl_7777 passed.
INFO [1]: TestRun#tr_1234 passed
```

In this case, the test run with the `tr_1234` identifier is considered passed.

>   #### Warning:: About Security Test Sets
>   
>   Note that the above examples do not imply that only one test set was executed. A test set is formed for each baseline request that complies with the FAST test policy.
>   
>   A single test-set-related message is shown here for demonstration purposes.

After the FAST node has finished the testing process, it terminates and returns an exit code to the process that runs as part of a CI/CD job. 
* If security test status is “passed” and the FAST node encounters no errors during testing process, then the `0` exit code is returned. 
* Otherwise, if security tests do fail or the FAST node encounters some errors during testing process, then the `1` exit code is returned.

The FAST node container in testing mode will stop automatically after security testing is complete. Nonetheless, a CI/CD tool can still be in control of the node and its container lifecycle by the means [described earlier][anchor-stopping-fast-node].

In the [example above][anchor-testing-mode] the FAST node container ran with the `--rm` option. This means the stopped container is automatically removed.