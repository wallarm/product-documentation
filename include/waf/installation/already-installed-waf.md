!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of already existing Wallarm WAF or need to duplicate the installation in the same environment, please keep the same WAF version as currently used or update the version of all installations to the latest.

    To check the installed version:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        yum list wallarm-node
        ```

    * If the version `2.14.x` is installed, follow the current instruction.
    * If the version `2.12.x` is installed, follow the [instructions for 2.12][2.12-installation-instr] or [update the packages to 2.14][update-instr] in all installations.
    * If the deprecated version is installed (`2.10.x` or lower), please [update the packages to 2.14][update-instr] in all installations.
