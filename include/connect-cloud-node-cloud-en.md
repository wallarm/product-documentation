[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users
[link-syncnode]:               ../admin-en/configure-cloud-node-synchronization-en.md

[anchor-token]:                      #connecting-using-the-filter-node-token
[anchor-credentials]:                      #connecting-using-your-cloud-account-login-and-password

The filter node interacts with the Wallarm cloud. There are two ways of connecting the node to the cloud:
* [Using the filter node token][anchor-token]
* [Using your cloud account login and password][anchor-credentials]

!!! info "Required access rights"
    Make sure that your Wallarm account has the Administrator role enabled and two-factor authentication disabled, therefore allowing you to connect a filter node to the cloud.

    You can check the aforementioned parameters by navigating to the user account list in the Wallarm console.
    
    * If you are using <https://my.wallarm.com/>, proceed to the [following link][link-wl-console-users-eu] to check your user settings.
    * If you are using <https://us1.my.wallarm.com/>, proceed to the [following link][link-wl-console-users-us] to check your user settings.
    ![!User list in Wallarm console][img-wl-console-users]

#### Connecting Using the Filter Node Token

To connect the node to the cloud using the token, proceed with the following steps:

1. Create a new node on the *Nodes* tab of Wallarm web interface.
    1. Click the *Create new node* button.
    2. In the form that appears, enter the node name into the corresponding field and select the “Cloud” type of installation from the drop-down list.
    3. Click the *Create* button.
2. In the window that appears, click the *Copy* button next to the field with the token to add the token of the newly created filter node to your clipboard.
3. On the virtual machine run the `addcloudnode` script:
    
    !!! info
        You have to pick which script to run depending on the Cloud you are using.
        
        * If you are using <https://my.wallarm.com/>, run the script from the *EU Cloud* tab below.
        * If you are using <https://us1.my.wallarm.com/>, run the script from the *US Cloud* tab below.
    
    === "EU Cloud"
        ``` bash
        /usr/share/wallarm-common/addcloudnode
        ```
    === "US Cloud"
        ``` bash
        /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
        
1. Paste the filter node token from your clipboard. 

Your filter node will now synchronize with the cloud every 5 seconds according to the default synchronization configuration.

!!! info "Node and cloud synchronization configuration"
    After running the `addcloudnode` script, the `/etc/wallarm/syncnode` file containing the node and cloud synchronization settings will be created.
    
    To learn more about synchronization configuration file content, proceed to the [link][link-syncnode].

#### Connecting Using Your Cloud Account Login and Password

To connect the node to the cloud using your cloud account requisites, proceed with the following steps:

1.  On the virtual machine run the `addnode` script:
    
    !!! info
        You have to pick which script to run depending on the Cloud you are using.
        
        * If you are using <https://my.wallarm.com/>, run the script from the «*EU Cloud* tab below.
        * If you are using <https://us1.my.wallarm.com/>, run the script from the *US Cloud* tab below.
    
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    
1.  Provide your Wallarm account’s login and password when prompted.

!!! info "API Access"
    The API choice for your filter node depends on the Cloud you are using. Please, select the API accordingly:
    
    * If you are using <https://my.wallarm.com/>, your node requires access to `https://api.wallarm.com:444`.
    * If you are using <https://us1.my.wallarm.com/>, your node requires access to `https://us1.api.wallarm.com:444`.
    
    Ensure the access is not blocked by a firewall.