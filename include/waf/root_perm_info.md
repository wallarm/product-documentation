!!! info "Providing user with `root` permission"
    If you are running NGINX as a user that does not have `root` permission, then add this user to the `wallarm` group using the following command:
    
    ```
    usermod -aG wallarm <user_name>;
    ```
    
    where `<user_name>` is the name of the user without `root` permission.