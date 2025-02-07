[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

!!! info "APIアクセス"
    フィルタリングノード用のAPIは、ご利用中のCloudによって異なります。対応するAPIを選択してください:
    
    * <https://my.wallarm.com/>を使用している場合、ノードは`https://api.wallarm.com:444`へのアクセスを必要とします。
    * <https://us1.my.wallarm.com/>を使用している場合、ノードは`https://us1.api.wallarm.com:444`へのアクセスを必要とします。
    
    ファイアウォールによりアクセスが遮断されていないことを確認してください。

フィルタリングノードはWallarm Cloudと連携します。

クラウドアカウントの認証情報を使用してノードをクラウarm Cloudに接続するには、以下の手順に従ってください:

1.  Wallarmアカウントに**Administrator**または**Deploy**ロールが有効であり、二段階認証が無効になっていることを確認してください。これにより、フィルタリングノードをCloudに接続できるようになります。
     
    上記のパラメータは、Wallarm Consoleのユーザーアカウント一覧から確認することができます。
    
    * <https://my.wallarm.com/>を使用している場合は、ユーザー設定を確認するため、[次のリンク][link-wl-console-users-eu]に移動してください。
    * <https://us1.my.wallarm.com/>を使用している場合は、ユーザー設定を確認するため、[次のリンク][link-wl-console-users-us]に移動してください。

    ![Wallarm Consoleのユーザー一覧][img-wl-console-users]

2.  フィルタリングノードをインストールするマシン上で`addnode`スクリプトを実行してください:
    
    !!! info
        使用しているCloudに応じて実行するスクリプトを選択する必要があります。
    
        * <https://us1.my.wallarm.com/>を使用している場合、下記の**USクラウド**タブからスクリプトを実行してください。
        * <https://my.wallarm.com/>を使用している場合、下記の**EUクラウド**タブからスクリプトを実行してください。
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    作成したノードの名前を指定するには、`-n <node name>`オプションを使用してください。また、ノード名はWallarm Console→**Nodes**で変更することができます。

3.  プロンプトが表示されたら、Wallarmアカウントのメールアドレスとパスワードを入力してください。