[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

フィルタリングノードはWallarm Cloudと連携します。ノードをCloudに接続する方法は二通りあります:
* [フィルタリングノードトークンを使用した接続][anchor-token]
* [Wallarmアカウントのメールアドレスとパスワードを使用した接続][anchor-credentials]

!!! info "必要なアクセス権限"
    Wallarmアカウントに**Administrator**または**Deploy**ロールが有効であり、二要素認証が無効になっていることを確認してください。これにより、フィルタリングノードをCloudに接続できるようになります。

    上記のパラメータは、Wallarm Consoleのユーザーアカウント一覧から確認できます。
    
    * <https://my.wallarm.com/>を利用している場合は、[こちらのリンク][link-wl-console-users-eu]に進み、ユーザー設定を確認してください。
    * <https://us1.my.wallarm.com/>を利用している場合は、[こちらのリンク][link-wl-console-users-us]に進み、ユーザー設定を確認してください。
    ![Wallarm Consoleのユーザー一覧][img-wl-console-users]

#### フィルタリングノードトークンを使用した接続

トークンを使用してノードをCloudに接続するには、以下の手順に従ってください:

1. Wallarm Consoleの**Nodes**セクションで新規ノードを作成します。
    1. **Create new node**ボタンをクリックします。
    2. **Wallarm node**を作成します。
2. ノードトークンをコピーします。
3. 仮想マシン上で`addcloudnode`スクリプトを実行します:
    
    !!! info
        利用中のCloudに応じて実行するスクリプトを選択してください。
        
        * <https://us1.my.wallarm.com/>を利用している場合は、以下の**US Cloud**タブからスクリプトを実行してください。
        * <https://my.wallarm.com/>を利用している場合は、以下の**EU Cloud**タブからスクリプトを実行してください。
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. クリップボードからフィルタリングノードトークンを貼り付けます。

これ以降、デフォルトの同期設定に従い、ノードは2～4分ごとにCloudと同期します。

!!! info "フィルタリングノードとCloudの同期設定"
    `addcloudnode`スクリプトを実行すると、フィルタリングノードとCloudの同期設定を含む`/etc/wallarm/syncnode`ファイルが作成されます。フィルタリングノードおよびCloudの同期設定は、`/etc/wallarm/syncnode`ファイルを通じて変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細→](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### メールアドレスとパスワードを使用した接続

アカウント情報を使用してノードをWallarm Cloudに接続するには、以下の手順に従ってください:

1. 仮想マシン上で`addnode`スクリプトを実行します:
    
    !!! info
        利用中のCloudに応じて実行するスクリプトを選択してください。
        
        * <https://us1.my.wallarm.com/>を利用している場合は、以下の**US Cloud**タブからスクリプトを実行してください。
        * <https://my.wallarm.com/>を利用している場合は、以下の**EU Cloud**タブからスクリプトを実行してください。
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2. プロンプトに従い、Wallarmアカウントのメールアドレスとパスワードを入力します。

!!! info "APIアクセス"
    フィルタリングノードが利用するAPIは、使用中のCloudに依存します。適切なAPIを選択してください:
    
    * <https://my.wallarm.com/>を利用している場合、ノードは`https://api.wallarm.com:444`へのアクセスを必要とします。
    * <https://us1.my.wallarm.com/>を利用している場合、ノードは`https://us1.api.wallarm.com:444`へのアクセスを必要とします。
    
    ファイアウォールでアクセスがブロックされていないことを確認してください。

これ以降、デフォルトの同期設定に従い、ノードは2～4分ごとにCloudと同期します。

!!! info "フィルタリングノードとCloudの同期設定"
    `addnode`スクリプトを実行すると、フィルタリングノードおよびCloudの同期設定、ならびにWallarmノードの正しい動作に必要なその他の設定を含む`/etc/wallarm/node.yaml`ファイルが作成されます。フィルタリングノードおよびCloudの同期設定は、`/etc/wallarm/node.yaml`ファイルおよびシステム環境変数を通じて変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細→](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)