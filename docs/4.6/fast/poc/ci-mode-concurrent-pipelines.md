[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

#   Using FAST in Concurrent CI/CD Workflows

!!! info "Necessary data" 
    The following values are used as examples in this document:

    * `token_Qwe12345` as a token.
    * `rec_1111` and `rec_2222` as test records identifiers.

Several FAST nodes can be deployed simultaneously in concurrent CI/CD workflows. These nodes share the same token and work with a single cloud FAST node.

This deployment scheme is applicable to FAST nodes that operate in both [recording][doc-ci-recording] and [testing][doc-ci-testing] modes.

To avoid conflicts during concurrent FAST nodes operation, the `BUILD_ID` environment variable is passed to each node's container. This variable serves the following purposes:
1.  It is used as an additional identifier for a test record that is created by a FAST node in recording mode.
2.  It allows determining which test record should be used by a test run that is created by a FAST node in testing mode (so the test run become tied to the test record). 
3.  It identifies a certain CI/CD workflow.

The `BUILD_ID` environment variable can comprise any combination of letters and digits as its value.

Next, an example will be given on how to run two FAST nodes simultaneously: in recording mode first, then in testing mode. The approach described below is scalable (you can use as many nodes as you need, the number of nodes is not limited to two as in the example below) and is applicable to a real CI/CD workflow.


##  Running the FAST Node in Recording Mode to Use in Concurrent CI/CD Workflows

!!! info "Note on the examples"
    The examples below use only the essential set of environment variables, enough for a FAST node container to be up and operational. This is for the sake of simplicity. 

Run the following command to run the first FAST node container in recording mode:

```
docker run --rm --name fast-node-1 \    # This command run the fast-node-1 container
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm API server host (in this case the host is located in the european Wallarm cloud)
-e WALLARM_API_TOKEN='qwe_12345' \      # The token to connect to the cloud FAST node
-e CI_MODE=recording \                  # This node will operate in recording mode
-e BUILD_ID=1 \                         # The BUILD_ID value (it must differ from the another one for the concurrent pipeline)
-p 8080:8080 wallarm/fast               # The port mapping is done here. Also, the Docker image to use is specified here.
```

Run the following command to run the second concurrent FAST node container in recording mode:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # The token value should be identical to the one used for the first FAST node
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # The BUILD_ID value differs from the one used for the first FAST node in another CI/CD workflow.
-p 8000:8080 wallarm/fast
```

!!! info "Note on the `docker run` commands"
    The aforementioned commands are supposed to be run on the same Docker host, so in addition to the different `BUILD_ID` values, these commands have distinct container names (`fast-node-1` and `fast-node-2`) and target ports values (`8080` and `8000`).
    
    If you run FAST node containers on separate Docker hosts, then the `docker run` commands may differ only in the `BUILD_ID` values.

After executing these two commands, two FAST nodes will operate in recording mode using the same cloud FAST node, but **distinct test records will be created**.

The CI/CD tool console output will be similar to that described [here][doc-ci-recording-example].

When the test records are populated with all the necessary baseline requests, shut down the corresponding FAST nodes and spin up other nodes in testing mode.

##  Running the FAST Node in Testing Mode to Use in Concurrent CI/CD Workflows

Let's assume that the `rec_1111` and `rec_2222` test records were prepared during the operation of the FAST nodes `fast-node-1` and `fast-node-2` in recording mode.  

Then, to direct a FAST node in testing mode to use the `rec_1111` test record, pass the `BUILD_ID=1` environment variable to the node container. Similarly, pass the `BUILD_ID=2` environment variable to use the `rec_2222` test record. Use the corresponding `docker run` commands below to run FAST nodes in testing mode.

Run the following command to run the first FAST node container in testing mode:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # This node will operate in testing mode
-e BUILD_ID=1 \                         # The `BUILD_ID=1` variable corresponds to the `rec_1111` test record
wallarm/fast
```

Run the following command to run the second concurrent FAST node container in recording mode:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # This node will operate in testing mode
-e BUILD_ID=2 \                         # The `BUILD_ID=2` variable corresponds to the `rec_2222` test record
wallarm/fast
```

The CI/CD tool console output will be similar to that described [here][doc-ci-testing-example].

As a result of passing the corresponding values of the `BUILD_ID` environment variables to the FAST nodes, **two test runs will begin to execute simultaneously**, each working with a distinct test record.

So you can run a few FAST nodes for concurrent CI/CD workflows by specifying the `BUILD_ID` environment variable without creating any conflict between the nodes (a newly created test run will not abort the execution of a running test run).  