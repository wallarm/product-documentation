[gitlabcicd-config-yaml]:       https://docs.gitlab.com/ee/ci
[fast-node-token]:              ../../operations/create-node.md
[gitlabci-set-env-var]:         https://docs.gitlab.com/ee/ci/variables/
[gitlabci-example-env-var]:     ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-env-var-example.png
[fast-example-gitlab-result]:   ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-gitlab-cicd]:     https://gitlab.com/wallarm/fast-example-gitlab-dvwa-integration

# Integration of FAST with GitLab CI/CD

The integration of FAST in CI MODE into the GitLab CI/CD workflow is configured via the `~/.gitlab-ci.yml` file. More details about GitLab CI/CD workflow configuration are available in the [GitLab official documentation][gitlabcicd-config-yaml].

## Passing FAST Node Token

To securely use the [FAST node token][fast-node-token], pass its value in the [environment variable in your project settings][gitlabci-set-env-var].

![Passing GitLab CI/CD environment variable][gitlabci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## Adding the Step of Request Recording

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Example of the automated testing step with running FAST node in the recording mode"
    ```
    test:
      stage: test
      script:
        - docker network create my-network 
        - docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network --rm wallarm/fast 
        - docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest 
        - docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb 
        - docker stop selenium fast
        - docker network rm my-network
    ```

    An example includes the following steps:

    1. Create the Docker network `my-network`.
    2. Run the FAST node in the recording mode on the network `my-network`.
    3. Run the tool for automated testing Selenium with FAST node as a proxy on the network `my-network`.
    4. Run the test application and automated tests on the network `my-network`.
    5. Stop Selenium and FAST node.

## Adding the Step of Security Testing

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Example of the security testing step"
    1. Add `security_test` to the list of `stages`.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. Define the body of the new stage `security_test`.

        ```
          security_test:
            stage: security_test
            script:
              - docker network create my-network 
              - docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test
              - sleep 5 
              - docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast 
              - docker stop app-test
        ```

    An example includes the following steps:

    1. Create the Docker network `my-network`.
    2. Run the test application on the network `my-network`.
    3. Run the FAST node in the testing mode on the network `my-network`. The `TEST_RECORD_ID` variable is omitted since the set of baseline requests was created in the current pipeline and is the last recorded. The FAST node will be stopped automatically when testing is finished.
    4. Stop the test application.

## Getting the Result of Testing

The result of security testing will be displayed on the GitLab CI/CD interface.

![The result of running FAST node in testing mode][fast-example-gitlab-result]

## More Examples

You can find examples of integrating FAST to GitLab CI/CD workflow on our [GitHub][fast-examples-github] and [GitLab][fast-example-gitlab-cicd].

!!! info "Further questions"
    If you have questions related to FAST integration, please [contact us][mail-to-us].

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->