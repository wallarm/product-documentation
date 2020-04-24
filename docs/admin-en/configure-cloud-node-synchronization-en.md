[link-aws-installation]:        installation-ami-en.md
[link-gcloud-installation]:     installation-gcp-en.md

[glossary-lom]:                 ../glossary-en.md#lom

[anchor1]:                      #available-environment-variables


# Filter Node and Cloud Synchronization Configuration

!!! warning
    This document describes the variables specified in the Wallarm cloud synchronization configuration file. This file is only created for nodes that were installed in the following clouds:
    
    * [Amazon Web Services][link-aws-installation],
    * [Google Cloud][link-gcloud-installation].

The `/etc/wallarm/syncnode` file contains environment variables that define the way the cloud node will synchronize with the Wallarm cloud. You can configure the synchronization process by adding desired environment variables to this file and assigning your own values to them.

The `wallarm-synccloud` service applies the changes made to the `/etc/wallarm/syncnode` file to the synchronization process and runs the synchronization with the new configuration.

Run the following command to get the list of the environment variables which can be used to configure the synchronization:

```
/usr/share/wallarm-common/synccloud  --help
```

## Configuring Filter Node and Cloud Synchronization

To modify necessary synchronization parameters, proceed with the following steps:
1. Make changes to the `/etc/wallarm/syncnode` file by adding the necessary environment variables from the list in the [Available Environment Variables][anchor1] section of this document to the file and assigning the desired values to them. 
    
    The following example demonstrates the valid `/etc/wallarm/syncnode` contents:
    ```
    WALLARM_API_TOKEN=K85iHWi0SXRxJTb+xxxxxxxxxxxxxxxxxxxxfiwo9twr9I5/+sjZ9v2UlRRgwwMD
    WALLARM_SYNCNODE_INTERVAL=800
    WALLARM_SYNCNODE_TIMEOUT=600
    ```
2. Launch the following command to update synchronization parameters:
    
    ```
    /bin/systemctl restart wallarm-synccloud
    ```
    
    The process will apply the values, that were assigned to the environment variables in the `/etc/wallarm/syncnode` file, as new parameters for node and Wallarm cloud synchronization. After the command execution, the filter node will be performing the synchronization procedure according to the new parameters.


## Available Environment Variables

The following environment variables can be used for synchronization configuration:
* `WALLARM_API_HOST` — Wallarm API host domain name.
    * If you are using the <https://my.wallarm.com/> cloud, the default value will be `api.wallarm.com`.
    * If you are using the <https://us1.my.wallarm.com/> cloud, the default value will be `us1.api.wallarm.com`.
* `WALLARM_API_PORT` — Wallarm API port (default value: `444`).
* `WALLARM_API_TOKEN` — Wallarm Cloud Node token to access the Wallarm API.
* `WALLARM_API_USE_SSL` — enable/disable TLS to connect to the Wallarm API (default value: `yes`). This variable accepts the following values:
    * `true`, `yes`, and `1` to enable TLS.
    * Any other value to disable TLS.
* `WALLARM_API_CA_VERIFY` — enable/disable Wallarm API server certificate verification (default value: `yes`). This variable accepts the following values:
    * `true`, `yes`, and `1` to enable verification.
    * Any other value to disable verification.
* `WALLARM_API_CA_PATH` — path to the Wallarm API certificate authority file. 
* `WALLARM_SYNCNODE` — enable/disable node-specific data synchronization (default value: `yes`). If the synchronization is enabled, the files for the cloud node operation (such as [LOM file][glossary-lom]) will be periodically downloaded from the cloud. If the synchronization is disabled, the files for the cloud node operation will not be downloaded. This variable accepts the following values:
    * `true`, `yes`, and `1` to enable synchronization.
    * Any other value to disable synchronization.
* `WALLARM_SYNCNODE_INTERVAL` — interval between synchronizations in seconds (default value: `600`).
* `WALLARM_SYNCNODE_RAND_DELAY` — synchronization delay jitter in seconds (default value: `300`).
* `WALLARM_SYNCNODE_TIMEOUT` — synchronization duration limit (default value: `900`). This limit allows interrupting the synchronization if any issues occur during the process of downloading the files for the cloud node operation. For example, such issues can be caused by network outages.
* `WALLARM_SYNCNODE_OWNER` — owner for the files needed for the cloud node operation (default value: `root`).
* `WALLARM_SYNCNODE_GROUP` — group for the files needed for the cloud node operation (default value: `wallarm`).
* `WALLARM_SYNCNODE_MODE` — access rights to the files needed for the cloud node operation (default value: `0640`).

!!! warning "Configuration of the access rights to the files needed for the cloud node operation"
    Make sure that after configuring access rights using the `WALLARM_SYNCNODE_OWNER`, `WALLARM_SYNCNODE_GROUP`, and `WALLARM_SYNCNODE_MODE` variables, the `wallarm-worker` and `nginx` services can read content of the files needed for the cloud node operation.