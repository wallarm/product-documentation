[img-collectd-nagios]:      ../../images/monitoring/collectd-nagios.png

[link-nagios]:              https://www.nagios.org/
[link-nagios-core]:         https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]:           https://github.com/NagiosEnterprises/nrpe/blob/master/README.md
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]:       https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-nrpe-readme]:         https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]:            https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]:              ../../admin-en/monitoring/available-metrics.md#number-of-requests

[doc-gauge-abnormal]:        available-metrics.md#number-of-requests
[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]:          #7-add-commands-to-the-nrpe-service-configuration-file-on-the-filter-node-to-get-the-required-metrics

#   Exporting Metrics to Nagios via the `collectd-nagios` Utility

This document provides an example of exporting filter node metrics to the [Nagios][link-nagios] monitoring system (the [Nagios Core][link-nagios-core] edition is suggested; however, this document is suitable for any Nagios edition) using the [`collectd-nagios`][link-collectd-nagios] utility.


!!! info "Assumptions and requirements"
    *   The `collectd` service must be configured for working via a Unix domain socket (see [here][doc-unixsock] for details).
    *   It is assumed that you already have the Nagios Core edition installed.
        
        If not, install Nagios Core (for example, follow these [instructions][link-nagios-core-install]).
    
        You can use another edition of Nagios if necessary (for example, Nagios XI).
        
        The “Nagios” term will be used hereinafter to refer to any edition of Nagios, unless stated otherwise.
        
    *   You must have the ability to connect to the filter node and the Nagios host (for example, via the SSH protocol), and work under the `root` account or another account with superuser rights.
    *   The [Nagios Remote Plugin Executor][link-nrpe-docs] service (which will be referred to as *NRPE* throughout this example) must be installed on the filter node.   

##  Example Workflow

--8<-- "../include/monitoring/metric-example.md"

![Example workflow][img-collectd-nagios]

The following deployment scheme is used in this document:
*   The Wallarm filter node is deployed on a host accessible via the `10.0.30.5` IP address and the `node.example.local` fully qualified domain name.
*   Nagios is installed on a separate host accessible via the `10.0.30.30` IP address.
*   To execute commands on a remote host, the NRPE plugin is used. The plugin comprises
    *   The `nrpe` service that is installed on the monitored host alongside the filter node. It listens on the `5666/TCP` standard NRPE port.
    *   The `check_nrpe` NRPE Nagios plugin that is installed on the Nagios host and allows Nagios to execute commands on the remote host where the `nrpe` service is installed.
*   NRPE will be used to call the `collectd_nagios` utility that provides the `collectd` metrics in a Nagios‑compatible format.

##  Configuring Metrics Export to Nagios


!!! info "A note on this installation example"
    This document describes how to install and configure the NRPE plugin when Nagios is already installed with default parameters (it is assumed that Nagios is installed in the `/usr/local/nagios` directory, and uses the `nagios` user to operate). If you are doing a non-default installation of the plugin or Nagios, adjust the corresponding commands and instructions from the document as needed.

To configure metrics export from the filter node to Nagios, follow these steps:

### 1.  Configure NRPE to Communicate with the Nagios Host 

To do this, on a filter node host: 
1.  Open the NRPE configuration file (default: `/usr/local/nagios/etc/nrpe.cfg`).
    
2.  Add the IP address or fully qualified domain name of the Nagios server to the `allowed_hosts` directive in this file. For example, if the Nagios host uses the `10.0.30.30` IP address:
    
    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
    
3.  Restart the NRPE service by executing the appropriate command:

    --8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 2.  Install the Nagios NRPE Plugin on the Nagios Host

To do this, on the Nagios host, take the following steps:
1.  Download and unzip the source files for the NRPE plugin, and install the necessary utilities to build and install the plugin (see the [NRPE documentation][link-nrpe-docs] for details). 
2.  Go to the directory with the plugin source code, build from sources, then install the plugin.

    The minimal steps to take are:
    
    ```
    ./configure
    make all
    make install-plugin
    ```
    
