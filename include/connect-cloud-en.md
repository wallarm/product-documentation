[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users


!!! info "API Access"
    The API choice for your filtering node depends on the Cloud you are using. Please, select the API accordingly:
    
    * If you are using <https://my.wallarm.com/>, your node requires access to `https://api.wallarm.com:444`.
    * If you are using <https://us1.my.wallarm.com/>, your node requires access to `https://us1.api.wallarm.com:444`.
    
    Ensure the access is not blocked by a firewall.

The filtering node interacts with the Wallarm Cloud. 

To connect the node to the cloud using your cloud account requisites, proceed with the following steps:

1.  Make sure that your Wallarm account has the **Administrator** or **Deploy** role enabled and two-factor authentication disabled, therefore allowing you to connect a filtering node to the Cloud. 
     
    You can check the above mentioned parameters by navigating to the user account list in Wallarm Console.
    
    * If you are using <https://my.wallarm.com/>, proceed to the [following link][link-wl-console-users-eu] to check your user settings.
    * If you are using <https://us1.my.wallarm.com/>, proceed to the [following link][link-wl-console-users-us] to check your user settings.

    ![User list in Wallarm console][img-wl-console-users]

2.  Run the `addnode` script on a machine where you install the filtering node:
    
    !!! info
        You have to pick the script to run depending on the Cloud you are using.
    
        * If you are using <https://us1.my.wallarm.com/>, run the script from the **US Cloud** tab below.
        * If you are using <https://my.wallarm.com/>, run the script from the **EU Cloud** tab below.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    To specify the name of the created node, use the `-n <node name>` option. Also, the node name can be changed in Wallarm Console → **Nodes**.

3.  Provide your Wallarm account’s email and password when prompted.
