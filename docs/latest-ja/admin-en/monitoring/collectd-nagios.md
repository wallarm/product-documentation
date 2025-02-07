[img-collectd-nagios]:      ../../images/monitoring/collectd-nagios.png

[link-nagios]:              https://www.nagios.org/
[link-nagios-core]:         https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]:           https://github.com/NagiosEnterprises/nrpe/blob/master/README.md
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]:       https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-nrpe-readme]:         https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]:            https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]:              ../../admin-en/monitoring/available-metrics.md#number-of-requests

[doc-gauge-abnormal]:        available-metrics.md#number-of-requests
[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]:          #7-add-commands-to-the-nrpe-service-configuration-file-on-the-filter-node-to-get-the-required-metrics

# `collectd-nagios`ユーティリティを使用したNagiosへのメトリクスのエクスポート

本書は、[`collectd-nagios`][link-collectd-nagios]ユーティリティを使用して、フィルタノードのメトリクスを[Nagios][link-nagios]モニタリングシステムへエクスポートする例を示します（[Nagios Core][link-nagios-core]エディションを推奨しますが、本書は任意のNagiosエディションに適用可能です）。

!!! info "前提条件と要件"
    *   `collectd`サービスはUnixドメインソケット経由で動作するように設定済みである必要があります（詳細は[こちら][doc-unixsock]を参照）。
    *   既にNagios Coreエディションがインストール済みであると仮定します。
        
        インストールされていない場合は、Nagios Coreをインストールしてください（例えば、これらの[手順][link-nagios-core-install]に従ってください）。
    
        必要に応じて他のNagiosエディション（例: Nagios XI）を使用することも可能です。
        
        以降、本書では特に記載がない限り、「Nagios」という用語は任意のNagiosエディションを指します。
        
    *   SSHプロトコルなどを用いてフィルタノードおよびNagiosホストに接続でき、`root`アカウントまたは他の管理者権限を持つアカウントで作業できる必要があります。
    *   フィルタノードには[Nagios Remote Plugin Executor][link-nrpe-docs]サービス（以下、本書では*NRPE*と呼びます）がインストール済みである必要があります。

##  実例ワークフロー

--8<-- "../include/monitoring/metric-example.md"

![Example workflow][img-collectd-nagios]

本書で使用するデプロイメントスキームは以下の通りです:
*   Wallarmフィルタノードは、`10.0.30.5`のIPアドレスおよび`node.example.local`の完全修飾ドメイン名でアクセス可能なホスト上に配置されています。
*   Nagiosは、`10.0.30.30`のIPアドレスでアクセス可能な別のホストにインストールされています。
*   リモートホストでコマンドを実行するためにNRPEプラグインを使用します。プラグインは以下で構成されています:
    *   フィルタノードと同時に監視対象ホストにインストールされている`nrpe`サービス。標準のNRPEポートである`5666/TCP`で待機します。
    *   Nagiosホストにインストールされ、`nrpe`サービスがインストールされているリモートホスト上でコマンドを実行できるようにする`check_nrpe` NRPE Nagiosプラグイン。
*   NRPEは、Nagios互換の形式で`collectd`メトリクスを提供する`collectd_nagios`ユーティリティを呼び出すために使用されます。

##  Nagiosへのメトリクスエクスポートの設定

!!! info "本インストール例についての注意"
    本書は、Nagiosがデフォルトのパラメータでインストール済みの場合のNRPEプラグインのインストールと設定方法について記述します（Nagiosは`/usr/local/nagios`ディレクトリにインストールされ、`nagios`ユーザーが動作するものと仮定します）。プラグインもしくはNagiosの非デフォルトインストールを行う場合は、本書の該当するコマンドおよび手順を必要に応じて調整してください。

フィルタノードからNagiosへのメトリクスエクスポートを設定するには、以下の手順に従います:

### 1.  Nagiosホストとの通信のためにNRPEを設定

フィルタノードホスト上で次の手順を実行します:
1.  NRPE設定ファイル（デフォルト: `/usr/local/nagios/etc/nrpe.cfg`）を開きます。
    
2.  このファイル内の`allowed_hosts`ディレクティブに、NagiosサーバのIPアドレスまたは完全修飾ドメイン名を追加します。例えば、Nagiosホストが`10.0.30.30`のIPアドレスを使用する場合:
    
    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
    
3.  適切なコマンドを実行してNRPEサービスを再起動します:

    --8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 2.  NagiosホストにNagios NRPEプラグインをインストール

Nagiosホスト上で以下の手順を実行します:
1.  NRPEプラグインのソースファイルをダウンロードして解凍し、ソースからビルド・インストールするために必要なユーティリティをインストールします（詳細は[NRPE documentation][link-nrpe-docs]を参照）。
2.  プラグインのソースコードがあるディレクトリに移動し、ソースビルドを行い、その後プラグインをインストールします。

    必要最低限の手順は以下の通りです:
    
    ```
    ./configure
    make all
    make install-plugin
    ```

