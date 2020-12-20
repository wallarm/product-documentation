The WAF node interacts with the Wallarm Cloud. To connect the WAF node to the Cloud, proceed with the following steps:

1. Make sure that your Wallarm account has the **Administrator** role enabled and two-factor authentication disabled in the Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]

2.  Run the `addnode` script in a system with the installed WAF node:
    
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
3. Input the email and password for your account in the Wallarm Console.
4. Input the WAF node name or click Enter to use an automatically generated name.
5. Open the Wallarm Console → **Node** section in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and ensure a new WAF node is added to the list.
