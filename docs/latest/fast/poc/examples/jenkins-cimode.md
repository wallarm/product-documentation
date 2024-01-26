[jenkins-config-pipeline]:      https://jenkins.io/doc/book/pipeline
[fast-node-token]:              ../../operations/create-node.md
[jenkins-parameterized-build]:  https://wiki.jenkins.io/display/JENKINS/Parameterized+Build
[jenkins-example-env-var]:     ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-add-token-example.png
[fast-example-jenkins-result]:  ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-result-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

# Integration of FAST with Jenkins

The integration of FAST in CI MODE into the Jenkins workflow is configured via the `Jenkinsfile` file. More details about the Jenkins workflow configuration are available in the [Jenkins official documentation][jenkins-config-pipeline].

## Passing FAST Node Token

To securely use the [FAST node token][fast-node-token], pass its value in the [environment variable in your project settings][jenkins-parameterized-build].

![Passing Jenkins environment variable][jenkins-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## Adding the Step of Request Recording

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Example of the automated testing step with running FAST node in the recording mode"
    ```
    stage('Run autotests with recording FAST node') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'run fast with recording', script: 'docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8088:8080 --network my-network wallarm/fast'
             sh label: 'run selenium', script: 'docker run --rm -d --name selenium -p 4444:4444 --network my-network -e http_proxy=\'http://fast:8080\' -e https_proxy=\'https://fast:8080\' selenium/standalone-firefox:latest'
             sh label: 'run application', script: 'docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb'
             sh label: 'stop selenium', script: 'docker stop selenium'
             sh label: 'stop fast', script: 'docker stop fast'
             sh label: 'remove network', script: 'docker network rm my-network'
          }
       }
    ```

    An example includes the following steps:

    1. Create the Docker network `my-network`.
    2. Run the FAST node in the recording mode on the network `my-network`.
    3. Run the tool for automated testing Selenium with the FAST node as a proxy on the network `my-network`.
    4. Run the test application and automated tests.
    5. Stop Selenium and FAST node.
    6. Delete the `my-network` network.

## Adding the Step of Security Testing

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Example of the security testing step"

    ```
    stage('Run security tests') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'start application', script: ' docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test'
             sh label: 'run fast in testing mode', script: 'docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE="testing" -e WALLARM_API_HOST="us1.api.wallarm.com"  --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast'
             sh label: 'stop application', script: ' docker stop app-test '
            sh label: 'remove network', script: ' docker network rm my-network '
          }
       }
    ```

    An example includes the following steps:

    1. Create the Docker network `my-network`.
    2. Run the test application on the `my-network` network.
    3. Run the FAST node in the testing mode on the network `my-network`. The `TEST_RECORD_ID` variable is omitted since the set of baseline requests was created in the current pipeline and is the last recorded. The FAST node will be stopped automatically when testing is finished.
    4. Stop the test application.
    5. Delete the `my-network` network.

## Getting the Result of Testing

The result of security testing will be displayed on the Jenkins interface.

![The result of running FAST node in testing mode][fast-example-jenkins-result]

## More Examples

You can find examples of integrating FAST to the Jenkins workflow on our [GitHub][fast-examples-github].

!!! info "Further questions"
    If you have questions related to FAST integration, please [contact us][mail-to-us].