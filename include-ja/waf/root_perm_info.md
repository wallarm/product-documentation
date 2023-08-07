					!!! info "`root`権限をユーザに付与する"
    `root`権限を持っていないユーザとしてNGINXを実行している場合は、以下のコマンドを使用して、このユーザを`wallarm`グループに追加してください。

    ```
    usermod -aG wallarm <user_name>;
    ```
    
    ここで、`<user_name>`は`root`権限を持たないユーザの名前です。