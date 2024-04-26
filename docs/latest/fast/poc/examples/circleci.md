[img-demo-app]:                 ../../../images/fast/poc/common/examples/demo-app.png
[img-testing-flow]:             ../../../images/fast/poc/en/examples/testing-flow.png
[img-testing-flow-fast]:        ../../../images/fast/poc/en/examples/testing-flow-fast.png
[img-services-relations]:       ../../../images/fast/poc/common/examples/api-services-relations.png
[img-test-traffic-flow]:        ../../../images/fast/poc/en/examples/test-traffic-flow.png

[img-cci-pass-token]:           ../../../images/fast/poc/common/examples/circleci/pass-token.png
[img-cci-pass-results]:         ../../../images/fast/poc/common/examples/circleci/pass-results.png
[img-cci-workflow]:             ../../../images/fast/poc/en/examples/circleci/api-workflow.png

[img-cci-demo-pass-token]:      ../../../images/fast/poc/common/examples/circleci/demo-pass-token.png
[img-cci-demo-rspec-tests]:     ../../../images/fast/poc/common/examples/circleci/api-demo-rspec-tests.png
[img-cci-demo-testrun]:         ../../../images/fast/poc/common/examples/circleci/demo-testrun.png
[img-cci-demo-tests-failed]:    ../../../images/fast/poc/common/examples/circleci/demo-tests-failed.png
[img-cci-demo-vuln-details]:    ../../../images/fast/poc/common/examples/circleci/demo-vuln-details.png

[doc-env-variables]:            ../../operations/env-variables.md
[doc-testrun-steps]:            ../../operations/internals.md#test-run-execution-flow-baseline-requests-recording-takes-place
[doc-testrun-creation]:         ../node-deployment.md#creating-a-test-run
[doc-get-token]:                ../../operations/create-node.md
[doc-stopping-recording]:       ../stopping-recording.md
[doc-waiting-for-tests]:        ../waiting-for-tests.md
[doc-node-ready-for-recording]: ../node-deployment.md#creating-a-test-run

[link-api-recoding-mode]:       ../integration-overview-api.md#deployment-via-the-api-when-baseline-requests-recording-takes-place

[link-example-project]:         https://github.com/wallarm/fast-example-api-circleci-rails-integration
[link-rspec]:                   https://rspec.info/
[link-capybara]:                https://github.com/teamcapybara/capybara
[link-selenium]:                https://www.seleniumhq.org/
[link-docker-compose-build]:    https://docs.docker.com/compose/reference/build/
[link-circleci]:                https://circleci.com/

[link-wl-portal]:               https://us1.my.wallarm.com
[link-wl-portal-testrun-tab]:   https://us1.my.wallarm.com/testing/?status=running

[anchor-project-description]:           #how-the-sample-application-works
[anchor-cci-integration-description]:   #how-fast-integrates-with-rspec-and-circleci
[anchor-cci-integration-demo]:          #demo-of-the-fast-integration

#   Example of FAST Integration into CI/CD

!!! info "Chapter conventions"
    The following token value is used as an example value throughout the chapter: `token_Qwe12345`.

A sample project [fast-example-api-circleci-rails-integration][link-example-project] is available on the Wallarm’s GitHub. It’s purpose is to demonstrate how to perform FAST integration into existing CI/CD processes. This example follows the [“Deployment via the API when Baseline Requests Recording Takes Place”][link-api-recoding-mode] scenario.

This document contains the following pieces of information:
1.  [An explanation of how the sample application works.][anchor-project-description]
2.  [A detailed step-by-step description of a FAST integration.][anchor-cci-integration-description]
3.  [A demo of the FAST integration in action.][anchor-cci-integration-demo]

##  How the Sample Application Works

The sample application is a web application that allows you to publish posts on a blog and the capability to manage the blog posts.

![The sample application][img-demo-app]

The application is written in Ruby on Rails and shipped as a Docker container. 

