To implement the security testing, add the corresponding separate step to your workflow following these instructions:

1. If the test application is not running, add the command to run the application.
2. Add the command running FAST Docker container in the `CI_MODE=testing` mode with other required [variables](../ci-mode-testing.md#environment-variables-in-testing-mode) __after__ the command running the application.

    > #### Info:: Using the recorded set of baseline requests
    >
    > If the set of baseline requests was recorded in another pipeline, specify the record ID in the [TEST_RECORD_ID][fast-ci-mode-test] variable. Otherwise, the last recorded set will be used.

    Example of the command:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

> #### Warning:: Docker Network
>
> Before security testing, make sure the FAST node and test application are running on the same network.