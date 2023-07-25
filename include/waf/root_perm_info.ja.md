					!!! info "ユーザーに `root` 権限を与える"
    もしNGINXを `root` 権限を持っていないユーザーとして実行している場合は、次のコマンドを使ってこのユーザーを `wallarm` グループに追加してください：
    
    ```
    usermod -aG wallarm <user_name>;
    ```
    
    ここで `<user_name>` は `root` 権限がないユーザーの名前です。