[fast-node-token]:              ../operations/create-node.md
[fast-ci-mode-record]:          ci-mode-recording.md#environment-variables-in-recording-mode

[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

[jenkins-plugin-wallarm-fast]:   https://plugins.jenkins.io/wallarm-fast/

[jenkins-plugin-install]:       ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-install.png
[jenkins-plugin-record-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-record-params.png
[jenkins-plugin-playback-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-playback-params.png
[jenkins-manage-plugin]:        https://jenkins.io/doc/book/managing/plugins/
[fast-example-jenkins-plugin-result]:  ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-result.png
[fast-jenkins-cimode]:          examples/jenkins-cimode.md

# Integration of Wallarm FAST Plugin with Jenkins

!!! warning "Compatibility"
    Please note that the Wallarm FAST plugin only works with Freestyle Jenkins projects.
    
    If your project is a Pipeline type, then please check out the [example of integration with Jenkins via FAST node][fast-jenkins-cimode].

## Step 1: Installing Plugin

Install [Wallarm FAST plugin][jenkins-plugin-wallarm-fast] in the Jenkins project using Plugin Manager. There is more detailed information about managing plugins available in [Jenkins official documentation][jenkins-manage-plugin].

![Installation of Wallarm FAST plugin][jenkins-plugin-install]

If problems have been encountered during installation, then build the plugin manually.

??? info "Manual building of Wallarm FAST plugin"
    To build the Wallarm FAST plugin manually, follow the steps below:

    1. Make sure the [Maven](https://maven.apache.org/install.html) CLI is installed.
    2. Execute the following commands:
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        After successful execution of the commands, the `wallarm-fast.hpi` plugin file will be generated in the `target` directory.

    3. Install the `wallarm-fast.hpi` plugin using [Jenkins instructions](https://jenkins.io/doc/book/managing/plugins/#advanced-installation).

## Step 2: Adding Steps of Recording and Testing

!!! info "Configured workflow"
    Further instructions will require the configured Jenkins workflow to correspond to one of the following points:

    * Test automation must be implemented. In this case, the [request recording](#adding-the-step-of-request-recording) and [security testing](#adding-the-step-of-security-testing) steps will be added.
    * Set of baseline requests must be recorded. In this case, the [security testing](#adding-the-step-of-security-testing) step will be added.

### Adding the Step of Request Recording

To add the step of request recording, select the `Record baselines` mode on the **Build** tab and set up the variables described below. The step of request recording must be added **before the step of automated application testing**.

!!! warning "Network"
    Before recording requests, make sure that the FAST plugin and tool for automated testing are on the same network.

??? info "Variables in the recording mode"

    | Variable              | Value  | Required   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | A token from the Wallarm cloud. | Yes |
    | `Wallarm API host`      | The address of the Wallarm API server. <br>Allowed values: <br>`us1.api.wallarm.com` for the server in the Wallarm US cloud and <br>`api.wallarm.com` for the server in the Wallarm EU cloud.<br>Default value is `us1.api.wallarm.com`. | No |
    | `Application host`      | The address of the test application. The value can be an IP address or a domain name. | Yes |
    | `Application port`      | The port of the test application. Default value is 8080. | No |
    | `Fast port`   | The port of FAST node. | Yes |
    | `Inactivity timeout`    | If no baseline requests arrive to the FAST node within this interval, then the recording process is stopped along with the FAST node.<br>Allowed value range: from 1 second to 1 week.<br>The value must be passed second.<br>Default value: 600 seconds (10 minutes). | No |
    | `Fast name`             | The name of the FAST node Docker container. | No |
    | `Wallarm version`       | The version of the used FAST node. | No |
    | `Local docker network`  | The Docker network where the FAST node runs. | No |
    | `Local docker ip`       | The IP address that will be assigned to the running FAST node. | No |
    | `Without sudo`          | Whether to execute the FAST node commands with the rights of the user ran FAST node. By default, commands are executed with the superuser rights (via sudo). |No |

**Example of configured plugin for test recording:**

![Example of plugin configuration to record requests][jenkins-plugin-record-params]

Secondly, update the step of automated testing by adding FAST node as a proxy.

The FAST plugin will automatically stop request recording when testing is finished.

### Adding the Step of Security Testing

To add the step of security testing, select the `Playback baselines` mode on the **Build** tab and set up variables described below. 

Please note that the application must be already started and available for testing **before running security testing**.

!!! warning "Network"
    Before security testing, make sure that the FAST plugin and application are on the same network.

??? info "Variables in the testing mode"

    | Variable              | Value  | Required   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | A token from the Wallarm cloud. | Yes |
    | `Wallarm API host`    | The address of the Wallarm API server. <br>Allowed values: <br>`us1.api.wallarm.com` for the server in the Wallarm US cloud and <br>`api.wallarm.com` for the server in the Wallarm EU cloud<br>Default value is `us1.api.wallarm.com`. | No |
    | `Application host`      | The address of the test application. The value can be an IP address or a domain name. | Yes |
    | `Application port`      | The port of the test application. Default value is 8080. | No |
    | `Policy id`   | [Test policy](../operations/test-policy/overview.md) ID.<br> Default value is `0`-`Default Test Policy`. | No |
    | `TestRecord id`    | Test record ID. Corresponds to [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode).<br>Deafult value is the last test record created by used FAST node.| No |
    | `TestRun RPS`   | A limit on the number of test requests (*RPS*, *requests per second*) to be sent to the target application.<br>Minimum value: `1`.<br>Maximum value: `500`.<br>Default value: `null` (RPS is unlimited).| No |
    | `TestRun name`   | The name of the test run.<br>By default, the value will be automatically generated from the date of test run creation.| No |
    | `TestRun description`   | The description of the test run.| No |
    | `Stop on first fail`   | Whether to stop testing when an error occurs. | No |
    | `Fail build`   | Whether to finish the build with an error when vulnerabilities are found during security testing. | No |
    | `Exclude`   | The list of file extensions to exclude from security testing.<br>To split up extensions, the &#448; symbol is used.<br> By default, there are no exceptions.| No |
    | `Fast name`             | The name of the FAST node Docker container. | No |
    | `Wallarm version`       | The version of the used FAST node. | No |
    | `Local docker network`  | The Docker network where the FAST node runs. | No |
    | `Local docker ip`       | The IP address that will be assigned to the running FAST node. | No |
    | `Without sudo`          | Whether to execute the FAST node commands with the rights of the user ran FAST node. By default, commands are executed with the superuser rights (via sudo). |No|

    !!! warning "Running FAST node"
        Please note that if you add to the workflow of both the step of request recording and the step of security testing, then the names of the FAST node Docker containers must be different.

**Example of a configured plugin for security testing:**

![Example of plugin configuration for security testing][jenkins-plugin-playback-params]

## Step 3: Getting the Result of Testing

The result of security testing will be displayed in the Jenkins interface.

![The result of the FAST plugin run][fast-example-jenkins-plugin-result]

## More Examples

You can find examples of integrating FAST to CircleCI workflow on our [GitHub][fast-examples-github].

!!! info "Further questions"
    If you have questions related to FAST integration, please [contact us][mail-to-us].
