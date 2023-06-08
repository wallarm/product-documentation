# Integration of FAST with Bamboo

The integration of FAST in CI MODE into the Bamboo workflow can be configured using one of the methods below:

* via the [YAML specification](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)
* via the [JAVA specification](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)
* via [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)

The example below uses the YAML specification to configure the integration.

## Passing FAST Node Token

To securely use the [FAST node token](../../operations/create-node.md), pass its value in the [Bamboo global variable](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html).

![Passing Bamboo global variable](../../../images/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

!INCLUDE "../../include/fast-cimode-integration-examples/configured-workflow.md"

<br>

## Adding the Step of Request Recording

To implement the request recording, apply the following settings to the job of automated application testing:

1. Add the command running FAST Docker container in the `CI_MODE=recording` mode with other required [variables](../ci-mode-recording.md#environment-variables-in-recording-mode) __before__ the command running automated tests. For example:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Configure proxying of automated tests via FAST node. For example:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

> #### Warning:: Docker Network
>
> Before recording requests, make sure that the FAST node and the tool for automated testing are running on the same network.

{% collapse title="Example of the automated testing step with running FAST node in the recording mode" %}

```
test:
  key: TST
  tasks:
    - script:
        interpreter: /bin/sh
        scripts:
          - docker network create my-network
          - docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          - docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          - docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          - docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          - docker stop selenium fast
```

An example includes the following steps:

1. Create the Docker network `my-network`.
2. Run the test app `dvwa` on the `my-network` network.
3. Run the FAST node in the recording mode on the network `my-network`.
4. Run the tool for automated testing Selenium with FAST node as a proxy on the network `my-network`.
5. Run the automated tests on the network `my-network`.
6. Stop the tool for automated testing Selenium and FAST node in the recording mode.
{% endcollapse %}

## Adding the Step of Security Testing

To implement the security testing, add the corresponding separate step to your workflow following instructions:

1. If the test application is not running, then add the command to run the application.
2. Add the command running the FAST Docker container in the `CI_MODE=testing` mode with other required [variables](../ci-mode-testing.md#environment-variables-in-testing-mode) __after__ the command running the application.

    > #### Info:: Using the recorded set of baseline requests
    >
    > If the set of baseline requests was recorded in another pipeline, specify the record ID in the [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) variable. Otherwise, the last recorded set will be used.

    Example of the command:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

> #### Warning:: Docker Network
>
> Before security testing, make sure that the FAST node and the test application are running on the same network.

{% collapse title="Example of the security testing step" %}

The commands are running on the `my-network` network created at the request recording step. The test app, `app-test`, is also running at the request recording step.

1. Add `security_testing` to the list of `stages`. In the example, this step finalizes the workflow.

    ```
    stages:
      - testing:
          manual: false
          jobs:
            - test
      - security_testing:
          final: true
          jobs:
            - security_test
    ```
2. Define the body of the new job `security_test`.

    ```
    security_test:
    key: SCTST
    tasks:
        - script:
            interpreter: /bin/sh
            scripts:
             - docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
             - docker stop dvwa
             - docker network rm my-network
    ```

An example includes the following steps:

1. Run the FAST node in the testing mode on the network `my-network`. The `TEST_RECORD_ID` variable is omitted since the set of baseline requests was created in the current pipeline and is the last recorded. The FAST node will be stopped automatically when testing is finished.
2. Stop the test application `dvwa`.
3. Delete the `my-network` network.
{% endcollapse %}

## Getting the Result of Testing

The result of security testing will be displayed in the build logs in Bamboo UI. Also, Bamboo allows downloading the full `.log` file.

![The result of running the FAST node in testing mode](../../../images/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## More Examples

You can find more examples of integrating FAST to Bamboo workflow on our [GitHub](https://github.com/wallarm/fast-examples).

> #### Info::
> If you have questions related to FAST integration, please [contact us](mailto:support@wallarm.com).