Also, [RSpec][link-rspec] integration tests are created for the application. RSpec employs [Capybara][link-capybara] to interact with the web application and Capybara uses [Selenium][link-selenium] to send HTTP requests to the application:

![Testing flow][img-testing-flow]

RSpec executes a few integration tests to test the following scenarios:
* Navigating to the page with posts
* Creating a new post
* Updating an existing post
* Deleting an existing post

Capybara and Selenium help to convert these tests into a set of HTTP requests to the application.

!!! info "Tests Location"
    The aforementioned integration tests are described in the `spec/features/posts_spec.rb` file.

##  How FAST Integrates with RSpec and CircleCI

Here you will find an overview of the FAST integration with RSpec and CircleCI for the sample project.

RSpec supports pre-test and post-test hooks:

```
config.before :context, type: :feature do
    # Actions to take before the RSpec tests’ execution
  end
    # RSpec tests’ execution
  config.after :context, type: :feature do
    # Actions to take after the RSpec tests’ execution
  end
```

This essentially means that it is possible to augment the steps RSpec takes to test the application with the steps involving FAST security testing.

We can point a Selenium server to a proxy server with the `HTTP_PROXY` environment variable. Thus, HTTP requests to the application will be proxied. Usage of proxying mechanism allows you to pass the requests issued by the integration tests through the FAST node with the minimal intervention into the existing testing flow:

![Testing flow with FAST][img-testing-flow-fast]

A CircleCI job is built with all the aforementioned facts in mind. The job comprises the following steps (see the `.circleci/config.yml` file):

1.  Necessary preparations:
    
    You need to [obtain a token][doc-get-token] and pass its value into the CircleCI project via the `TOKEN` environment variable.
After a new CI job is in place, the variable’s value is passed to the Docker container, where the job is executed.
    
    ![Pass the token into the CircleCI][img-cci-pass-token]
    
2.  Build services
    
    In this stage a few Docker containers are to be built for a set of services. The containers are placed to a shared Docker network. Therefore, they could communicate with each using the IP addresses as well as containers’ names.
    
    The following services are built (see the `docker-compose.yaml` file):
    
    * `app-test`: a service for the target application and the test tool.
        
        A Docker image for the service comprises the following components:
        
        * The target application (it is reachable via HTTP at `app-test:3000` after deployment).
        
        * The RSpec test tool combined with Capybara; The tool contains all of the functions required to run the FAST security tests.
        
        * Capybara: configured to send HTTP requests to the target application `app-test:3000` with the use of Selenium server `selenium:4444` (see the `spec/support/capybara_settings.rb` file).
        
        The token is passed into the service’s container by the `WALLARM_API_TOKEN=$TOKEN` environment variable. The token is used by the functions, which are described in the `config.before` and `config.after` sections (see the `spec/support/fast-helper.rb` file), to perform manipulations with a test run.
    
    * `fast`: a service for the FAST node.
        
        The node is reachable via HTTP at `fast:8080` after deployment. 
        
        The token is passed into the service’s container by the `WALLARM_API_TOKEN=$TOKEN` environment variable. The token is required for the proper FAST operation.
        
        !!! info "Note on baseline requests"
            The provided example does not employ the `ALLOWED_HOSTS` [environment variable][doc-env-variables]. Therefore, the FAST node recognizes all incoming requests as the baseline ones.
    
    * `selenium`: a service for the Selenium server. Capybara from the `app-test` container uses the server for its operation.
        
        The `HTTP_PROXY=http://fast:8080` environment variable is passed into the service’s container to enable requests’ proxying through the FAST node.
        
        The service is reachable via HTTP at `selenium:4444` after deployment.
        
    All services form following relations between them:
    
    ![Relations between services][img-services-relations]
    
3.  Due to the aforementioned relations, the services should be deployed in a strict order as follows:
    1.  `fast`.
    2.  `selenium`.
    3.  `app-test`.
    
    The `fast` and `selenium` services are deployed in a sequential manner by issuing the `docker-compose up -d fast selenium` command.
    
