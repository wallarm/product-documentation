[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

!!! info "APIアクセス"
    お使いのクラウドに応じて、フィルタリングノードに適切なAPIを選択してください。
    
    * <https://my.wallarm.com/>を使用している場合、ノードは`https://api.wallarm.com:444`にアクセスする必要があります。
    * <https://us1.my.wallarm.com/>を使用している場合、ノードは`https://us1.api.wallarm.com:444`にアクセスする必要があります。

    ファイアウォールによってアクセスがブロックされていないことを確認してください。

フィルタリングノードはWallarmクラウドと連携します。

クラウドアカウントの必要事項を使用してノードをクラウドに接続するには、次の手順に従ってください：

1.  Wallarmアカウントが**管理者**または**デプロイ**ロールが有効で、二要素認証が無効になっていることを確認してください。これにより、フィルタリングノードをクラウドに接続できます。

    これらのパラメータは、Wallarmコンソールのユーザーアカウントリストに移動して確認できます。
    
    * <https://my.wallarm.com/>を使用している場合、[次のリンク][link-wl-console-users-eu]に進んでユーザー設定を確認してください。
    * <https://us1.my.wallarm.com/>を使用している場合、[次のリンク][link-wl-console-users-us]に進んでユーザー設定を確認してください。

    ![!Wallarmコンソールのユーザーリスト][img-wl-console-users]

2.  フィルタリングノードがあるシステムで`addnode`スクリプトを実行します。
    
    !!! info
        使用しているクラウドに応じて、実行するスクリプトを選択する必要があります。
    
        * <https://us1.my.wallarm.com/>を使用している場合は、以下の**米国クラウド**タブからスクリプトを実行してください。
        * <https://my.wallarm.com/>を使用している場合は、以下の**欧州クラウド**タブからスクリプトを実行してください。
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    作成されるノードの名前を指定するには、`-n <node name>`オプションを使用してください。また、ノード名はWallarmコンソール → **ノード**で変更できます。

3.  必要に応じて、Wallarmアカウントのメールアドレスとパスワードを入力してください。