!!! info "If you deploy several Wallarm nodes"
    All Wallarm nodes deployed to your environment must be of the **same versions**. The postanalytics modules installed on separated servers must be of the **same versions** too.

    Before installation of the additional node, please ensure its version matches the version of already deployed modules. If the deployed module version is [deprecated or will be deprecated soon (`3.6` or lower)][versioning-policy], upgrade all modules to the latest version.

    The version of deployed Wallarm filtering node image is specified in the Deployment template → `spec.template.spec.containers` section → `image` of the Wallarm container.
