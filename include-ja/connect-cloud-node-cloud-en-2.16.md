[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #フィルタリングノードのトークンを使用して接続します
[anchor-credentials]:                      #あなたのメールとパスワードで接続します

フィルタリングノードはWallarmクラウドと対話します。ノードをクラウドに接続する方法は2つあります：
* [フィルタリングノードのトークンを使用して接続します][anchor-token]
* [あなたのWallarmアカウントのメールとパスワードで接続します][anchor-credentials]

!!! info "必要なアクセス権"
    あなたのWallarmアカウントに**管理者**または**デプロイ**の役割が有効であり、二段階認証が無効になっていることを確認してください。これにより、フィルタリングノードをクラウドに接続することができます。

    Wallarmコンソールのユーザーアカウントリストを参照して上記のパラメータを確認することができます。

    * <https://my.wallarm.com/>を使用している場合は、[こちらのリンク][link-wl-console-users-eu]に進んでユーザー設定を確認してください。
    * <https://us1.my.wallarm.com/>を使用している場合は、[こちらのリンク][link-wl-console-users-us]に進んでユーザー設定を確認してください。
    ![!Wallarm consoleのユーザーリスト][img-wl-console-users]

#### フィルタリングノードのトークンを使用して接続します

トークンを使用してノードをクラウドに接続するには、以下の手順を実行してください：

1. Wallarmコンソールの**Nodes**セクションで新しいノードを作成します。
    1. **Create new node**ボタンをクリックします。
    2. **Wallarm node**を作成します。
2. ノードトークンをコピーします。
3. 仮想マシンで`addcloudnode`スクリプトを実行します：

    !!! info
        使用しているクラウドに応じて実行するスクリプトを選択する必要があります。
        
        * <https://us1.my.wallarm.com/>を使用している場合は、以下の**US Cloud**タブからスクリプトを実行します。
        * <https://my.wallarm.com/>を使用している場合は、以下の**EU Cloud**タブからスクリプトを実行します。
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. クリップボードからフィルタリングノードのトークンを貼り付けます。

あなたのノードは、デフォルトの同期設定に従って、クラウドとの同期を開始します。

!!! info "フィルタリングノードとクラウド同期設定"
    `addcloudnode`スクリプトを実行すると、フィルタリングノードとクラウド同期設定を含む`/etc/wallarm/syncnode`ファイルが作成されます。フィルタリングノードとクラウド同期設定は`/etc/wallarm/syncnode`ファイルを通じて変更できます。
    
    [フィルタリングノードとWallarm Cloud同期設定の詳細→](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### あなたのメールとパスワードで接続します

アカウント要件を使用してノードをWallarm Cloudに接続するには、以下の手順を実行してください：

1. 仮想マシンで`addnode`スクリプトを実行します：

    !!! info
        使用しているクラウドに応じて実行するスクリプトを選択する必要があります。
        
        * <https://us1.my.wallarm.com/>を使用している場合は、以下の**US Cloud**タブからスクリプトを実行します。
        * <https://my.wallarm.com/>を使用している場合は、以下の**EU Cloud**タブからスクリプトを実行します。
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  プロンプトが表示されたら、あなたのWallarmアカウントのメールとパスワードを提供します。

!!! info "APIアクセス"
    フィルタリングノードのAPIは使用しているクラウドによります。適切なAPIを選択してください：
    
    * <https://my.wallarm.com/>を使用している場合、あなたのノードは`https://api.wallarm.com:444`へのアクセスが必要です。
    * <https://us1.my.wallarm.com/>を使用している場合、あなたのノードは`https://us1.api.wallarm.com:444`へのアクセスが必要です。
    
    ファイアウォールによってアクセスがブロックされていないことを確認してください。

あなたのノードは、デフォルトの同期設定に従って、クラウドとの同期を開始します。

!!! info "フィルタリングノードとクラウドの同期設定"
    `addnode`スクリプトを実行すると、フィルタリングノードとクラウドの同期設定およびWallarmノードの正常な動作に必要なその他の設定が含まれている `/etc/wallarm/node.yaml` ファイルが作成されます。フィルタリングノードとクラウド同期設定は `/etc/wallarm/node.yaml` ファイルとシステム環境変数から変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細→](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)