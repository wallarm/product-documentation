[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

The filtering node interacts with the Wallarm Cloud. There are two ways of connecting the node to the Cloud:
* [Using the filtering node token][anchor-token]
* [Using your Wallarm account email and password][anchor-credentials]

!!! info "Required access rights"
    Make sure that your Wallarm account has the **Administrator** or **Deploy** role enabled and two-factor authentication disabled, therefore allowing you to connect a filtering node to the Cloud.

    You can check the aforementioned parameters by navigating to the user account list in Wallarm Console.
    
    * If you are using <https://my.wallarm.com/>, proceed to the [following link][link-wl-console-users-eu] to check your user settings.
    * If you are using <https://us1.my.wallarm.com/>, proceed to the [following link][link-wl-console-users-us] to check your user settings.
    ![User list in Wallarm console][img-wl-console-users]

#### Connecting using the filtering node token

To connect the node to the Cloud using the token, proceed with the following steps:

1. Create a new node in the **Nodes** section of Wallarm Console.
    1. Click the **Create new node** button.
    2. Create the **Wallarm node**.
2. Copy the node token.
3. On the virtual machine run the `addcloudnode` script:
    
    !!! info
        You have to pick which script to run depending on the Cloud you are using.
        
        * If you are using <https://us1.my.wallarm.com/>, run the script from the **US Cloud** tab below.
        * If you are using <https://my.wallarm.com/>, run the script from the **EU Cloud** tab below.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. Paste the filtering node token from your clipboard. 

Your node will now synchronize with the Cloud every 2‑4 minutes according to the default synchronization configuration.

!!! info "Filtering node and Cloud synchronization configuration"
    After running the `addcloudnode` script, the `/etc/wallarm/syncnode` file containing the filtering node and Cloud synchronization settings will be created. The settings of the filtering node and Cloud synchronization can be changed via the `/etc/wallarm/syncnode` file.
    
    [More details on the filtering node and Wallarm Cloud synchronization configuration →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### Connecting using your email and password

To connect the node to the Wallarm Cloud using your account requisites, proceed with the following steps:

1.  On the virtual machine run the `addnode` script:
    
    !!! info
        You have to pick which script to run depending on the Cloud you are using.
        
        * If you are using <https://us1.my.wallarm.com/>, run the script from the **US Cloud** tab below.
        * If you are using <https://my.wallarm.com/>, run the script from the **EU Cloud** tab below.
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  Provide your Wallarm account email and password when prompted.

!!! info "API access"
    The API choice for your filtering node depends on the Cloud you are using. Please, select the API accordingly:
    
    * If you are using <https://my.wallarm.com/>, your node requires access to `https://api.wallarm.com:444`.
    * If you are using <https://us1.my.wallarm.com/>, your node requires access to `https://us1.api.wallarm.com:444`.
    
    Ensure the access is not blocked by a firewall.

Your node will now synchronize with the Cloud every 2‑4 minutes according to the default synchronization configuration.

!!! info "Filtering node and Cloud synchronization configuration"
    After running the `addnode` script, the `/etc/wallarm/node.yaml` file containing the filtering node and Cloud synchronization settings and other settings required for a correct Wallarm node operation will be created. The settings of the filtering node and Cloud synchronization can be changed via the `/etc/wallarm/node.yaml` file and system environment variables.
    
    [More details on the filtering node and Wallarm Cloud synchronization configuration →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)
