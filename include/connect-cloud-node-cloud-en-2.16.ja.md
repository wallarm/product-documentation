[img-wl-console-users]: ../images/check-users.png

[link-wl-console-us]: https://us1.my.wallarm.com/
[link-wl-console-eu]: https://my.wallarm.com/
[link-wl-console-users-us]: https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]: https://my.wallarm.com/settings/users

[anchor-token]: #connecting-using-the-filtering-node-token
[anchor-credentials]: #connecting-using-your-email-and-password

フィルタリングノードはWallarm Cloudとやり取りをします。ノードをクラウドに接続するには2つの方法があります：
* [フィルタリングノードトークンを使用する][anchor-token]
* [Wallarmアカウントのメールアドレスとパスワードを使用する][anchor-credentials]

!!! info "必要なアクセス権"
    Wallarmアカウントが**管理者**または**デプロイ**ロールを有効にし、2要素認証を無効にして、フィルタリングノードをクラウドに接続できるようにしてください。

    Wallarm Consoleのユーザーアカウントリストで前述のパラメータを確認できます。
    
    * <https://my.wallarm.com/> を使用している場合は、[このリンク][link-wl-console-users-eu]をたどってユーザー設定を確認してください。
    * <https://us1.my.wallarm.com/> を使用している場合は、[このリンク][link-wl-console-users-us]をたどってユーザー設定を確認してください。
    ![!Wallarm consoleのユーザーリスト][img-wl-console-users]

#### フィルタリングノードトークンを使用して接続する

トークンを使用してノードをクラウドに接続するには、次の手順を実行します：

1. Wallarm Consoleの**ノード**セクションで新しいノードを作成します。
    1. **新しいノードを作成**ボタンをクリックします。
    2. **Wallarmノード**を作成します。
2. ノードトークンをコピーします。
3. 仮想マシンで `addcloudnode` スクリプトを実行します：
    
    !!! info
        使用しているクラウドに応じて実行するスクリプトを選択する必要があります。
        
        * <https://us1.my.wallarm.com/> を使用している場合、以下の **US Cloud** タブからスクリプトを実行します。
        * <https://my.wallarm.com/> を使用している場合、以下の **EU Cloud** タブからスクリプトを実行します。
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. クリップボードからフィルタリングノードトークンを貼り付けます。

ノードは、デフォルトの同期設定に従って、2～4分ごとにクラウドと同期されるようになります。

!!! info "フィルタリングノードとクラウドの同期設定"
    `addcloudnode`スクリプトを実行した後、フィルタリングノードとクラウドの同期設定が含まれる`/etc/wallarm/syncnode`ファイルが作成されます。フィルタリングノードとクラウドの同期設定は、`/etc/wallarm/syncnode`ファイルを介して変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### メールアドレスとパスワードを使用して接続する

アカウント要件を使用してノードをWallarm Cloudに接続するには、次の手順を実行します：

1. 仮想マシンで `addnode` スクリプトを実行します：
    
    !!! info
        使用しているクラウドに応じて実行するスクリプトを選択する必要があります。
        
        * <https://us1.my.wallarm.com/> を使用している場合、以下の **US Cloud** タブからスクリプトを実行します。
        * <https://my.wallarm.com/> を使用している場合、以下の **EU Cloud** タブからスクリプトを実行します。
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2. 促されたときにWallarmアカウントのメールアドレスとパスワードを提供してください。

!!! info "APIアクセス"
    使用しているクラウドに応じて、フィルタリングノードに選択したAPIが必要です。
    
    * <https://my.wallarm.com/> を使用している場合、ノードは `https://api.wallarm.com:444` へのアクセスが必要です。
    * <https://us1.my.wallarm.com/> を使用している場合、ノードは `https://us1.api.wallarm.com:444` へのアクセスが必要です。
    
    ファイアウォールによってアクセスがブロックされていないことを確認してください。

ノードは、デフォルトの同期設定に従って、2～4分ごとにクラウドと同期されるようになります。

!!! info "フィルタリングノードとクラウドの同期設定"
    `addnode`スクリプトを実行した後、フィルタリングノードとクラウドの同期設定が含まれる`/etc/wallarm/node.yaml`ファイルが作成されます。フィルタリングノードとクラウドの同期設定は、`/etc/wallarm/node.yaml`ファイルとシステム環境変数を介して変更できます。
    
    [フィルタリングノードとWallarm Cloudの同期設定の詳細 →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)