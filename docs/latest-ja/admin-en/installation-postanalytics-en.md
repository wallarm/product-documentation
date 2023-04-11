[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png

# 別個の postanalytics モジュールのインストール

--8<-- "../include-ja/waf/installation/nginx-installation-options.md"

これらの手順では、別のサーバーに postanalytics モジュールをインストールする方法を説明しています。

## 要件

* [NGINXの安定版からNGINXリポジトリ](../installation/nginx/dynamic-module.md)、[Debian/CentOSリポジトリからのNGINX](../installation/nginx/dynamic-module-from-distr.md)、または [NGINX Plus](../installation/nginx-plus.md) でインストールされた NGINX-Wallarm モジュール

    NGINX-Wallarm パッケージは、別途回インストールする postanalytics モジュールと同じかそれ以下のバージョンでなければなりません。この要件は、[postanalyticsパッケージのインストール](#2-install-packages-for-the-postanalytics-module)の間に確認してください。
* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarm Consoleで **Administrator** ロールを持つアカウントへのアクセス
* [指示][configure-selinux-instr] に従って無効にするか設定された SELinux
* すべてのコマンドをスーパーユーザー（例：`root`）として実行
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* 米国 Wallarm Cloud と連携している場合は `https://us1.api.wallarm.com`、EU Wallarm Cloud と連携している場合は `https://api.wallarm.com` へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[指示][configure-proxy-balancer-instr] を使用してください
* [許可されたリスト, 拒否リスト, グレーリスト化された](../user-guides/ip-lists/overview.md) 国、地域、データセンターに登録されている IP アドレスの実際のリストをダウンロードするための [GCP ストレージアドレス](https://www.gstatic.com/ipranges/goog.json) へのアクセス
* インストールされたテキストエディタ **vim**、**nano**、またはそれ以外のもの。この指示では、**vim** を使用しています

## インストール

### 1. Wallarmリポジトリの追加

postanalytics モジュールや他の Wallarm モジュールと同様に、Wallarm リポジトリからインストールおよび更新されます。リポジトリを追加するには、プラットフォームに適したコマンドを使用してください。

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

### 2. postanalyticsモジュール用のパッケージをインストールする

postanalytics モジュールと Tarantool データベース用の Wallarmリポジトリから `wallarm-node-tarantool` パッケージをインストールします：

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```

--8<-- "../include-ja/waf/installation/checking-compatibility-of-separate-postanalytics-and-primary-packages.md"

### 3. postanalyticsモジュールをWallarm Cloudに接続する

postanalyticsモジュールはWallarm Cloudと連携しています。postanalyticsモジュールをCloudに接続するには、postanalyticsモジュール用のWallarmノードを作成する必要があります。作成されたノードは、Cloudからセキュリティルールを取得し、攻撃データをCloudにアップロードします。

フィルタリングノードを作成し、postanalyticsモジュールをクラウドに接続するには：

1. Wallarmアカウントが Wallarm Console の**Administrator**ロールが有効になっていることを確認してください。

    この設定は、[USクラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users)のユーザーリストに移動することで確認できます。

    ![!User list in Wallarm console][img-wl-console-users]
1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)の Wallarm Console → **Nodes** を開き、**Wallarmノード** タイプのノードを作成します。

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. インストールされたpostanalyticsモジュールパッケージを持つシステムで、`register-node`スクリプトを実行します。

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --no-sync --no-sync-acl
        ```

    * `<NODE_TOKEN>` は、コピーされたトークンの値です。
    * postanalyticsノードインスタンスにカスタム名を設定するには、`-n <HOST_NAME>` パラメータを追加できます。最終ノードインスタンス名は、`HOST_NAME_NodeUUID` になります。

### 4. postanalyticsモジュールの設定を更新する

postanalyticsモジュールの設定ファイルは、次のパスにあります。

* `/etc/default/wallarm-tarantool` Debian および Ubuntu オペレーティングシステム用
* `/etc/sysconfig/wallarm-tarantool` CentOS および Amazon Linux 2.0.2021x およびそれ以下のオペレーティングシステム用

ファイルを編集モードで開くには、以下のコマンドを使用してください。

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```#### メモリ

postanalytics モジュールはインメモリストレージ Tarantool を使用します。本番環境では、Tarantool に割り当てられる RAM の推奨量は、サーバーの合計メモリ量の 75% です。Wallarm ノードのテストや小規模のサーバー サイズの場合、下限値でも十分です（たとえば、合計メモリの 25%）。

割り当てられたメモリサイズは、`SLAB_ALLOC_ARENA`ディレクティブを使って、[ `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool`](#4-update-postanalytics-module-configuration) の設定ファイル内で GB 単位で設定されます。値は整数または小数点（小数点は `.`）にすることができます。例：

=== "ノードをテストする場合"
    ```bash
    SLAB_ALLOC_ARENA=0.5
    ```
=== "ノードを本番環境にデプロイする場合"
    ```bash
    SLAB_ALLOC_ARENA=24
    ```

Tarantool へのメモリ割り当てに関する詳細な推奨事項は、[この手順書](configuration-guides/allocate-resources-for-node.md) で説明されています。

#### 別の postanalytics サーバーのアドレス

別の postanalytics サーバーのアドレスを設定するには:

1. 編集モードで Tarantool ファイルを開きます:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS または Amazon Linux 2.0.2021x 以下"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux、Rocky Linux または Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `HOST`および`PORT`変数のコメントを外し、次の値を設定します：

    ```bash
    # アドレスとポートをバインド
    HOST='0.0.0.0'
    PORT=3313
    ```
3. Tarantool の設定ファイルが `0.0.0.0` または `127.0.0.1` と異なる IP アドレスでの接続を受け入れるように設定されている場合は、`/etc/wallarm/node.yaml` でアドレスを指定してください:

    ```bash
    hostname: <postanalyticsノードのname>
    uuid: <postanalyticsノードのUUID>
    secret: <postanalyticsノードのsecret key>
    tarantool:
        host: '<TarantoolのIPアドレス>'
        port: 3313
    ```
4. NGINX‑Wallarm パッケージがあるサーバー上の設定ファイルに postanalytics モジュールサーバーのアドレスを追加し、適切なインストール形態の手順に従ってください：

    * [NGINX リポジトリからの NGINX 安定版](../installation/nginx/dynamic-module.md#address-of-the-separate-postanalytics-server)
    * [Debian/CentOS リポジトリからの NGINX](../installation/nginx/dynamic-module-from-distr.md#address-of-the-separate-postanalytics-server)
    * [NGINX Plus](../installation/nginx-plus.md#address-of-the-separate-postanalytics-server)

### 5. Wallarm サービスの再起動

postanalytics と NGINX‑Wallarm モジュールに設定を適用するには：

1. 別の postanalytics モジュールがあるサーバー上の `wallarm-tarantool` サービスを再起動します：

    === "Debian"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "CentOS または Amazon Linux 2.0.2021x 以下"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "AlmaLinux、Rocky Linux または Oracle Linux 8.x"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
2. NGINX‑Wallarm モジュールがあるサーバー上で NGINX サービスを再起動します：

    === "Debian"
        ```bash
        sudo systemctl restart nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx restart
        ```
    === "CentOS または Amazon Linux 2.0.2021x 以下"
        ```bash
        sudo systemctl restart nginx
        ```
    === "AlmaLinux、Rocky Linux または Oracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```

### 6. NGINX‑Wallarm と別の postanalytics モジュールの相互作用を確認する

NGINX‑Wallarm と別の postanalytics モジュールの相互作用を確認するには、テスト攻撃を保護されたアプリケーションのアドレスに送信します：

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarm と別の postanalytics モジュールが適切に設定されている場合、攻撃は Wallarm Cloud にアップロードされ、Wallarm Console の **イベント** セクションに表示されます：

![!インターフェイス内の攻撃](../images/admin-guides/test-attacks-quickstart.png)

攻撃がクラウドにアップロードされていない場合、サービスの操作にエラーがないか確認してください：

* postanalytics サービス `wallarm-tarantool` が `active` ステータスにあることを確認します

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![!wallarm-tarantool status][tarantool-status]
* postanalytics モジュールのログを分析します

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    このような記録がある場合 `SystemError binary: failed to bind: Cannot assign requested address`、指定されたアドレスとポートでサーバーが接続を受け入れることを確認してください。
* NGINX‑Wallarm モジュールがあるサーバー上で、NGINX ログを分析します：

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    このような記録がある場合 `[error] wallarm: <address> connect() failed`、NGINX‑Wallarm モジュールの設定ファイル内で別の postanalytics モジュールのアドレスが正しく指定されていることを確認し、別の postanalytics サーバーが指定されたアドレスとポートで接続を受け入れることを確認してください。
* NGINX‑Wallarm モジュールがあるサーバー上で、以下のコマンドを使用して処理済みリクエストの統計情報を取得し、`tnt_errors` の値が 0 であることを確認します

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスによって返されるすべてのパラメータの説明 →](configure-statistics-service.md)

## Postanalytics モジュールの保護

!!! warning "インストールされた postanalytics モジュールを保護してください"
    Wallarm postanalytics モジュールの新規インストールを **強くお勧め** します。そうしないと、次の問題が発生する可能性があります：
    
    *   処理済みリクエストに関する情報の開示
    *   任意の Lua コードやオペレーティングシステムコマンドを実行する可能性
   
    NGINX-Wallarm モジュールとともに postanalytics モジュールを同じサーバーでデプロイしている場合、このようなリスクは発生しません。これは、postanalytics モジュールがポート `3313` でリッスンするためです。
    
    **別にインストールされた postanalytics モジュールに適用するべきファイアウォール設定はこちらです：**
    
    *   postanalytics モジュールが Wallarm API サーバーとやり取りできるように、Wallarm API サーバーへの HTTPS トラフィックを許可します：
        *   `us1.api.wallarm.com` は US Wallarm Cloud の API サーバーです
        *   `api.wallarm.com` は EU Wallarm Cloud の API サーバーです
    *   Wallarm フィルタリングノードの IP アドレスからの接続のみを許可することにより、TCP および UDP プロトコルを使用して `3313` Tarantool ポートへのアクセスを制限します。

## Tarantool トラブルシューティング

[Tarantool トラブルシューティング](../faq/tarantool.md)