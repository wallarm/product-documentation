!!! info "ユーザーに`root`権限を付与する"
    NGINXを実行しているユーザーが`root`権限を持たない場合は、以下のコマンドでこのユーザーを`wallarm`グループに追加してください:
    
    ```
    usermod -aG wallarm <user_name>;
    ```
    
    ただし`<user_name>`は`root`権限を持たないユーザーの名前です。