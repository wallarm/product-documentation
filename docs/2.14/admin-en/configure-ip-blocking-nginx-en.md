# Blocking with NGINX

By default, blocking by IP address is turned off. To activate it, proceed to the following steps:

1.  Go to the folder that contains the NGINX configuration files:

    ```bash
    cd /etc/nginx/conf.d
    ```

2.  In the current folder, create a file named `/etc/nginx/conf.d/wallarm‑acl.conf` with the following content:

    ```
    wallarm_acl_db default {
        wallarm_acl_path <path-to-wallarm-acl-folder>;
        wallarm_acl_mapsize 64m;
    }
    
    server {
        listen 127.0.0.9:80;
    
        server_name localhost;
    
        allow 127.0.0.0/8;
        deny all;
    
        access_log off;
    
        location /wallarm-acl {
            wallarm_acl default;
            wallarm_acl_api on;
        }
    }
    ```
    
    In the configuration above, `<path‑to‑wallarm‑acl‑folder>` is a path to an empty directory, in which the `nginx` user can create subdirectories and files for storing access control lists.
    
    !!! info "Checking the `nginx` user rights"
        Run the following command to check whether the `nginx` user has rights to perform actions on the directory:
        ```bash
        sudo -u nginx [ -r <path-to-directory> ] && [ -w <path-to-directory> ] && echo "ОК"
        ```

        In this command, `<path‑to‑directory>` is the path to the directory, access to which you need to check.
         
        Due to the `sudo -u nginx` prefix, this command is executed using the `nginx` user.
        
        The command first checks whether the user has permission to read the directory (the `[ ‑r <path‑to‑directory> ]` part). Next, it checks whether the user has permission to write into the directory (the `[ ‑w <path‑to‑directory> ]` part).   
        
        If the `nginx` user has permission to read and write into the directory specified in the command, the terminal outputs the `OK` message. The specified directory can be used as a `wallarm_acl_path` value.
        
        If the `nginx` user does not have the required permission, the terminal output is empty.
    
    **Example:**
    
    Directories that are valid for access control list storage depend on the filter node installation method you used and your OS. The valid directories to specify in the `wallarm_acl_path` directive are as follows:

    *   Dynamic NGINX module:
    
        === "Debian 9.x (stretch)"
            ```basn
            /var/cache/nginx/wallarm_acl_default
            ```
        === "Debian 10.x (buster)"
            ```basn
            /var/cache/nginx/wallarm_acl_default
            ```
        === "Ubuntu 16.04 LTS (xenial)"
            ```basn
            /var/cache/nginx/wallarm_acl_default
            ```
        === "Ubuntu 18.04 LTS (bionic)"
            ```basn
            /var/cache/nginx/wallarm_acl_default
            ```
        === "CentOS 6.x"
            ```basn
            /var/cache/nginx/wallarm_acl_default
            ```
        === "CentOS 7.x"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Amazon Linux 2"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
    
    *   Dynamic NGINX module from OS repositories:
    
        === "Debian 9.x (stretch)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Debian 10.x (buster)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Ubuntu 16.04 LTS (xenial)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Ubuntu 18.04 LTS (bionic)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "CentOS 6.x"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "CentOS 7.x"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Amazon Linux 2"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
    
    *   NGINX Plus module:
    
        === "Debian 9.x (stretch)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Debian 10.x (buster)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Ubuntu 16.04 LTS (xenial)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Ubuntu 18.04 LTS (bionic)"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "CentOS 6.x"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "CentOS 7.x"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
        === "Amazon Linux 2"
            ```basn
            /var/lib/nginx/wallarm_acl_default
            ```
         
3.  Turn on blocking for the particular vhosts and/or locations by adding the following lines to their configuration files:

    ```
    server {
        ...
        wallarm_acl default;
        ...
    }
    ```

4.  Add the following lines to the `/etc/wallarm/node.yaml` file:

    ```
    sync_blacklist:
        nginx_url: http://127.0.0.9/wallarm-acl
    ```
5.  Restart NGINX:

    ```bash
    sudo service nginx reload
    ```

6.  Activate the blacklist synchronization. 

    One way to do this is to uncomment the line containing `sync‑blacklist` as a substring in the `/etc/cron.d/wallarm‑node‑nginx` file by removing the `#` symbol at the beginning of the line. 
    
    You can also do this by running the following command:
    
    ```
    sed -i -Ee 's/^#(.*sync-blacklist.*)/\1/' /etc/cron.d/wallarm-node-nginx
    ```
    
    !!! info "Using the `sed` command"
        Sed is a stream editor.
        
        By default, sed writes to standard output. The `-i` option means that the file will be edited in-place.
        
        The `-eE` option comprises two options:

        * The `-e` option means the following:
            * The first non‑option parameter will be used as a script to run on the input.
            * The second non‑option parameter will be used as an input file. 
        * The `-E` option means that the script following this option uses the [extended regular expression syntax](https://www.gnu.org/software/sed/manual/sed.html#ERE-syntax).
        
        The script that follows the options replaces the lines that satisfy the `^#(.*sync‑blacklist.*)` regular expression with the string that satisfies the subexpression in parenthesis in the `/etc/cron.d/wallarm‑node‑nginx` file. The `\1` back‑reference of the sed command means that the subexpression in the first parenthesis should be used as a replacement.
        
        The line that satisfies the `^#(.*sync‑blacklist.*)` regular expression
        * starts with the `#` symbol.
        * contains `sync‑blacklist` as a substring.
        
        The replacement for the described line is the substring of this line without the `#` symbol at the beginning of the line. 
        
        This command uncomments the line that enables blacklist synchronization. Thus, the blacklist synchronization will be activated.
        
        You can learn more about sed by proceeding with the [link](https://www.gnu.org/software/sed/manual/sed.html).
    
7.  You can add IP addresses to the whitelist to skip checking of the blacklist upon receiving a request from them. For example, the following lines in the vhost or location configuration file add the `1.2.3.4/32` IP address pool to its whitelist:

    ```
    server {
        ...
        wallarm_acl default;
        allow 1.2.3.4/32;
        satisfy any;
        ...
    }
    ```

    After saving the edited configuration file, please do not forget to restart NGINX:

    ```bash
    sudo service nginx reload
    ```
