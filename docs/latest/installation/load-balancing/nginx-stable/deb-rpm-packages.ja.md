[img-wl-console-users]:             ../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../admin-en/configure-parameters-en.ja.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:       ../../../../admin-en/installation-postanalytics-ja/
[dynamic-dns-resolution-nginx]:     ../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:         ../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../admin-en/installation-postanalytics-en.ja.md
[waf-installation-instr-latest]:    /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:          ../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                     ../../custom/custom-nginx-version.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[oob-docs]:                         ../../oob/overview.md
[oob-advantages-limitations]:       ../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# NGINXリポジトリからNGINX stable用の動的Wallarmモジュールをインストールする

この手順書は、NGINXリポジトリからインストールしたオープンソース版のNGINX `stable` 用としてWallarmフィルタリングノードを動的モジュールとしてインストールする手順を説明しています。

## 必要条件

* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールで**管理者**ロールを持ったアカウントへのアクセス
* SELinuxが無効化されている、または[手順書][configure-selinux-instr]に従って設定されている
* NGINXバージョン1.24.0

    !!! info "カスタムNGINXバージョンの場合"
        別のバージョンをお持ちの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]に記載の手順を参照して下さい
* 全コマンドはスーパーユーザー（例：`root`）として実行します
* パッケージをダウンロードするための、 `https://repo.wallarm.com` へのアクセス。ファイアウォールによるアクセスブロックがないことを確認して下さい
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセス。アクセスがプロキシサーバー経由でのみ設定可能な場合は、[手順書][configure-proxy-balancer-instr]をご利用ください
* [許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録された国、地域、またはデータセンターで登録されたIPアドレスの実際のリストをダウンロードするために、[GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)にアクセス
* **vim**、**nano**、またはその他のテキストエディターがインストールされていること。この手順書では、**vim**が使用されています

## 1. NGINX stableと依存関係のインストール

以下はNGINXリポジトリからNGINX `stable` をインストールするオプションです：

* ビルドパッケージからのインストール

    === "Debian"
        ```bash
        sudo apt -y install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
        echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
        curl -fSsL https://nginx.org/keys/nginx_signing.key | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/nginx.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/nginx.gpg
        sudo apt update
        sudo apt -y install nginx
        ```
    === "Ubuntu"
        1. NGINX stableのために必要な依存関係をインストールします：

            ```bash
            sudo apt -y install curl gnupg2 ca-certificates lsb-release
            ```
        1. NGINX stableをインストールします：

            ```bash
            echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
            curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
            sudo apt update
            sudo apt -y install nginx
            ```
    === "CentOSまたはAmazon Linux 2.0.2021xおよび下位"

        1. CentOS 7.xでEPELリポジトリが追加されている場合は、このリポジトリからのNGINX stableのインストールを無効にするために、`exclude=nginx*`をファイル`/etc/yum.repos.d/epel.repo`に追加してください。

            修正後のファイル `/etc/yum.repos.d/epel.repo` の例：

            ```bash
            [epel]
            name=Extra Packages for Enterprise Linux 7 - $basearch
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=$basearch
            failovermethod=priority
            enabled=1
            gpgcheck=1
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            exclude=nginx*

            [epel-debuginfo]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Debug
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch/debug
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-debug-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1

            [epel-source]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Source
            #baseurl=http://download.fedoraproject.org/pub/epel/7/SRPMS
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-source-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1
            ```
        
        2. 公式リポジトリからNGINX stableをインストールします：

            ```bash
            echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
            sudo yum install -y nginx
            ```

* [NGINXレポジトリ](https://hg.nginx.org/pkg-oss/branches)の `stable` ブランチからのソースコードのコンパイルと、同じオプションでのインストール。

    !!! info "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x用のNGINX"
        AlmaLinux、Rocky Linux、またはOracle Linux 8.xにNGINXをインストールする唯一のオプションです。

詳細なインストール情報は[公式のNGINXドキュメンテーション](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/)をご覧ください。

## 2. Wallarmリポジトリの追加

WallarmノードはWallarmリポジトリからインストールおよび更新されます。リポジトリを追加するには、プラットフォームごとに以下のコマンドを使用します：

--8<-- "../include/waf/installation/add-nginx-waf-repos-4.6.md"
## 3. Wallarmのパッケージをインストールします

次のパッケージが必要です：

* NGINX-Wallarmモジュールのための`nginx-module-wallarm`
* [postanalytics](../../../admin-en/installation-postanalytics-en.md)モジュール、Tarantoolデータベース、そして追加のNGINX-Wallarmパッケージのための`wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "CentOSまたはAmazon Linux 2.0.2021xとそれ以前"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```

## 4. Wallarmモジュールを接続します

1. ファイル`/etc/nginx/nginx.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. ファイルに`include /etc/nginx/conf.d/*;`行が追加されていることを確認します。もしそのような行がなければ、それを追加します。
3. 次のディレクティブを`worker_processes`ディレクティブのすぐ後ろに追加します：

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    追加したディレクティブを持つ設定の例：

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. システムセットアップのための設定ファイルをコピーします：

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. フィルタリングノードをWallarm Cloudに接続します

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"

## 6. トラフィックの分析をWallarmに許可します

デフォルトでは、デプロイされたWallarmノードは着信トラフィックを分析しません。

以下のように、インストールされたノードを持つマシン上の`/etc/nginx/conf.d/default.conf`ファイルを変更することで、Wallarmにトラフィックのプロキシを設定します：

1. Wallarmが合法的なトラフィックをプロキシするためのIPアドレスを設定します。これはアプリケーションインスタンス、ロードバランサー、またはDNS名など、あなたのアーキテクチャに依存することができます。

    これを行うには、`proxy_pass`の値を編集します。例えば、Wallarmは合法的なリクエストを`http://10.80.0.5`に送るべきです：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. Wallarmノードが着信トラフィックを分析できるように、`wallarm_mode`ディレクティブを`monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    モニタリングモードは、最初のデプロイとソリューションのテストには推奨されています。安全なブロッキングとブロッキングモードもWallarmは提供します、[詳細][waf-mode-instr]をご覧ください。

## 7. NGINXを再起動します

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-3.6.md"

## 8. トラフィックの送信をWallarmインスタンスに設定します

ロードバランサーのターゲットを更新して、トラフィックをWallarmインスタンスに送信します。詳細については、ロードバランサーのドキュメンテーションを参照してください。

## 9. Wallarmノードの操作をテストします

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. 展開されたソリューションを微調整します

デフォルト設定でNGINX `stable`にインストールされる動的Wallarmモジュールです。フィルタリングノードは展開後にいくつかの追加設定を必要とするかもしれません。

Wallarmの設定は[NGINXディレクティブ](../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードを持つマシン上の次のファイルに設定するべきです：

* NGINX設定とともに`/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定とともに`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用される設定に使用されます。異なる設定を異なるドメイングループに適用するためには、ファイル`default.conf`を使用するか、それぞれのドメイングループに対して新しい設定ファイルを作成します（例えば、`example.com.conf`と`test.com.conf`）。NGINX設定ファイルについての詳細情報は[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
* Wallarmノードモニタリング設定とともに`/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]内にあります。
* Tarantoolデータベース設定とともに`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下は適用することができる典型的な設定のいくつかです：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [NGINXで動的DNS解決を設定する][dynamic-dns-resolution-nginx]