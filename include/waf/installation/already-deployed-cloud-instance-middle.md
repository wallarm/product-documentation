!!! info "If Wallarm node is already deployed"
    If you launch Wallarm node instead of the already existing Wallarm node or need to duplicate the deployment in the same environment, please keep the same node version as currently used or update the version of all deployments to the latest.

    To check the launched version, connect to the running instance and execute the following command:

    ```
    apt list wallarm-node
    ```

    * If the version `3.0.x` is installed, then follow the [instructions for 3.0][installation-instr-latest].
    * If the version `2.18.x` is installed, then follow the current instructions or [update](/updating-migrating/cloud-image/) all Wallarm instances to the latest version.
    * If the version `2.16.x` or lower is installed, then please [update](/updating-migrating/cloud-image/) all Wallarm instances to the latest version. Support for installed versions will be deprecated soon.

    More information about Wallarm node versioning is available in the [Wallarm node versioning policy][versioning-policy].
