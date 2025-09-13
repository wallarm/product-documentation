WallarmノードはWallarm Cloudと連携します。フィルタリングノードをWallarm Cloudに接続するには、次の手順に従います:

1. Wallarm Consoleで、Wallarmアカウントに**Administrator**または**Deploy**ロールが有効で、かつtwo-factor authenticationが無効になっていることを確認してください。
     
    これらの設定は、[USクラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users)のユーザー一覧に移動して確認できます。

    ![Wallarm Consoleのユーザー一覧][img-wl-console-users]

2.  Wallarmノードがインストールされているシステムで`addnode`スクリプトを実行します:
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarm Consoleのアカウントのメールアドレスとパスワードを入力します。
4. フィルタリングノード名を入力するか、Enterを押して自動生成された名前を使用します。

    指定した名前は後からWallarm Console → **Nodes**で変更できます。
5. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**セクションを開き、新しいフィルタリングノードが一覧に追加されていることを確認します。