[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# Integration of Wallarm FAST Orbs with CircleCI

This instruction describes the method to integrate FAST with CircleCI workflow via [Wallarm FAST Orbs (plugin)][circleci-fast-plugin]. An integration setup is performed in the `~/.circleci/config.yml` configuration file. More details about CircleCI Orbs are available in [official CircleCI documentation][circleci-using-orbs].

!!! warning "Requirements"

    * CircleCI version 2.1
    * Configured CircleCI workflow with an already [recorded set of baseline requests][recording-mode]
    
    If you work with another version of CircleCI or need to add the step of request recording, then please check out the [example of integration with CircleCI via FAST node][fast-jenkins-cimode].

## Step 1: Passing FAST Node Token

Pass [FAST node token][fast-node-token] value in the `WALLARM_API_TOKEN`environment variable in CircleCI project settings. The method of environment variables setup is described in [CircleCI documentation][circleci-set-env-var].

![Passing CircleCI environment variable][circleci-example-env-var]

## Step 2: Connecting Wallarm FAST Orbs

To connect Wallarm FAST Orbs, set the following settings in the `~/.circleci/config.yml` file:

1. Make sure CircleCI version 2.1 is specified in the file:

    ```
    version: 2.1
    ```
2. Initialize Wallarm FAST plugin in the `orbs` section:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## Step 3: Configuring the Step of Security Testing

To configure security testing, add the separate step `fast/run_security_tests` to your CircleCI workflow and define parameters listed below:

| Parameter | Description | Required |
| ---------| ---------|--------------- |
| test_record_id| Test record ID. Corresponds to [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode).<br>Deafult value is the last test record created by used FAST node. | Yes|
| app_host | The address of the test application. The value can be an IP address or a domain name.<br>Default value is internal IP. | No |
| app_port | The port of the test application.<br>Default value is 80. | No |
| policy_id | [Test policy](../operations/test-policy/overview.md) ID.<br>Default value is `[null]`-`Default Test Policy`. | No |
| stop_on_first_fail | The indicator to stop testing when an error occurs. | No |
| test_run_name | The name of the test run.<br>By default, the value will be automatically generated from the date of the test run creation. | No |
| test_run_desc | The description of the test run. | No |
| test_run_rps | A limit on the number of test requests (*RPS*, *requests per second*) to be sent to the target application.<br>Minimum value: `1`.<br>Maximum value: `1000`.<br>Default value: `null` (RPS is unlimited). | No |
| wallarm_api_host | Address of the Wallarm API server. <br>Allowed values: <br>`us1.api.wallarm.com` for the server in the Wallarm US cloud and <br>`api.wallarm.com` for the server in the Wallarm EU cloud<br>Default value is `us1.api.wallarm.com`. | No|
| wallarm_fast_port | The port of the FAST node.<br>Default value is 8080. | No |
| wallarm_version | The version of the used Wallarm FAST Orbs.<br>The versions list is available by clicking the [link][circleci-fast-plugin].<br>Default value is latest.| No|

{% collapse title="Example of ~/.circleci/config.yml" %}

```
version: 2.1
jobs:
  build:
    machine:
      image: 'ubuntu-1604:201903-01'
    steps:
      - checkout
      - run:
          command: >
            docker run -d --name app-test -p 3000:3000
            wallarm/fast-example-rails
          name: Run application
      - fast/run_security_tests:
          app_port: '3000'
          test_record_id: '9058'
orbs:
  fast: 'wallarm/fast@dev:1.1.0'
```

You can find more examples of integrating FAST to CircleCI workflow in our [GitHub](https://github.com/wallarm/fast-examples) and [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration).

{% endcollapse %}

> #### Info::
> If you have questions related to FAST integration, please [contact us][mail-to-us].