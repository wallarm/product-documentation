[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users


!!! info "APIアクセス"
    ご利用のWallarm Cloudに応じてフィルタリングノードが使用するAPIが異なります。該当するAPIを選択してください:
    
    * <https://my.wallarm.com/>を使用している場合、フィルタリングノードは`https://api.wallarm.com:444`へのアクセスが必要です。
    * <https://us1.my.wallarm.com/>を使用している場合、フィルタリングノードは`https://us1.api.wallarm.com:444`へのアクセスが必要です。
    
    ファイアウォールによってアクセスがブロックされていないことを確認してください。

フィルタリングノードはWallarm Cloudと通信します。

Wallarm Cloudアカウントの資格情報を使用してノードをWallarm Cloudに接続するには、次の手順に従ってください:

1.  WallarmアカウントでAdministratorまたはDeployロールが有効になっており、two-factor authenticationが無効になっていることを確認してください。これにより、フィルタリングノードをWallarm Cloudに接続できます。 
     
    Wallarm Consoleのユーザーアカウント一覧に移動して、上記の条件を確認できます。
    
    * <https://my.wallarm.com/>を使用している場合は、ユーザー設定を確認するために[次のリンク][link-wl-console-users-eu]に進んでください。
    * <https://us1.my.wallarm.com/>を使用している場合は、ユーザー設定を確認するために[次のリンク][link-wl-console-users-us]に進んでください。

    ![Wallarm Consoleのユーザー一覧][img-wl-console-users]

2.  フィルタリングノードをインストールするマシンで`addnode`スクリプトを実行してください:
    
    !!! info
        ご利用のWallarm Cloudに応じて実行するスクリプトを選択する必要があります。
    
        * <https://us1.my.wallarm.com/>を使用している場合は、下の**USクラウド**タブのスクリプトを実行してください。
        * <https://my.wallarm.com/>を使用している場合は、下の**EUクラウド**タブのスクリプトを実行してください。
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    作成されるノード名を指定するには、`-n <node name>`オプションを使用します。また、ノード名はWallarm Console → **Nodes**で変更できます。

3.  プロンプトが表示されたら、Wallarmアカウントのメールアドレスとパスワードを入力してください。