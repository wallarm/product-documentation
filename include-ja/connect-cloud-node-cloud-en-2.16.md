[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

フィルタリングノードはWallarm Cloudと連携します。ノードをCloudに接続する方法は次の2通りです:
* [フィルタリングノードトークンを使用する][anchor-token]
* [Wallarmアカウントのメールアドレスとパスワードを使用する][anchor-credentials]

!!! info "必要なアクセス権"
    お使いのWallarmアカウントで**Administrator**または**Deploy**ロールが有効で、かつtwo-factor authenticationが無効になっていることを確認してください。これによりフィルタリングノードをCloudに接続できます。

    これらのパラメータはWallarm Consoleのユーザーアカウント一覧で確認できます。
    
    * <https://my.wallarm.com/>を使用している場合は、ユーザー設定を確認するため[次のリンク][link-wl-console-users-eu]に進みます。
    * <https://us1.my.wallarm.com/>を使用している場合は、ユーザー設定を確認するため[次のリンク][link-wl-console-users-us]に進みます。
    ![Wallarm Consoleのユーザー一覧][img-wl-console-users]

#### フィルタリングノードトークンを使用して接続する

トークンを使用してノードをCloudに接続するには、次の手順に従います:

1. Wallarm Consoleの**Nodes**セクションで新しいノードを作成します。
    1. **Create new node**ボタンをクリックします。
    2. **Wallarm node**を作成します。
2. ノードトークンをコピーします。
3. 仮想マシン上で`addcloudnode`スクリプトを実行します:
    
    !!! info
        使用しているCloudに応じて実行するスクリプトを選択する必要があります。
        
        * <https://us1.my.wallarm.com/>を使用している場合は、下の**USクラウド**タブのスクリプトを実行します。
        * <https://my.wallarm.com/>を使用している場合は、下の**EUクラウド**タブのスクリプトを実行します。
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. クリップボードからフィルタリングノードトークンを貼り付けます。 

ノードはデフォルトの同期設定に従い2〜4分ごとにCloudと同期します。

!!! info "フィルタリングノードとCloudの同期設定"
    `addcloudnode`スクリプトを実行すると、フィルタリングノードとCloudの同期設定を含む`/etc/wallarm/syncnode`ファイルが作成されます。フィルタリングノードとCloudの同期設定は`/etc/wallarm/syncnode`ファイルから変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### メールアドレスとパスワードを使用して接続する

アカウント資格情報を使用してノードをWallarm Cloudに接続するには、次の手順に従います:

1.  仮想マシン上で`addnode`スクリプトを実行します:
    
    !!! info
        使用しているCloudに応じて実行するスクリプトを選択する必要があります。
        
        * <https://us1.my.wallarm.com/>を使用している場合は、下の**USクラウド**タブのスクリプトを実行します。
        * <https://my.wallarm.com/>を使用している場合は、下の**EUクラウド**タブのスクリプトを実行します。
    
    === "USクラウド"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  プロンプトに従い、Wallarmアカウントのメールアドレスとパスワードを入力します。

!!! info "APIアクセス"
    フィルタリングノードで使用するAPIは、利用しているCloudに依存します。該当するAPIを選択してください:
    
    * <https://my.wallarm.com/>を使用している場合、ノードは`https://api.wallarm.com:444`へのアクセスが必要です。
    * <https://us1.my.wallarm.com/>を使用している場合、ノードは`https://us1.api.wallarm.com:444`へのアクセスが必要です。
    
    ファイアウォールでブロックされていないことを確認します。

ノードはデフォルトの同期設定に従い2〜4分ごとにCloudと同期します。

!!! info "フィルタリングノードとCloudの同期設定"
    `addnode`スクリプトを実行すると、フィルタリングノードとCloudの同期設定やWallarmノードの正常な動作に必要なその他の設定を含む`/etc/wallarm/node.yaml`ファイルが作成されます。フィルタリングノードとCloudの同期設定は`/etc/wallarm/node.yaml`ファイルおよびシステム環境変数から変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)