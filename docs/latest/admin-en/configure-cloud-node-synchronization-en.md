# Filtering node and Wallarm Cloud synchronization configuration

The filtering node regularly synchronizes with the Wallarm Cloud to:

* Get updates for [traffic processing rules (LOM)](../about-wallarm-waf/protecting-against-attacks.md#custom-rules-for-request-analysis)
* Get updates of [proton.db](../about-wallarm-waf/protecting-against-attacks.md#library-libproton)
* Send data on detected attacks and vulnerabilities
* Send metrics for processed traffic

These instructions describe parameters and methods used to configure filtering node and Wallarm Cloud synchronization.

The set of parameters and the method of its configuration depend on the deployed Wallarm node type:

* **Cloud filtering node** created by the `addcloudnode` script
* **Regular filtering node** created by the `addnode` script

## Cloud node and Wallarm Cloud synchronization

The `/etc/wallarm/syncnode` file contains environment variables that define the way the cloud filtering node will synchronize with the Wallarm Cloud. The `/etc/wallarm/syncnode` file containing the variable `WALLARM_API_TOKEN` with the cloud node token is created after running the `addcloudnode` script.

The `wallarm-synccloud` service applies the changes made to the `/etc/wallarm/syncnode` file to the synchronization process and runs the synchronization with the new configuration.

### Available environment variables

The list of environment variables available for the cloud node and Wallarm Cloud synchronization configuration is provided below. To get the list of available environment variables, you can also run the following command:

```
/usr/share/wallarm-common/synccloud  --help
```

| Variable                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `WALLARM_API_HOST`            | Wallarm API endpoint. Can be:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>Default value is `api.wallarm.com`.<br>This variable is **required** to be set in the file `/etc/wallarm/syncnode`.                                                                                                                                                                                                                                                    |
| `WALLARM_API_PORT`            | Wallarm API port. Default value is `444`.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `WALLARM_API_TOKEN`           | Cloud node token to access the Wallarm API.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `WALLARM_API_CA_VERIFY`       | Whether to enable/disable Wallarm API server certificate verification. Can be:<ul><li>`true`, `yes`, and `1` to enable verification</li><li>Any other value to disable verification</li></ul>Default value is `yes`.                                                                                                                                                                                                                                                                                   |
| `WALLARM_API_CA_PATH`         | Path to the Wallarm API certificate authority file.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `WALLARM_SYNCNODE`            | Whether to enable/disable Wallarm node‑specific data synchronization. If the synchronization is enabled, the files for the cloud node operation (such as [LOM file](../glossary-en.md#lom)) will be periodically downloaded from the Cloud. If the synchronization is disabled, the files for the cloud node operation will not be downloaded. Can be:<ul><li>`true`, `yes`, and `1` to enable synchronization</li><li>Any other value to disable synchronization</li></ul>Default value is `yes`. |
| `WALLARM_SYNCNODE_INTERVAL`   | Interval between filtering node and Wallarm Cloud synchronizations in seconds. The value cannot be less than the default value. Default value is `120`.                                                                                                                                                                                                                                                                                                                                                      |
| `WALLARM_SYNCNODE_RAND_DELAY` | Synchronization delay jitter in seconds. Default value is `120`.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `WALLARM_SYNCNODE_TIMEOUT`    | Synchronization duration limit. This limit allows interrupting the synchronization if any issues occur during the process of downloading the files for the cloud node operation. For example, such issues can be caused by network outages. Default value is `900`.                                                                                                                                                                                                                                |
| `WALLARM_SYNCNODE_OWNER`<br>`WALLARM_SYNCNODE_GROUP`<br>`WALLARM_SYNCNODE_GROUP` | See [Access rights to files needed for node operation](#access-rights-to-files-needed-for-node-operation).  |

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
    
    The service will apply the values assigned to the environment variables in the `/etc/wallarm/syncnode` file as new parameters for the cloud node and Wallarm Cloud synchronization. After the command execution, the filtering node will be performing the synchronization procedure according to the new parameters.

## Regular node and Wallarm Cloud synchronization

Configuration of the regular filtering node and Wallarm Cloud synchronization is set in the following way:

* [Credentials to access the Wallarm Cloud](#credentials-to-access-the-wallarm-cloud) are set in the `node.yaml` file. The `node.yaml` file containing the regular filtering node name and UUID, and secret key to access Wallarm API is created after running the `addnode` script.

    Default path to the file is `/etc/wallarm/node.yaml`. This path can be changed via the [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) directive.
* [Interval between filtering node and Wallarm Cloud synchronizations](#interval-between-filtering-node-and-wallarm-cloud-synchronizations) is set via the system environment variable `WALLARM_SYNCNODE_INTERVAL`. Variable value should be set in the `/etc/environment` file. Default variable value is `120` seconds.

### Credentials to access the Wallarm Cloud

The `node.yaml` file may contain the following parameters for accessing the regular filtering node to the Wallarm Cloud:

| Parameter         | Description                                                                                                                                                                                                                                                              |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hostname`       | Regular node name. This variable is **required** to be set in the file `node.yaml`.                                                                                                                                                                                                       |
| `uuid`           | Regular node UUID. This variable is **required** to be set in the file `node.yaml`.                                                                                                                                                                            |
| `secret`         | Secret key to access the Wallarm API. This variable is **required** to be set in the file `node.yaml`.                                                                                                                                                            |
| `api.host`       | Wallarm API endpoint. Can be:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>Default value is `api.wallarm.com`.           |
| `api.port`       | Wallarm API port. Default value is `444`.                                                                                                                                                                                                                   |
| `api.ca_verify`  | Whether to enable/disable Wallarm API server certificate verification. Can be:<ul><li>`true` to enable verification</li><li>`false` to disable verification</li></ul>Default value is `true`. |
| `api.local_host` | Local IP address of the network interface through which requests to Wallarm API are sent. This parameter is required if the network interface used by default restricts access to Wallarm API (for example, access to the Internet may be closed).
| `api.local_port` | Port of the network interface through which requests to Wallarm API are sent. This parameter is required if the network interface used by default restricts access to Wallarm API (for example, access to the Internet may be closed).
| `syncnode.owner`<br>`syncnode.group`<br>`syncnode.mode` | See [Access rights to files needed for node operation](#access-rights-to-files-needed-for-node-operation). |

To change synchronization parameters, proceed with the following steps:

1. Make changes to the `node.yaml` file by adding the required [parameters](#credentials-to-access-the-wallarm-cloud) and assigning the desired values to them.

    The valid `node.yaml` contents:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    secret: b827axxxxxxxxxxxcbe45c855c71389a2a5564920xxxxxxxxxxxxxxxxxxc4613260

    api:
      host: api.wallarm.com
      port: 444
      ca_verify: true

    syncnode:
      owner: root
      group: wallarm
      mode: 0640
    ```
2. Restart NGINX to apply updated settings to the synchronization process:

    --8<-- "../include/waf/restart-nginx-3.6.md"

### Interval between filtering node and Wallarm Cloud synchronizations

By default, the filtering node synchronizes with the Wallarm Cloud every 120‑240 seconds (2‑4 minutes). You can change the synchronization interval via the system environment variable `WALLARM_SYNCNODE_INTERVAL`.

To change the interval between regular filtering node and Wallarm Cloud synchronizations:

1. Open the file `/etc/environment`.
2. Add the `WALLARM_SYNCNODE_INTERVAL` variable to the file and set a desired value to the variable in seconds. The value cannot be less than the default value (`120` seconds). For example:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. Save the changed file `/etc/environment`. New interval value will be applied to the synchronization process automatically.

## Access rights to files needed for node operation

The `wallarm-worker` and `nginx` services are usually automatically provided with the permission to read the content of the files needed for the cloud node operation, such as proton.db and custom ruleset file. However, if testing shows no access, read the description below of how the permissions are provided and how they can be configured manually.

The file access parameters are:

| Parameter    | Description | Environment variable in `/etc/wallarm/syncnode` file <br> (cloud node) | Parameter in `node.yaml` file <br> (regular node) |
|--------------|-------------| -------------| -------------|
| `owner`      | Owner for the files needed for the cloud node operation. | `WALLARM_SYNCNODE_OWNER` | `syncnode.owner` |
| `group`      | Group for the files needed for the cloud node operation. | `WALLARM_SYNCNODE_GROUP` | `syncnode.group` |
| `mode`       | Access rights to the files needed for the cloud node operation. | `WALLARM_SYNCNODE_MODE` | `syncnode.mode`  |

The algorithm searches for the file permissions performing the following steps (goes to the next step only if the previous one did not give the result):

1. Explicitly configured variables/parameters:

    === "For cloud node"

        1. The `WALLARM_SYNCNODE_(OWNER,GROUP,MODE)` environment variables in the `/etc/wallarm/syncnode` file.

    === "For regular node"

        1. The `syncnode.(TYPE).(user,group,mode)` parameters in the `node.yaml` file.

            `(TYPE)` allows you to specify the particular file the parameter is set for. Possible values are `proton.db` or `lom`.

            !!! warning
                Pay your attention that the `lom` value points to the [custom ruleset](../user-guides/rules/compiling.md) file `/etc/wallarm/custom_ruleset`.
        1. The `syncnode.(user,group,mode)` parameters in the `node.yaml` file.
1. For NGINX-based installation, value of the `nginx_group` in the `/usr/share/wallarm-common/engine/*` file.

    !!! info "Engine packages nginx_group"
        All installed engine packages provide the file `/usr/share/wallarm-common/engine/*` containing `nginx_group=<VALUE>`.
1. Defaults:
    * `owner`: `root`
    * `group`: `wallarm`
    * `mode`: `0640`

For NGINX-based installation, the logic described above leads to the process where each package with the module sets the value for the `group` parameter depending on the NGINX for which it was intended:

* The modules for NGINX from nginx.org set `group` to `nginx`.
* The modules for NGINX distributives set `group` to `www-data`.
* The custom modules use values provided by a client.

Note that you only need to configure access rights explicitly if the result achieved by the algorithm automatically does not suit your needs. After configuring access rights, make sure that the `wallarm-worker` and `nginx` services can read the content of the files needed for the cloud node operation.
