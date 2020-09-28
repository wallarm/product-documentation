[docs-module-update]:   nginx-modules.md

#   Updating the Separately Installed Postanalytics Module  

These instructions describe the steps to update the postanalytics module installed on a separate server. Postanalytics module must be updated before [updating the WAF node modules][docs-module-update].

## Step 1: Add new Wallarm WAF repositories

--8<-- "../include/migration-212-214/add-new-repo.md"

## Step 2: Install updated Tarantool packages

=== "Debian"
    ```bash
    sudo apt install wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt install wallarm-node-tarantool
    ```
=== "CentOS или Amazon Linux 2"
    ```bash
    sudo yum update wallarm-node-tarantool
    ```

## Step 3: Restart the postanalytics module

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 6.x"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x или Amazon Linux 2"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
