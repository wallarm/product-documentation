# Configuring Authentication of Test Runs

If requests to your application must be authenticated, security testing requires authentication too. This instruction provides the method of passing credentials to successfully authenticate test runs.

## Method of Configuring Test Run Authentication

To pass credentials for test run authentication, perform the following steps before [deploying](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) the FAST node Docker container:

1. Create the local file with the `.yml` or `.yaml` extension. For example: `auth_dsl.yaml`.
2. Define authentication parameters in the created file using the [FAST DSL](../dsl/intro.md) syntax in the following way:
    1. Add the [`modify`](../dsl/phase-modify.md) section to the file.
    2. In the `modify` section, specify the part of the request where authentication parameters are passed. The request part must be specified in the [point](../dsl/points/basics.md) format.

        !!! info "Example of a point for the token parameter"
            If a token is used for request authentication and its value is passed in the `token` parameter in the `Cookie` request header, the point may look like `HEADER_COOKIE_COOKIE_token_value`.
    
    3. Specify values of authentication parameters in the following way:
    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
    ```

    The number of used authentication parameters is not limited.
3. Mount the directory with the `.yml`/`.yaml` file into the FAST node Docker container using the `-v {path_to_folder}:/opt/dsl_auths` option when deploying the container. For example:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    > #### Warning:: Files in the mounted directory
    > Please note that the mounted directory should contain only the file with authentication credentials.

## Examples of .yml/.yaml Files with Defined Authentication Parameters

A set of parameters defined in the `.yml`/`.yaml` file depends on the authentication method used in your application.

The following are examples of defining the most common authentication methods of API requests:

* The `username` and `password` parameters are passed in the `Cookie` request header

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* The `token` parameter is passed in the `Cookie` request header

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```