### 3.  Make Sure the NRPE Nagios Plugin Successfully Interacts with the NRPE Service

To do this, execute the following command on the Nagios host:

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

If NRPE is operating normally, the command’s output should contain an NRPE version (e.g., `NRPE v3.2.1`).

### 4.  Define the `check_nrpe` Command to Run the NRPE Nagios Plugin with a Single Argument on the Nagios Host

To do this, add to the `/usr/local/nagios/etc/objects/commands.cfg` file the following lines:

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5. Install the `collectd_nagios` Utility on the Filter Node Host

Execute one of the following commands:

--8<-- "../include/monitoring/install-collectd-utils.md"

### 6.  Configure the `collectd-nagios` Utility to Run with Elevated Privileges on Behalf of the `nagios` User

To do this, perform the following steps on the filter node host:
1.  Using the [`visudo`][link-visudo] utility, add the following line to the `/etc/sudoers` file:
    
    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    This allows the `nagios` user to run the `collectd-nagios` utility with superuser privileges using `sudo` without the need to provide any passwords.

    
    !!! info "Running `collectd-nagios` with superuser privileges"
        The utility must be run with superuser privileges because it uses the `collectd` Unix domain socket to receive data. Only a superuser can access this socket.

2.  Make sure that the `nagios` user can receive metric values from `collectd` by executing the following test command:
    
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    This command allows the `nagios` user to get the value of the [`wallarm_nginx/gauge-abnormal`][link-metric] metric (the number of processed requests) for the `node.example.local` host.
    
    **Example of command output:**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  Add a prefix to the NRPE service configuration file so that it will be able to execute commands using the `sudo` utility:
    
    ```
    command_prefix=/usr/bin/sudo
    ```

### 7.  Add Commands to the NRPE Service Configuration File on the Filter Node to Get the Required Metrics

For example, to create a command named `check_wallarm_nginx_abnormal` that will receive the `wallarm_nginx/gauge-abnormal` metric for the filter node with the `node.example.local` fully qualified domain name, add the following line to the NRPE service’s configuration file:

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```


!!! info "How to set threshold values for a metric"
    If necessary, you can specify a range of values for which the `collectd-nagios` utility will return the `WARNING` or `CRITICAL` status by using the corresponding `-w` and `-c` options (detailed information is available in the utility [documentation][link-collectd-docs]).


After you have added all necessary commands to the NRPE service configuration file, restart the service by executing the appropriate command:

--8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 8.  On the Nagios Host, Use the Configuration Files to Specify the Filter Node Host and to Define the Services to Monitor


!!! info "Services and Metrics"
    This document assumes that one Nagios service is equivalent to one metric.


For example, this can be done as follows:
1.  Create a `/usr/local/nagios/etc/objects/nodes.cfg` file with the following contents:
    
    ```
    define host{
     use linux-server
     host_name node.example.local
     address 10.0.30.5
    }

    define service {
      use generic-service
      host_name node.example.local
      check_command check_nrpe!check_wallarm_nginx_abnormal
      max_check_attempts 5
      service_description wallarm_nginx_abnormal
    }
    ```

    This file defines the `node.example.local` host with the `10.0.30.5` IP address and the command to check the status of the `wallarm_nginx_abnormal` service, which means receiving the `wallarm_nginx/gauge-abnormal` metric from the filter node (see the description of the [`check_wallarm_nginx_abnormal`][anchor-header-7] command).

2.  Add the following line to the Nagios configuration file (by default, `/usr/local/nagios/etc/nagios.cfg`):
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    This is necessary for Nagios to start using the data from the `nodes.cfg` file on the next start.

3.  Restart the Nagios service by running the appropriate command:

--8<-- "../include/monitoring/nagios-restart-2.16.md"

## Setup is Complete

Nagios is now monitoring the service associated with the specific metric of the filter node. If necessary, you can define other commands and services to check the metrics you are interested in.


!!! info "Information about NRPE"
    Sources of additional information about NRPE:
    
    *   [README][link-nrpe-readme] of the NRPE on GitHub;
    *   NRPE documentation ([PDF][link-nrpe-pdf]).
