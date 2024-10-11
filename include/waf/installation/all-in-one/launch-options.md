As soon as you have the all-in one script downloaded, you can get help on it with:

```
sudo sh ./wallarm-5.0.3.x86_64-glibc.sh -- -h
```

Which returns:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
    --install-only          Initiates the first stage of the all-in-one installer in batch mode. Copies essential configurations, including files and binaries, and sets up NGINX for node installation, bypassing Cloud registration and activation. Requires --batch.
    --skip-ngx-config       Avoids automatic NGINX configuration changes that occur during the --install-only stage in batch mode, suitable for users who prefer manual adjustments later. When used with --install-only, it ensures only essential configurations are copied without altering NGINX settings. Requires --batch.
    --register-only         Initiates the second stage of the all-in-one installer in batch mode, completing the setup by registering the node in the Cloud and starting its service. Requires --batch.
-t, --token TOKEN           Node token, required in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

### Batch mode

The `--batch` option triggers **batch (non-interactive)** mode, where the script requires configuration options via the `--token` and `--cloud` flags, along with the `WALLARM_LABELS` environment variable if needed. In this mode, the script does not prompt the user for data input step by step as in the default mode; instead, it requires explicit commands for interaction.

Below are examples of commands to run the script in batch mode for node installation, assuming the script has already been [downloaded][download-aio-step]:

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.0.3.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.0.3.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.0.3.x86_64-glibc.sh -- --batch -t <TOKEN>

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.0.3.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Separate execution of node installation stages

When preparing your own machine image using the all-in-one installer for cloud infrastructure, the standard installation process outlined in this article may not suffice. Instead, you will need to execute specific stages of the all-in-one installer separately to accommodate the requirements of creating and deploying a machine image:

1. Build machine image: At this stage, it is necessary to download binaries, libraries, and configuration files of the filtering node and create a machine image based on them. Utilizing the `--install-only` flag, the script copies the required files and modifies NGINX configurations for node operation. If you wish to make manual adjustments, you can opt to bypass the NGINX file modification by using the `--skip-ngx-config` flag.
1. Initialize a cloud instance with cloud-init: During instance initialization, the bootstrap phase (cloud registration and service start) can be executed using cloud-init scripts. This stage can be run independently from the build phase by applying the `--register-only` flag to the `/opt/wallarm/setup.sh` script copied during the build stage.

This functionality is supported starting from version 4.10.0 of the all-in-one installer in batch mode. The commands below enable the sequential execution of the outlined steps:

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/5.0/wallarm-5.0.3.x86_64-glibc.sh
    sudo sh wallarm-5.0.3.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/5.0/wallarm-5.0.3.aarch64-glibc.sh
    sudo sh wallarm-5.0.3.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/5.0/wallarm-5.0.3.x86_64-glibc.sh
    sudo sh wallarm-5.0.3.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/5.0/wallarm-5.0.3.aarch64-glibc.sh
    sudo sh wallarm-5.0.3.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Finally, to complete the installation, you need to [enable Wallarm to analyze traffic][enable-traffic-analysis-step] and [restart NGINX][restart-nginx-step].

### Separate installation of filtering and postanalytics nodes

The filtering/postanalytics switch provides the option to install the postanalytics module [separately][separate-postanalytics-installation-aio]. Without this switch, both filtering and postanalytics components are installed together by default.
