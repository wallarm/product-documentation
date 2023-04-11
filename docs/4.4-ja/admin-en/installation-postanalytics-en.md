[tarantool-status]: ../images/tarantool-status.png
[configure-selinux-instr]: configure-selinux.md
[configure-proxy-balancer-instr]: configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]: ../images/check-user-no-2fa.png

# 別のpostanalyticsモジュールのインストール

--8<-- "../include-ja/waf/installation/nginx-installation-options.md"

これらの手順では、別のサーバーにpostanalyticsモジュールをインストールする方法を説明しています。

## 要件

* [NGINXリポジトリからのNGINX安定版](../installation/nginx/dynamic-module.md)、[Debian/CentOSリポジトリからのNGINX](../installation/nginx/dynamic-module-from-distr.md)または[NGINX Plus](../installation/nginx-plus.md)でインストールされたNGINX-Wallarmモジュール

    NGINX-Wallarmパッケージは、別にインストールしたpostanalyticsモジュールと同じバージョンかそれ以下のバージョンでなければなりません。この要件を、[postanalyticsパッケージのインストール](#2-install-packages-for-the-postanalytics-module)中に確認してください。
* Wallarm Consoleで**アドミニストレータ**ロールを持つアカウントへのアクセス[USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)
* [手順][configure-selinux-instr]に従ってSELinuxが無効化または設定されていること
* すべてのコマンドをスーパーユーザーとして実行 (例:`root`)
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされないことを確認してください
* US Wallarm Cloudと連携する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudと連携する場合は`https://api.wallarm.com`へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[手順][configure-proxy-balancer-instr]を使用してください
* [GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)にアクセスして、[allowlisted, denylisted, or graylisted](../user-guides/ip-lists/overview.md)国、地域、またはデータセンターに登録されているIPアドレスの実際のリストをダウンロードします。
* インストールされているテキストエディタ**vim**、**nano**、または他のもの。この手順では、**vim**が使用されます

## インストール

### 1. Wallarmリポジトリの追加

postanalyticsモジュールや他のWallarmモジュールは、Wallarmリポジトリからインストールおよび更新されます。リポジトリを追加するには、プラットフォームのコマンドを使用してください。

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

### 2. postanalyticsモジュール用のパッケージのインストール

postanalyticsモジュールとTarantoolデータベース用に、Wallarmリポジトリから`wallarm-node-tarantool`パッケージをインストールします:

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

postanalyticsモジュールはWallarm Cloudと連携して動作します。postanalyticsモジュールをクラウドに接続するためには、postanalyticsモジュール用のWallarmノードを作成する必要があります。作成されたノードは、クラウドからセキュリティルールを取得し、攻撃データをクラウドにアップロードします。

フィルタリングノードを作成し、postanalyticsモジュールをクラウドに接続するには:

1. Wallarm Consoleでの**アドミニストレーター**ロールが有効になっていることを確認してください。

    これらの設定は、[US Cloud](https://us1.my.wallarm.com/settings/users)または[EU Cloud](https://my.wallarm.com/settings/users)のユーザーリストにアクセスして確認できます。

    ![!Wallarmコンソールのユーザーリスト][img-wl-console-users]
1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)でWallarm Console → **ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. インストールされたpostanalyticsモジュールのパッケージを持つシステムで、`register-node`スクリプトを実行します。
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --no-sync --no-sync-acl
        ```

    * `<NODE_TOKEN>`はコピーしたトークンの値です。
    * postanalyticsノードインスタンスにカスタム名を設定するために`-n <HOST_NAME>`パラメータを追加することができます。最終的なノードインスタンス名は、`HOST_NAME_NodeUUID`になります。

### 4. postanalyticsモジュールの設定を更新する

postanalyticsモジュールの設定ファイルは、以下のパスにあります:

* `/etc/default/wallarm-tarantool` for Debian and Ubuntu operating systems
* `/etc/sysconfig/wallarm-tarantool` for CentOS and Amazon Linux 2.0.2021x and lower operating systems

編集モードでファイルを開くには、以下のコマンドを使用してください。

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
    ```

#### メモリ

postanalyticsモジュールはインメモリストレージ Tarantool を使います。運用環境では、Tarantoolに割り当てる推奨RAMはサーバーの合計メモリの75％です。Wallarmノードをテストしている場合やサーバーサイズが小さい場合は、さらに小さい数値で十分です（例：合計メモリの25％）。

割り当てられたメモリサイズは、GB単位で[`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`](#4-update-postanalytics-module-configuration)設定ファイル内の`SLAB_ALLOC_ARENA`ディレクティブを使用して設定されます。値は整数または小数点です（小数点`.`は小数点です）。例：

=== "ノードをテストする場合"
    ```bash
    SLAB_ALLOC_ARENA=0.5
    ```
=== "運用環境にノードをデプロイする場合"
    ```bash
    SLAB_ALLOC_ARENA=24
    ```

Tarantool用にメモリを割り振る詳細な推奨事項は、この[手順](configuration-guides/allocate-resources-for-node.md)で説明されています。別のpostanalyticsサーバーのアドレス

別のpostanalyticsサーバーのアドレスを設定するには：

1. 編集モードでTarantoolファイルを開きます：

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以降"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `HOST`および`PORT`変数のコメントを解除し、次の値を設定します。

    ```bash
    # アドレスとポートのバインド
    HOST='0.0.0.0'
    PORT=3313
    ```
3. Tarantoolの設定ファイルが`0.0.0.0`または`127.0.0.1`以外のIPアドレスでの接続を受け入れるように設定されている場合は、`/etc/wallarm/node.yaml`でアドレスを指定してください。

    ```bash
    hostname: <postanalyticsノードの名前>
    uuid: <postanalyticsノードのUUID>
    secret: <postanalyticsノードのシークレットキー>
    tarantool:
        host: '<TarantoolのIPアドレス>'
        port: 3313
    ```
4. NGINX‑Wallarmパッケージがあるサーバーの設定ファイルに、適切なインストールフォームの説明に従って、postanalyticsモジュールサーバーのアドレスを追加します。

    * [NGINX安定版：NGINXリポジトリから](../installation/nginx/dynamic-module.md#address-of-the-separate-postanalytics-server)
    * [NGINX：Debian/CentOSリポジトリから](../installation/nginx/dynamic-module-from-distr.md#address-of-the-separate-postanalytics-server)
    * [NGINX Plus](../installation/nginx-plus.md#address-of-the-separate-postanalytics-server)

### 5. Wallarmサービスの再起動

postanalyticsとNGINX‑Wallarmモジュールの設定を適用するには：

1. 別のpostanalyticsモジュールで`wallarm-tarantool`サービスを再起動します：

    === "Debian"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以降"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
2. NGINX‑WallarmモジュールがあるサーバーのNGINXサービスを再起動します：

    === "Debian"
        ```bash
        sudo systemctl restart nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx restart
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以降"
        ```bash
        sudo systemctl restart nginx
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```

### 6. NGINX‑Wallarmと別のpostanalyticsモジュールの相互作用を確認する

NGINX‑Wallarmと別のpostanalyticsモジュールの相互作用を確認するには、保護されたアプリケーションのアドレスにテスト攻撃を含むリクエストを送信できます。

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarmと別のpostanalyticsモジュールが適切に設定されている場合、攻撃がWallarmクラウドにアップロードされ、Wallarm Consoleの**イベント**セクションに表示されます。

![!インターフェイスでの攻撃](../images/admin-guides/test-attacks-quickstart.png)

攻撃がクラウドにアップロードされなかった場合は、サービスの動作にエラーがないか確認してください。

* postanalyticsサービス`wallarm-tarantool`がステータス`active`であることを確認します

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![!wallarm-tarantool status][tarantool-status]
* postanalyticsモジュールのログを解析します

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    「SystemError binary: failed to bind: Cannot assign requested address」という記録がある場合は、指定されたアドレスとポートでサーバーが接続を受け入れることを確認してください。
* NGINX‑WallarmモジュールがあるサーバーでNGINXログを解析します：

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    「[エラー] wallarm: <address> connect() failed」という記録がある場合は、NGINX‑Wallarmモジュールの設定ファイルで別のpostanalyticsモジュールのアドレスが正しく指定されていること、および別のpostanalyticsサーバーが指定されたアドレスとポートで接続を受け入れることを確認してください。
* NGINX‑Wallarmモジュールがあるサーバーで、以下のコマンドを使用して処理済みリクエストの統計情報を取得し、`tnt_errors`の値が0であることを確認します

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスが返すすべてのパラメータの説明へ→](configure-statistics-service.md)

## Postanalyticsモジュールの保護

！！！ 警告 "インストールされたpostanalyticsモジュールを保護します"
    新しくインストールされたWallarm postanalyticsモジュールをファイアウォールで保護することを**強く推奨**します。 そうしないと、次のような問題が発生する可能性があります。
    
    *   処理済みリクエストの情報が漏洩
    *   任意のLuaコードやオペレーティングシステムのコマンドが実行できる状況
   
    NGINX-Wallarmモジュールと一緒にpostanalyticsモジュールを同じサーバーにデプロイしている場合は、このようなリスクは存在しません。 これは、postanalyticsモジュールがポート`3313`をリッスンしているためです。
    
    **別にインストールされたpostanalyticsモジュールに適用するべきファイアウォールの設定は次のとおりです。**
    
    *   HTTPSトラフィックをWallarm APIサーバーとの間で許可し、postanalyticsモジュールがこれらのサーバーとやりとりできるようにします。
        *   `us1.api.wallarm.com`は、米国WallarmクラウドのAPIサーバーです。
        *   `api.wallarm.com`は、EU WallarmクラウドのAPIサーバです。
    *   Tarantoolポート`3313`へのTCPおよびUDPプロトコルによるアクセスを制限し、WallarmフィルタリングノードのIPアドレスからの接続のみを許可します。

## Tarantoolトラブルシューティング

[Tarantoolトラブルシューティング](../faq/tarantool.md)