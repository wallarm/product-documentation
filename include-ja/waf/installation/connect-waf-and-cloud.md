WallarmノードはWallarm Cloudと対話します。フィルタリングノードをCloudに接続するには、以下の手順に従ってください:

1. Wallarm ConsoleでWallarmアカウントに**Administrator**または**Deploy**ロールが有効になっており、二要素認証が無効になっていることを確認します。

    これらの設定は[US Cloud](https://us1.my.wallarm.com/settings/users)または[EU Cloud](https://my.wallarm.com/settings/users)のユーザーリストから確認できます。

    ![Wallarm Consoleのユーザーリスト][img-wl-console-users]

2. Wallarmノードがインストールされたシステムで`addnode`スクリプトを実行します:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarm Consoleのアカウント情報としてメールアドレスとパスワードを入力します。
4. フィルタリングノードの名前を入力するか、Enterキーを押して自動生成された名前を使用します。

    指定した名前は後でWallarm Console→**Nodes**で変更できます。
5. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でWallarm Console→**Nodes**セクションを開き、新しいフィルタリングノードがリストに追加されたことを確認します。