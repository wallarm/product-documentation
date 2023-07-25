[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

#   List of Environment Variables Used by a FAST Node

Plenty of parameters are used to configure FAST node. These parameters' values can be changed via the corresponding environment variables.

You can set environment variables' values, and pass those variables to FAST node either
* via the `-e` argument
    
    ```
    docker run --name <container name> \
    -e <environment variable 1>=<value> \
    ... 
    -e <environment variable N>=<value> \
    -p <target port>:8080 wallarm/fast
    ```
    
* or via the `--env-file` argument that specifies the path to a file containing the environment variables

    ```
    docker run --name <container name> \
    --env-file=<file with environment variables> \
    -p <target port>:8080 wallarm/fast
    ```
    
    This file should contain the list of environment variables, one variable per line:

    ```
    # The sample file with environment variables

    WALLARM_API_TOKEN=token_Qwe12345            # This is the sample value—use a real token value instead
    ALLOWED_HOSTS=google-gruyere.appspot.com    # The incoming requests that target this domain, will be written to a test record
    ```

All configurable parameters are listed in the table below:

| Parameter             | Value     | Required? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| A token from the Wallarm cloud. | Yes |
| `WALLARM_API_HOST`   	| Address of the Wallarm API server. <br>Allowed values: <br>`us1.api.wallarm.com` for the server in the Wallarm US cloud and <br>`api.wallarm.com` for the server in the Wallarm EU cloud. | Yes |
| `ALLOWED_HOSTS`       | A list of a target application's hosts. The incoming requests that are targeted to these hosts will be written to a test record.<br>All incoming requests are recorded by default.<br>See more details [here][anchor-allowed-hosts].| No |
| `WALLARM_API_USE_SSL` | Defines whether or not to use SSL when connecting to one of the Wallarm API servers.<br>Allowed values: `true` and `false`.<br>Default value: `true`. | No |
| `WORKERS`             | The number of threads that process baseline requests and do security testing.<br>Default value: `10`. | No |
| `GIT_EXTENSIONS`      | The link to a Git repository containing [custom FAST DSL extensions][doc-dsl-ext] (this repository should be accessible by the FAST node container) | No |
| `CI_MODE`             | The FAST node's operation mode when integrating into CI/CD. <br>Allowed values are: <br>`recording` for the [recording mode][doc-record-mode] and <br>`testing` for the [testing mode][doc-test-mode]. | No |
| `BACKEND_HTTPS_PORTS` | The HTTPS port number(s) that are in use by a target application if non-default port(s) are configured for the application.<br>A few ports can be listed in this parameter's value, for example: <br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>Default value: `443` | No |
| `WALLARM_API_CA_VERIFY` | Defines if a Wallarm API server's CA certificate should be validated.<br>Allowed values: `true`and `false`.<br>Default value: `false`. | No |
| `CA_CERT`             | The path to a CA certificate to be used by the FAST node.<br>Default value: `/etc/nginx/ssl/nginx.crt`. | No |
| `CA_KEY`              | The path to a CA private key to be used by the FAST node. <br>Default value: `/etc/nginx/ssl/nginx.key`. | No |


## Limiting the Number of Requests to be Recorded

By default, the FAST node treats all incoming requests as baseline ones. Therefore, the node records them and creates and executes security tests on their basis. However, it is possible for extraneous requests that should not be recognized as baseline requests to pass through the FAST node to the target application.

You can limit the number of requests to be recorded by the FAST node by filtering out all requests that are not targeted to the application (note that the FAST node proxies the filtered requests but does not record them). This limitation reduces the load that applied to the FAST node and the target application, while boosting the testing process. To apply this limitation, you need to know which hosts the request source interacts with during testing.

You can filter out all non-baseline requests by configuring the `ALLOWED_HOSTS` environment variable.

--8<--  "../include-ja/fast/operations/env-vars-allowed-hosts.md"

The FAST node employs this environment variable in the following way:
* If the value of the incoming request's `Host` header matches the value specified in the `ALLOWED_HOSTS` variable, then the FAST node considers the request to be a baseline one. The request is then recorded and proxied.
* All other requests are proxied through the FAST node but are not recorded.

!!! info "Example of ALLOWED_HOSTS Environment Variable Usage"
    If the variable is defined as `ALLOWED_HOSTS=google-gruyere.appspot.com`, then the requests targeted to the `google-gruyere.appspot.com` domain will be considered baseline ones.
