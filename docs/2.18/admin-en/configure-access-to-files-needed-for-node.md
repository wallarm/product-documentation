# Configuring access rights to files needed for node operation

The `wallarm-worker` and `nginx` services are usually automatically provided with the permission to read the content of the files needed for the filtering node operation, such as proton.db and custom ruleset file. However, if testing shows no access, read the description below of how the permissions are provided and how they can be configured manually.

## Configuring file access

Parameters providing the access to files needed for the node operation may be set explicitly in the `node.yaml` file. This file is automatically created after running the `register-node` script. Default path to the file is `/etc/wallarm/node.yaml`. This path can be changed via the [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) directive.

The `node.yaml` file may contain the following file access parameters:

| Parameter    | Description |
|--------------|-------------|
| `syncnode.owner` | Owner for the files needed for the filtering node operation. |
| `syncnode.group` | Group for the files needed for the filtering node operation. |
| `syncnode.mode`  | Access rights to the files needed for the filtering node operation. |

The algorithm searches for the file permissions performing the following steps (goes to the next step only if the previous one did not give the result):

1. Explicitly configured `syncnode.(TYPE).(user,group,mode)` parameters in the `node.yaml` file.

    `(TYPE)` allows you to specify the particular file the parameter is set for. Possible values are `proton.db` or `lom`.

    !!! warning "`lom` value meaning"
        Pay your attention that the `lom` value points to the [custom ruleset](../user-guides/rules/compiling.md) file `/etc/wallarm/custom_ruleset`.

1. Explicitly configured `syncnode.(user,group,mode)` parameters in the `node.yaml` file.
1. For NGINX-based installation, value of the `nginx_group` in the `/usr/share/wallarm-common/engine/*` file.

    All installed engine packages provide the file `/usr/share/wallarm-common/engine/*` containing `nginx_group=<VALUE>`.

    Each package with the module sets the value for the `group` parameter depending on the NGINX for which it was intended:

    * The modules for NGINX from nginx.org set `group` to `nginx`.
    * The modules for NGINX distributives set `group` to `www-data`.
    * The custom modules use values provided by a client.
    
1. Defaults:
    * `owner`: `root`
    * `group`: `wallarm`
    * `mode`: `0640`

Note that you only need to configure access rights explicitly if the result achieved by the algorithm automatically does not suit your needs. After configuring access rights, make sure that the `wallarm-worker` and `nginx` services can read the content of the files needed for the filtering node operation.

## Configuration example

Note that besides file access parameters (`syncnode` section, described in this article), the `node.yaml` file will also contain parameters providing filtering node [the access to the Cloud](configure-cloud-node-synchronization-en.md) (general and `api` sections).

--8<-- "../include/node-cloud-sync-configuration-example.md"
