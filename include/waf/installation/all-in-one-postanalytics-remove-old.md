1. Delete the old postanalytics module in Wallarm Console → **Nodes** by selecting your postanalytics module node and clicking **Delete**.
1. Confirm the action.
    
    When the postanalytics module node is deleted from the Cloud, it will stop participating in the filtration of requests to your applications. Deleting cannot be undone. The postanalytics module node will be deleted from the list of nodes permanently.

1. Delete the machine with the old postanalytics module or just clean it of Wallarm postanalytics module components:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```