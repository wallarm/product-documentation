[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users


!!! info "APIアクセス"
    フィルタリングノードのAPI選択肢はご使用中のクラウドによります。適切なAPIを選択してください：
    
    * <https://my.wallarm.com/>を利用している場合，ノードが`https://api.wallarm.com:444`へのアクセスが必要です。
    * <https://us1.my.wallarm.com/>を利用している場合，ノードが`https://us1.api.wallarm.com:444`へのアクセスが必要です。
    
    ファイアウォールによりアクセスがブロックされていないことを確認してください。

フィルタリングノードはWallarm Cloudと対話します。

クラウドアカウントの要件を使用して、ノードをクラウドに接続するには、以下の手順を実行してください：

1.  ご自分のWallarmアカウントに**管理者**または**デプロイ**の役割が有効化され、2要素認証が無効化されていることを確認してください。これにより、フィルタリングノードをクラウドに接続することが可能となります。
     
    上記のパラメータは、Wallarm Consoleのユーザーアカウントリストに移動することで確認することができます。
    
    * <https://my.wallarm.com/>を利用している場合，ユーザー設定を確認するには[こちらのリンク][link-wl-console-users-eu]へ移動してください。
    * <https://us1.my.wallarm.com/>を利用している場合，ユーザー設定を確認するには[こちらのリンク][link-wl-console-users-us]へ移動してください。

    ![!Wallarm consoleのユーザーリスト][img-wl-console-users]

2.  フィルタリングノードをインストールするマシンで`addnode`スクリプトを実行してください:
    
    !!! info
        利用しているクラウドによって、実行するスクリプトを選択する必要があります。
    
        * <https://us1.my.wallarm.com/>を利用している場合，下記の**US Cloud**タブからスクリプトを実行してください。
        * <https://my.wallarm.com/>を利用している場合，下記の**EU Cloud**タブからスクリプトを実行してください。
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```

    作成するノードの名前を指定するには、`-n <ノード名>`オプションを使用します。また、ノード名はWallarm Console → **Nodes**で変更することもできます。

3.  促されたときに、Wallarmアカウントのメールアドレスとパスワードを提供してください。