4.  Upon successful deployment of the Selenium server and FAST node, it is time to deploy the `app-test` service and execute the RSpec tests.
    
    To do so, the following command is issued:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    Test and HTTP traffic flows are shown in the image:
    
    ![Test and HTTP traffics flows][img-test-traffic-flow]
    
    In accordance with the [scenario][link-api-recoding-mode], RSpec tests include all steps that are required to run the FAST security tests (see the `spec/support/fast_hooks.rb` file):
    
    1.  A test run [is created][doc-testrun-creation] prior to the execution of the RSpec tests.
        
        Then the API call [is issued][doc-node-ready-for-recording] to check if the FAST node is ready to record the baseline requests. The existing tests’ execution process is not started until the node is ready.
        
        !!! info "Test policy in use"
            This example uses the default test policy.
        
    2.  RSpec tests are executed.
    3.  The following actions are performed after the RSpec tests are done:
        1.  The baseline requests recording process [is stopped][doc-stopping-recording]; 
        2.  The test run state [is being monitored periodically][doc-waiting-for-tests]:
            * If FAST security tests are completed successfully (the test run’s state is `state: passed`), thene an exit code `0` is returned to the RSpec.
            * If FAST security tests are completed unsuccessfully (some vulnerabilities were detected and the test run’s state is `state: failed`), then an exit code `1` is returned to the RSpec.
    
5.  The testing result is obtained:
    
    The RSpec process’ exit code is passed to the `docker-compose run` process and then to the CircleCI.     
    
    ![The job result in CircleCI][img-cci-pass-results]

The described CircleCI job closely follows the steps listed [earlier][link-api-recoding-mode]:

![CircleCI job in detail][img-cci-workflow]

##  Demo of the FAST integration

1.  [Create a FAST node][doc-get-token] in the Wallarm cloud and copy the provided token.
2.  Copy the [sample project files][link-example-project] into your own GitHub repository.
3.  Add your GitHub repository to the [CircleCI][link-circleci] (press the “Follow Project” button in CircleCI) so that CI job fires up every time you change the content of the repository. A repository is called “a project” in the CircleCI terminology.
4.  Add a `TOKEN` environment variable to your CircleCI project. You can do this in the settings of the project. Pass the FAST token as a value of this variable:
    
    ![Pass the token into the project][img-cci-demo-pass-token]
    
5.  Push something to the repository to start the CI job. Make sure that the RSpec integration tests are finished with success (see the console output of the job):
    
    ![RSpec tests are passed][img-cci-demo-rspec-tests]
    
6.  Make sure that the test run is executing.
    
    You can log into the [Wallarm portal][link-wl-portal] using your Wallarm account information and navigate to the [“Testruns” tab][link-wl-portal-testrun-tab] to observe the process of testing the application against vulnerabilities in real time:
    
    ![Test run execution][img-cci-demo-testrun]
    
7.  You can see the CI job status reported as “Failed” after the testing process finishes:
    
    ![The completion of the CI job][img-cci-demo-tests-failed]
    
    Given that there is the Wallarm demo application under the test, the failed CI job represents the vulnerabilities FAST detected in the application (the message “FAST tests have failed” should appear in the build log files). The failure is not invoked by any build-related technical issues in this case.
    
    !!! info "Error message"
        The “FAST tests have failed” error message is produced by the `wait_test_run_finish` method that is located in the `spec/support/fast_helper.rb` file, which is before the termination with the exit code `1`.

8.  There is no information about detected vulnerabilities displayed in the CircleCI console during testing process. 

    You can explore the vulnerabilities in detail on the Wallarm portal. To do this, navigate to the test run link. The link is displayed as a part of the FAST informational message in the CircleCI console.
    
    This link should look like this one:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    For example, you can take a look at the completed test run to find out that a few XSS vulnerabilities were found in the sample application:
    
     ![A detailed information about the vulnerability][img-cci-demo-vuln-details]
    
To conclude, it has been demonstrated that FAST has strong capabilities of integration into existing CI/CD processes as well as finding vulnerabilities in the application even when the integration tests are passed without any errors.