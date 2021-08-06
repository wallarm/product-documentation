!!! info "If Wallarm node is already deployed"
    If you launch Wallarm node instead of the already existing Wallarm node or need to duplicate the deployment in the same environment, please keep the same node version as currently used or update the version of all deployments to the latest.

    To check the launched version, connect to the running instance and execute the following command:

    ```
    apt list wallarm-node
    ```

    * If the version `3.2.x` is installed, then follow the [instructions for 3.2][installation-instr-latest].
    * If the version `3.0.x` is installed, then please [update](/updating-migrating/cloud-image/) all Wallarm instances to the latest version. We recommend upgrading modules 3.0 to the [latest version](/updating-migrating/what-is-new/) since it enables new features of controlling access to applications by IP addresses and simplifies the logic of some filtration modes.
    * If the version `2.18.x` or lower is installed, then please [update](/updating-migrating/cloud-image/) all Wallarm instances to the latest version. Support for installed versions will be deprecated soon.

    More information about Wallarm node versioning is available in the [Wallarm node versioning policy][versioning-policy].
