#   Blocking by iptables

In most cases, blocking by request is preferred over blocking by IP address.
However, there are a number of cases when you need to block by IP address:

*   To reduce the traffic that the attacker requests generate.
*   To handle asynchronous traffic.
*   In the presence of additional resources not protected by WAF.

To block by IP address, use the `block_with_iptables.rb` script, which is modifiable.

To effectively use the script, the filter node must regularly download
from the Wallarm cloud an updated list of the IP addresses to be blocked.

!!! info "Whitelist"
    You can whitelist an IP address. A whitelisted IP address is allowed to request the web application's server and bypasses the blacklist check.

##  Set up Blocking by IP Address

1.  Contact [Wallarm Support](mailto:support@wallarm.com) and request to create a system user with access to the blacklists.

2.  Install the `wallarm_extra_scripts` package. This package is in the Wallarm repository. 

    Run the command:

    === "Debian 9.x (stretch)"
        ```bash
        sudo apt install wallarm-extra-scripts
        ```
    === "Debian 10.x (buster)"
        ```bash
        sudo apt install wallarm-extra-scripts
        ```
    === "Ubuntu 16.04 LTS (xenial)"
        ```bash
        sudo apt install wallarm-extra-scripts
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt install wallarm-extra-scripts
        ```
    === "CentOS 6.x"
        ```bash
        sudo yum install wallarm-extra-scripts
        ```
    === "CentOS 7.x"
        ```bash
        sudo yum install wallarm-extra-scripts
        ```
    === "Amazon Linux 2"
        ```bash
        sudo yum install wallarm-extra-scripts
        ```

    The `block_with_iptables.rb` script will be installed automatically. On each start, the script creates or updates the `wallarm_blacklist` chain in the table `filter`. Each blocked IP address gets the rule `REJECT`.

3.  Create and configure the `iptables` to specify what traffic must be blocked. For example, to block all traffic on port 80 and port 443, run:

    ```
    iptables -N wallarm_check
    iptables -N wallarm_blacklist
    iptables -A INPUT -p tcp --dport 80 -j wallarm_check
    iptables -A INPUT -p tcp --dport 443 -j wallarm_check
    iptables -A wallarm_check -j wallarm_blacklist
    ```
  
4.  Set up regular execution of the script by using the `cron` utility:
    
    1.  Open the `root` user's `crontab` file for editing:
    
        ```
            ```bash
        crontab -e
        ```
    
    2.  Add the following lines to the file (replace the `/path/to/log` entry with the actual path to a log file, so that the script can write the logs into it):
    
        ```
        PATH=/bin:/sbin:/usr/bin:/usr/sbin
        */5 *  * * *  root  timeout 90 /usr/share/wallarm-extra-scripts/block_with_iptables.rb >> /path/to/log 2>&1
        ```  
        
        These lines define the following behavior of a `cron` job:

        *   The `block_with_iptables.rb` script will be executed every fifth minute on behalf of the `root` user.
        *   If the script does not finish within the 90 second timeout, then its execution will be explicitly terminated.
        *   The script's logs will be written in the specified log file (e.g, `/path/to/log`); the `stderr` error output stream will be redirected to the `stdout` standard output stream.
         
5.  If necessary, set up script monitoring. You can monitor the script by checking the modification time `mtime` of the file `/tmp/.wallarm.blacklist-sync.last` because it changes every time the script starts successfully.

6.  Whitelisting IP addresses. 

    To whitelist several IP addresses, run the following command for the range of IP addresses. Replace `1.2.3.4/30` with the necessary value:

    ```
    iptables -I wallarm_check -s 1.2.3.4/30 -j RETURN
    ```

    To whitelist one IP address, replace `1.2.3.4` with the necessary value:

    ```
    iptables -I wallarm_check -s 1.2.3.4 -j RETURN
    ```
