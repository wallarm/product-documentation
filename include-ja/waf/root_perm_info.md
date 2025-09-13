!!! info "ユーザーに`root`権限を付与します"
    `root`権限を持たないユーザーとしてNGINXを実行している場合は、次のコマンドを使用してこのユーザーを`wallarm`グループに追加します：
    
    ```
    usermod -aG wallarm <user_name>;
    ```
    
    ここで、`<user_name>`は`root`権限を持たないユーザーの名前です。