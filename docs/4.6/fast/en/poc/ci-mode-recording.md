[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

#  Running a FAST Node in Recording Mode

In this mode, the FAST node runs before testing the target application.

The requests' source is set up to use the FAST node as a proxy and sends HTTP or HTTPS requests to the target application.

FAST node determines the baseline requests among the proxied ones and places them in a test record. 

!!! info "Chapter Prerequisites"
    To follow the steps described in this chapter, you need to obtain a [token][doc-get-token].
    
    The following values are used as examples throughout this chapter:
      * `token_Qwe12345` as a token.
      * `rec_0001` as an identifier of a test record.

!!! info "Install `docker-compose`"
    The [`docker-compose`][link-docker-compose] tool will be used throughout this chapter to demonstrate how FAST node operates in the recording mode.
    
    The installation instructions for this tool are available [here][link-docker-compose-install].

## Environment Variables in Recording Mode

FAST node configuration is done via environment variables. The table below holds all environment variables that can be used to configure a FAST node in recording mode.

| Environment Variable   | Value  | Required? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Token for a node. | Yes |
| `WALLARM_API_HOST`   	| The domain name of the Wallarm API server to use. <br>Allowed values: <br>`us1.api.wallarm.com` for use with the US cloud;<br>`api.wallarm.com` for use with the EU cloud.| Yes |
| `CI_MODE`            	| FAST node's operation mode. <br>Required value: `recording`. | Yes |
| `TEST_RECORD_NAME`   	| The name of a new test record to create. <br>Default value is in a similar format: “TestRecord Oct 08 12:18 UTC”. | No |
| `INACTIVITY_TIMEOUT` 	| If no baseline requests arrive to the FAST node within the `INACTIVITY_TIMEOUT` interval, then the recording process is stopped along with the FAST node.<br>Allowed value range: from 1 to 691200 seconds (1 week)<br>Default value: 600 seconds (10 minutes). | No |
| `ALLOWED_HOSTS`       | The FAST node will record those requests that target any host listed in the environment variable. <br>Default value: empty string (all incoming requests will be recorded). See [this][doc-allowed-hosts] document for details.| No |
| `BUILD_ID` | The identifier of a CI/CD workflow. This identifier allows several FAST nodes to work concurrently using the same cloud FAST node. See [this][doc-concurrent-pipelines] document for details.| No |

!!! info "See also"
    The descriptions of the environment variables that are not specific to a certain FAST node operation mode are available [here][doc-env-variables].

 ## Deployment of a FAST Node in Recording Mode

A sample `docker-compose.yaml` configuration file will be used to demonstrate how FAST operates in recording mode (note the value of the `CI_MODE` environment variable):

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # Specify the token value here
        WALLARM_API_HOST: us1.api.wallarm.com    # US cloud API server is in use here. Use api.wallarm.com for the EU cloud API server.
        CI_MODE: recording
      ports:
        - '8080:8080'                              
      networks:
        main:
          aliases:
            - fast

networks:
  main:
```

To run a Docker container with the FAST node, navigate to the directory containing the `docker-compose.yaml` file and execute the `docker-compose up fast` command.

If the command executes successfully, a console output similar to the one shown here will be generated:

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
 [info] Node connected to Wallarm Cloud
 [info] Loaded 0 custom extensions for fast scanner
 [info] Loaded 44 default extensions for fast scanner
 [info] TestRecord#rec_0001 TestRecord Oct 01 01:01 UTC starts to record

```

This output informs us that the FAST node has successfully connected to the Wallarm cloud and created a test record with the `rec_0001` identifier and the name `TestRecord Oct 01 01:01 UTC.` It is ready to receive requests and record the baseline requests.

!!! info "A Note on Test Record Names"
    To change the default test record name, you need to pass the necessary value via the `TEST_RECORD_NAME` environment variable when starting the FAST node Docker container.

 >   #### Warning:: Test Execution
>   
>   It is now time to conduct existing tests for the target application. FAST will record the baseline requests and populate the test record with them.


## Stopping and Removing the Docker Container with the FAST Node in Recording Mode

When all necessary baseline requests are recorded, the FAST node will be shut down by a CI/CD tool and return an exit code.

If the FAST node encounters no errors and the baseline recording process finishes successfully, then the `0` exit code is returned.

If the FAST node encounters some errors or the baseline recording process was stopped due to timing out (see description of the [`INACTIVITY_TIMEOUT`][anchor-recording-variables] environment variable), then the FAST node stops automatically and the `1` exit code is returned.

When the FAST node finishes its work, the corresponding Docker container needs to be stopped and removed.

If the FAST node is not stopped automatically with the `1` exit code and all required baseline requests are recorded, then you can stop the FAST node's Docker container by executing the `docker-compose stop <container's name>` command:

```
docker-compose stop fast
```

To remove the FAST node's container, execute the `docker-compose rm <container's name>` command:

```
docker-compose rm fast
```

In the examples above, `fast` is used as the name of the Docker container to stop or remove.

Alternatively, you can use the `docker-compose down` command, which stops and removes containers for all services described in the `docker-compose.yaml` file.