# WAF node and Wallarm Cloud synchronization configuration

## Cloud WAF node and Wallarm Cloud synchronization

!!! warning
    This document describes the variables specified in the Wallarm cloud synchronization configuration file. This file is only created for nodes that were installed in the following clouds:
    
    * [Amazon Web Services][link-aws-installation],
    * [Google Cloud][link-gcloud-installation].

The `/etc/wallarm/syncnode` file contains environment variables that define the way the cloud WAF node will synchronize with the Wallarm Cloud. The `/etc/wallarm/syncnode` file containing the variable `WALLARM_API_TOKEN` with the cloud WAF node token is created after running the `addcloudnode` script.

The `wallarm‑synccloud` service applies the changes made to the `/etc/wallarm/syncnode` file to the synchronization process and runs the synchronization with the new configuration.

### Available environment variables

The list of environment variables available for the cloud WAF node and Wallarm Cloud synchronization configuration is provided below. To get the list of available environment variables, you can also run the following command:

```
/usr/share/wallarm-common/synccloud  --help
```

| Variable                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `WALLARM_API_HOST`            | Wallarm API endpoint. Can be:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>Default value is `api.wallarm.com`.<br>This variable is **required** to be set in the file `/etc/wallarm/syncnode`.                                                                                                                                                                                                                                                    |
| `WALLARM_API_PORT`            | Wallarm API port. Default value is `444`.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `WALLARM_API_TOKEN`           | Cloud WAF node token to access the Wallarm API.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `WALLARM_API_USE_SSL`         | Whether to enable/disable TLS to connect to the Wallarm API. Can be:<ul><li>`true`, `yes`, and `1` to enable TLS</li><li>Any other value to disable TLS</li></ul>Default value is `yes`.                                                                                                                                                                                                                                                                                                               |
| `WALLARM_API_CA_VERIFY`       | Whether to enable/disable Wallarm API server certificate verification. Can be:<ul><li>`true`, `yes`, and `1` to enable verification</li><li>Any other value to disable verification</li></ul>Default value is `yes`.                                                                                                                                                                                                                                                                                   |
| `WALLARM_API_CA_PATH`         | Path to the Wallarm API certificate authority file.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `WALLARM_SYNCNODE`            | Whether to enable/disable WAF node‑specific data synchronization. If the synchronization is enabled, the files for the cloud WAF node operation (such as [LOM file](../glossary-en.md#lom)) will be periodically downloaded from the Cloud. If the synchronization is disabled, the files for the cloud WAF node operation will not be downloaded. Can be:<ul><li>`true`, `yes`, and `1` to enable synchronization</li><li>Any other value to disable synchronization</li></ul>Default value is `yes`. |
| `WALLARM_SYNCNODE_INTERVAL`   | Interval between WAF node and Wallarm Cloud synchronizations in seconds. Default value is `600`.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `WALLARM_SYNCNODE_RAND_DELAY` | Synchronization delay jitter in seconds. Default value is `300`.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `WALLARM_SYNCNODE_TIMEOUT`    | Synchronization duration limit. This limit allows interrupting the synchronization if any issues occur during the process of downloading the files for the cloud WAF node operation. For example, such issues can be caused by network outages. Default value is `900`.                                                                                                                                                                                                                                |
| `WALLARM_SYNCNODE_OWNER`      | Owner for the files needed for the cloud WAF node operation. Default value is `root`.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `WALLARM_SYNCNODE_GROUP`      | Group for the files needed for the cloud WAF node operation. Default value is `wallarm`.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `WALLARM_SYNCNODE_MODE`       | Access rights to the files needed for the cloud WAF node operation. Default value is `0640`.                                                                                                                                                                                                                                                                                                                                                                                                           |

!!! warning "Configuration of the access rights to the files needed for the cloud WAF node operation"
    Make sure that after configuring access rights using the `WALLARM_SYNCNODE_OWNER`, `WALLARM_SYNCNODE_GROUP`, and `WALLARM_SYNCNODE_MODE` variables, the `wallarm‑worker` and `nginx` services can read content of the files needed for the cloud WAF node operation.

### Configuring synchronization parameters

To change synchronization parameters, proceed with the following steps:

1. Make changes to the `/etc/wallarm/syncnode` file by adding the required [environment variables](#available-environment-variables) and assigning the desired values to them.
    
    The valid `/etc/wallarm/syncnode` contents:

    ```bash
    WALLARM_API_TOKEN=K85iHWi0SXRxJTb+xxxxxxxxxxxxxxxxxxxxfiwo9twr9I5/+sjZ9v2UlRRgwwMD
    WALLARM_SYNCNODE_INTERVAL=800
    WALLARM_SYNCNODE_TIMEOUT=600
    ```
2. Restart the `wallarm-synccloud` service to apply updated settings to the synchronization process:
    
    ```bash
    sudo /bin/systemctl restart wallarm-synccloud
    ```
    
    The service will apply the values assigned to the environment variables in the `/etc/wallarm/syncnode` file as new parameters for the cloud WAF node and Wallarm Cloud synchronization. After the command execution, the WAF node will be performing the synchronization procedure according to the new parameters.
