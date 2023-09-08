WallarmノードはWallarmクラウドと対話します。フィルタリングノードをクラウドに接続するには、以下の手順を実行します：

1. あなたのWallarmアカウントがWallarmコンソールで**Administrator**または**Deploy**の役割を有効にし、二要素認証を無効にしていることを確認してください。

    これらの設定は、[US Cloud](https://us1.my.wallarm.com/settings/users)または[EU Cloud](https://my.wallarm.com/settings/users)のユーザーリストに移動することで確認できます。

    ![Wallarmコンソール内のユーザーリスト][img-wl-console-users]

2.  Wallarmノードがインストールされたシステムで`addnode`スクリプトを実行します：

      === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
      === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarmコンソールにあなたのアカウントのメールアドレスとパスワードを入力します。
4. フィルタリングノードの名前を入力するか、Enterキーを押して自動生成された名前を使用します。

    指定した名前は、後からWallarmコンソール → **Nodes**で変更することができます。
5. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**セクションを開き、新しいフィルタリングノードがリストに追加されていることを確認します。