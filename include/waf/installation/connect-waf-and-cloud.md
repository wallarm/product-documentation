The Wallarm node interacts with the Wallarm Cloud. To connect the filtering node to the Cloud, proceed with the following steps:

1. Make sure that your Wallarm account has the **Administrator** or **Deploy** role enabled and two-factor authentication disabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![User list in Wallarm console][img-wl-console-users]

2.  Run the `addnode` script in a system with the installed Wallarm node:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Input the email and password for your account in Wallarm Console.
4. Input the filtering node name or click Enter to use an automatically generated name.

    The specified name can be changed in Wallarm Console → **Nodes** later.
5. Open the Wallarm Console → **Nodes** section in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and ensure a new filtering node is added to the list.
