As soon as you have the all-in one script downloaded, you can get help on it with:

```
sudo sh ./wallarm-4.8.7.x86_64-glibc.sh -- -h
```

Which returns:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
    --install-only          In batch mode, this flag starts a stage that copies needed configuration files and automatically sets NGINX for node installation, skipping Cloud registration and activation. Requires --batch flag.
    --skip-ngx-config       A batch mode option that avoids auto NGINX config changes, ideal for later manual adjustments. Works with --install-only and needs --batch flag.
    --register-only         This modifier finalizes setup by registering the node and starting its service, part of batch mode operations. Requires --batch flag.
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
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.x86_64-glibc.sh -- --batch -t <TOKEN>

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Separate execution of node installation stages

The all-in-one installer facilitates node installation and setup through two distinct stages:

1. File copying and NGINX configuration: Copies necessary files and modifies NGINX configurations for node operation. You can bypass the NGINX file modification by using the `--skip-ngx-config` flag if you prefer manual adjustments.
1. Node registration and service start: Registers the node in the Wallarm Cloud and starts the service.

Starting from the all‑in‑one installer version 4.8.7, these phases can be performed separately by utilizing the installer in batch mode with specific flags. The following commands facilitate sequential execution of the described steps.

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.x86_64-glibc.sh
    sudo sh wallarm-4.8.7.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.aarch64-glibc.sh
    sudo sh wallarm-4.8.7.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.x86_64-glibc.sh
    sudo sh wallarm-4.8.7.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.aarch64-glibc.sh
    sudo sh wallarm-4.8.7.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Finally, to complete the installation, you need to [enable Wallarm to analyze traffic][enable-traffic-analysis-step] and [restart NGINX][restart-nginx-step].

### Separate installation of filtering and postanalytics nodes

The filtering/postanalytics switch provides the option to install the postanalytics module [separately][separate-postanalytics-installation-aio]. Without this switch, both filtering and postanalytics components are installed together by default.