### 3.  NRPE NagiosプラグインがNRPEサービスと正常に連携することを確認

Nagiosホスト上で以下のコマンドを実行します:

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

NRPEが正常に動作していれば、コマンドの出力にNRPEのバージョン（例: `NRPE v3.2.1`）が含まれます。

### 4.  Nagiosホストで単一の引数を持つNRPE Nagiosプラグインを実行するための`check_nrpe`コマンドの定義

Nagiosホストの`/usr/local/nagios/etc/objects/commands.cfg`ファイルに、以下の行を追加します:

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5.  フィルタノードホストに`collectd_nagios`ユーティリティをインストール

以下のいずれかのコマンドを実行してください:

--8<-- "../include/monitoring/install-collectd-utils.md"

### 6.  `collectd-nagios`ユーティリティを`nagios`ユーザーに代わって昇格権限で実行するよう設定

フィルタノードホスト上で以下の手順を実行します:
1.  [`visudo`][link-visudo]ユーティリティを使用し、`/etc/sudoers`ファイルに以下の行を追加します:
    
    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    これにより、`nagios`ユーザーがパスワードなしで`sudo`を使用して`collectd-nagios`ユーティリティを管理者権限で実行できるようになります。

    
    !!! info "`collectd-nagios`を管理者権限で実行する場合について"
        このユーティリティは、データを受信するために`collectd`のUnixドメインソケットを使用するため、管理者権限での実行が必要です。管理者のみがこのソケットにアクセスできます。

2.  `nagios`ユーザーが`collectd`からメトリクス値を受け取れることを確認するために、以下のテストコマンドを実行します:
    
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    このコマンドは、`node.example.local`ホストに対し[`curl_json-wallarm_nginx/gauge-abnormal`][link-metric]メトリクス（処理されたリクエスト数）を取得できることを確認します。
    
    **コマンド出力例:**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  NRPEサービス設定ファイルに、`sudo`ユーティリティを使用してコマンドが実行されるようにするため、接頭辞を追加します:
    
    ```
    command_prefix=/usr/bin/sudo
    ```

### 7.  フィルタノード上のNRPEサービス設定ファイルに、必要なメトリクスを取得するためのコマンドを追加

例えば、`node.example.local`の完全修飾ドメイン名を持つフィルタノードの[`curl_json-wallarm_nginx/gauge-abnormal`][link-metric]メトリクスを取得する`check_wallarm_nginx_abnormal`というコマンドを作成するには、NRPEサービスの設定ファイルに以下の行を追加します:

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
```

!!! info "メトリクスの閾値設定方法について"
    必要に応じて、`-w`および`-c`オプションを使用して、`collectd-nagios`ユーティリティが`WARNING`または`CRITICAL`ステータスを返す値の範囲を指定できます（詳細はユーティリティの[ドキュメント][link-collectd-docs]を参照）。

すべての必要なコマンドをNRPEサービス設定ファイルに追加した後、適切なコマンドを実行してサービスを再起動します:

--8<-- "../include/monitoring/nrpe-restart-2.16.md"

### 8.  Nagiosホスト上で、フィルタノードホストの指定および監視するサービスの定義を設定ファイルで行う

!!! info "サービスおよびメトリクスについて"
    本書では、1つのNagiosサービスが1つのメトリクスに相当すると仮定しています。

例えば、以下のように設定できます:
1.  次の内容の`/usr/local/nagios/etc/objects/nodes.cfg`ファイルを作成します:
    
    ```
    define host{
     use linux-server
     host_name node.example.local
     address 10.0.30.5
    }

    define service {
      use generic-service
      host_name node.example.local
      check_command check_nrpe!check_wallarm_nginx_abnormal
      max_check_attempts 5
      service_description wallarm_nginx_abnormal
    }
    ```

    このファイルは、`10.0.30.5`のIPアドレスとともに`node.example.local`ホストを定義し、フィルタノードから[`check_wallarm_nginx_abnormal`][anchor-header-7]コマンドを利用して`curl_json-wallarm_nginx/gauge-abnormal`メトリクスを取得するサービスの状態をチェックする設定を意味します。

2.  Nagios設定ファイル（デフォルトは`/usr/local/nagios/etc/nagios.cfg`）に、次の行を追加します:
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    これは、次回の起動時にNagiosが`nodes.cfg`ファイルのデータを使用できるようにするためです。

3.  適切なコマンドを実行してNagiosサービスを再起動します:

--8<-- "../include/monitoring/nagios-restart-2.16.md"

## 設定完了

Nagiosは、フィルタノードの特定のメトリクスに関連付けられたサービスの監視を開始します。必要に応じて、監視対象のメトリクスに応じた他のコマンドやサービスを定義してください。

!!! info "NRPEに関する情報"
    NRPEの追加情報源:
    
    *   GitHub上のNRPEの[README][link-nrpe-readme];
    *   NRPEドキュメント（[PDF][link-nrpe-pdf]）。