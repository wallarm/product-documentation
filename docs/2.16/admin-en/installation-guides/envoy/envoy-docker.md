[anchor-reg-auto]:          #automatic-registration
[anchor-reg-values]:        #use-of-prepared-credentials
[anchor-reg-file]:          #use-of-a-prepared-configuration-file-containing-credentials
      
[doc-envoy-fine-tuning]:    ../../configuration-guides/envoy/fine-tuning.md


#   Installing with Docker (Using the Envoy‑Based Docker Image)

An Envoy‑based filter node can be deployed as a Docker container. This Docker container is a thick one and contains all the subsystems of the filter node.

##  Quick Deployment Procedure

To quickly deploy a filter node, execute the following command:

``` bash
docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e WALLARM_API_HOST=api.wallarm.com -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=memvalue -p 80:80  wallarm/envoy:2.16
```

In this command insert your specific parameters as follows:
*   `deploy@example.com`—login for your Wallarm account
*   `very_secret`—password for your Wallarm account
*   `api.wallarm.com`—the name of the Wallarm API server. The name to choose depends on the Wallarm cloud you are using:
    *   If you log in to the <https://us1.my.wallarm.com> portal with your Wallarm account, then you are using the American cloud. Set the `WALLARM_API_HOST=us1.api.wallarm.com` environment variable.
    *   If you log in to the <https://my.wallarm.com> portal with your Wallarm account, then you are using the European cloud. Either set the `WALLARM_API_HOST=us1.api.wallarm.com` environment variable or omit it (a node registers itself in the European cloud by default)
*   `example.com`—the name or IP address of the web application to protect
*   `memvalue`—the amount of memory allocated to Tarantool (in gigabytes)

After running the command the following will happen:
*   The filter node will automatically register itself in the Wallarm cloud.
*   The protected web application will be available at `http://<Docker host name or IP address>:80`.


##  Common Deployment Procedure

The common deployment procedure is described in this section.

### 1.  Choose How to Connect a Filter Node to the Wallarm Cloud

A filter node interacts with the Wallarm cloud and should be connected to the cloud. The cloud is located on a remote server.

You have the following options to connect the node to the cloud:
*   [use automatic registration][anchor-reg-auto]
*   [use prepared credentials][anchor-reg-values]
*   [use a prepared configuration file containing the node's credentials][anchor-reg-file]

!!! warning "Registration of a New Node"
    Automatic registration should be used when deploying a new filter node.

####    Automatic Registration

Specify the login and password pair that corresponds to a Wallarm account to automatically register the filter node in the Wallarm cloud. To do so, pass both the login and password values to the node's container via the `DEPLOY_USER` and `DEPLOY_PASSWORD` environment variables accordingly (using the `-e` parameter of the `docker run` command).

The filter node will try to automatically register itself in the Wallarm cloud on the first start.
    
If a filter node with the same name as the node's container identifier is already registered in the cloud, then the registration process will fail. To avoid this, pass the `DEPLOY_FORCE=true` environment variable to the container.

**Example:**

``` bash
docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e DEPLOY_FORCE=true -e WALLARM_API_HOST=api.wallarm.com -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=memvalue -p 80:80  wallarm/envoy:2.16
```

If the registration process finishes successfully, then the container's `/etc/wallarm` directory will be populated with the license file (`license.key`), a file with the credentials for the filter node to access the cloud (`node.yaml`), and other files required for proper node operation.

On the next start of the same filter node, registration will not be required. The filter node communicates with the cloud using the following artifacts acquired during the automatic registration:
*   The `uuid` and `secret` values (they are placed in the `/etc/wallarm/node.yaml` file).
*   The Wallarm license key (it is placed in the `/etc/wallarm/license.key` file).    

To connect the already registered filter node to the cloud, pass to its container
*   either the `uuid` and `secret` values via the environment variables and the `license.key` file
*   or the `node.yaml` and `license.key` files. 

####    Use of Prepared Credentials

Pass to the filter node's container
*   the `uuid` and `secret` values via the corresponding `NODE_UUID` and `NODE_SECRET` environment variables and
*   the `license.key` file via Docker volumes. 

**Example:**

``` bash
docker run -d -e NODE_UUID="some_uuid" -e NODE_SECRET="some_secret" -v /configs/license.key:/etc/wallarm/license.key -e WALLARM_API_HOST=api.wallarm.com -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=memvalue -p 80:80  wallarm/envoy:2.16
```

####    Use of a Prepared Configuration File Containing Credentials

Pass the following files to the filter node's container via Docker volumes:
*   the `node.yaml` file, containing the credentials for the filter node to access the Wallarm cloud.
*   the `license.key` file. 

**Example:**

```
docker run -d -v /configs/license.key:/etc/wallarm/license.key -v /configs/node.yaml:/etc/wallarm/node.yaml -e WALLARM_API_HOST=api.wallarm.com -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=memvalue -p 80:80  wallarm/envoy:2.16
```

### 2.  Choose How to Configure a Filter Node

A filter node is configured via the `/etc/envoy/envoy.yaml` Envoy YAML configuration file. 

To configure the filter node, you can either
*   run the container with the filter mode in the simplified configuration mode or
*   use a prepared Envoy configuration file.

####    Running Node in the Simplified Configuration Mode

When in the simplified configuration mode, a filter node automatically creates a minimal Envoy configuration file to protect the specified web application.

To run a node in the simplified configuration mode, pass the web application's name or IP address to the node's container via the `ENVOY_BACKEND` environment variable.

According to the generated configuration file, the filter node is placed in the “blocking” operation mode, which will result in the blocking of all attacks targeted to the protected application. To run the filter node in the other operation modes (e.g., monitoring mode), create an appropriate Envoy configuration file and pass it to the node's Docker container (see [this document][doc-envoy-fine-tuning] for more information about fine-tuning an Envoy‑based filter node). 

####    Using a Prepared Envoy Configuration File 

To use a prepared Envoy configuration file, mount the corresponding YAML file into the node's container as a `/etc/envoy/envoy.yaml` file.

**Example:**

```
docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -e WALLARM_API_HOST=api.wallarm.com -e TARANTOOL_MEMORY_GB=memvalue -p 80:80  wallarm/envoy:2.16
```

!!! info "Note on the Configuration Mode"
    The majority of the commands mentioned in this document use the simplified configuration mode and the `ENVOY_BACKEND` environment variable; however, you can use a prepared Envoy configuration file in these commands as well.

### 3.  Choose the Amount of Memory to Allocate to Tarantool

The postanalytics module operates using the in-memory database Tarantool. The amount of allocated memory determines the quality of the work of the statistical algorithms. The recommended value is 75 percent of the total server memory. For example, if the server has 32 GB of memory, the recommended allocation size is 24 GB.

When deploying a container with a filter node, specify the amount of memory to be allocated to the Tarantool (in gigabytes) by passing the `TARANTOOL_MEMORY_GB` environment variable into the node's container.

**Example:**

```
docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -e WALLARM_API_HOST=api.wallarm.com -e TARANTOOL_MEMORY_GB=16 -p 80:80  wallarm/envoy:2.16
```

In this example, 16 gigabytes of memory are allocated to Tarantool.

### 4.  Configure Log Rotation (If Necessary)

The log file rotation is preconfigured and enabled by default.

You can adjust the rotation settings if necessary.
These settings are located in the `/etc/logrotate.d` directory of the filter node's container.


##  The Installation Is Complete

Now the deployment is complete. 

<!-- --8<-- "../include/check-setup-installation-en.md" -->