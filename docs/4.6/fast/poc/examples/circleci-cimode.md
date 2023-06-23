[circleci-config-yaml]:         https://circleci.com/docs/2.0/writing-yaml/#section=configuration
[fast-node-token]:              ../../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[fast-example-result]:          ../../../images/fast/poc/common/examples/circleci-cimode/circleci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-circleci]:        https://circleci.com/gh/wallarm/fast-example-circleci-dvwa-integration


# Integration of FAST with CircleCI

The integration of FAST in CI MODE into the CircleCI workflow is configured via the `~/.circleci/config.yml` file. More details about CircleCI workflow configuration are available in the [CircleCI official documentation][circleci-config-yaml].

## Passing FAST Node Token

To securely use the [FAST node token][fast-node-token], pass its value in the [environment variable in your project settings][circleci-set-env-var].

![!Passing CircleCI environment variable][circleci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

<br>

## Adding the Step of Request Recording

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

<br>

??? info "Example of the automated testing step with running FAST node in the recording mode" %}
    ```
    - run:
          name: Start tests & FAST record
          command: |
            docker network create my-network \
            && docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network wallarm/fast \
            && docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest \
            && docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application bundle exec rspec spec/features/posts_spec.rb \
            && docker stop selenium fast 
    ```

    An example includes the following steps:

    1. Create the Docker network `my-network`.
    2. Run the FAST node in the recording mode on the network `my-network`.
    3. Run the tool for automated testing Selenium with FAST node as a proxy on the network `my-network`.
    4. Run the test application and automated tests on the network `my-network`.
    5. Stop the tool for automated testing Selenium and FAST node in the recording mode.

## Adding the Step of Security Testing

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

<br>

??? info "Example of the security testing step"
    ```
    - run:
        name: Start FAST tests
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    An example includes the following steps:

    1. Run the test application on the `my-network` network.
    2. Run the FAST node in the testing mode on the network `my-network`. The `TEST_RECORD_ID` variable is omitted since the set of baseline requests was created in the current pipeline and is the last recorded. The FAST node will be stopped automatically when testing is finished.
    3. Stop the test application.

## Getting the Result of Testing

The result of security testing will be displayed in CircleCI interface.

![!The result of running FAST node in testing mode][fast-example-result]

## More Examples

You can find examples of integrating FAST to CircleCI workflow in our [GitHub][fast-examples-github] and [CircleCI][fast-example-circleci].

!!! info "Further questions"
    If you have questions related to FAST integration, please [contact us][mail-to-us].
