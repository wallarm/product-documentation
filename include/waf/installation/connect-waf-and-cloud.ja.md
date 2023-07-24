WallarmノードはWallarmクラウドと対話します。フィルタリングノードをクラウドに接続するには、次の手順に従ってください。

1. Wallarmアカウントで**管理者**または**デプロイ**ロールが有効になっており、Wallarmコンソールで二要素認証が無効になっていることを確認してください。

    指定された設定を[USクラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users)のユーザーリストに移動して確認できます。

    ![! Wallarmコンソールのユーザーリスト][img-wl-console-users]

2. Wallarmノードがインストールされたシステムで`addnode`スクリプトを実行します：

    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarmコンソールのアカウントに対するメールアドレスとパスワードを入力します。
4. フィルタリングノードの名前を入力するか、Enterキーを押して自動生成された名前を使用します。

    指定された名前は、Wallarmコンソール→ **ノード**で後から変更できます。
5. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarmコンソール→ **ノード**セクションを開き、新しいフィルタリングノードがリストに追加されていることを確認します。