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

＃ `collectd-nagios`ユーティリティを使用してNagiosへのメトリクスのエクスポート

このドキュメントでは、[`collectd-nagios`][link-collectd-nagios]ユーティリティを利用してフィルタノードメトリクスを[Nagios][link-nagios]監視システムにエクスポートする例を示しています（当ドキュメントはすべてのNagiosエディションに適用可能ですが、[Nagios Core][link-nagios-core]エディションの使用が推奨されます）。

!!! info "前提と要件"
    *   `collectd` サービスは、Unixドメインソケットを介して作業するように設定する必要があります（詳細は[こちら][doc-unixsock]を参照してください）。
    *   すでにNagios Coreエディションがインストールされていると想定しています。
        
        そうでない場合は、Nagios Coreをインストールしてください（例えば、[這記載の手順][link-nagios-core-install]に従います）。
    
        必要であれば、Nagios XIなどの他のエディションを使用できます。
        
        「Nagios」は後述するすべてのNagiosエディションを指す用語として使用されます。
        
    *   フィルタノードとNagiosホストに接続する能力が必要であり（例えば、SSHプロトコル経由で）、`root`アカウントまたは他の特権アカウントで作業を行うことができます。
    *   フィルタノードに[Nagios Remote Plugin Executor][link-nrpe-docs]サービス（これ以降、この例では*NRPE*と呼ばれます）がインストールされている必要があります。

## 例：ワークフロー

--8<-- "../include-ja/monitoring/metric-example.md"

![Example workflow][img-collectd-nagios]

このドキュメントでは以下のデプロイメントスキームを使用します：
*   Wallarmフィルタノードは、`10.0.30.5`IPアドレス及び`node.example.local`完全修飾ドメイン名を介してアクセス可能なホストにデプロイされています。
*   Nagiosは、`10.0.30.30` IPアドレスを介してアクセス可能な別のホストにインストールされています。
*   リモートホストでコマンドを実行するために、NRPEプラグインが使用されます。このプラグインは下記を含んでいます
    *   フィルタノードとともに監視対象ホストにインストールされた`nrpe`サービス。`5666/TCP`標準NRPEポートでリッスンします。
    *   Nagiosホストにインストールされ、`nrpe`サービスがインストールされているリモートホストでコマンドを実行できるようにする`check_nrpe`NRPE Nagiosプラグイン。
*   NRPEはNagios互換フォーマットで`collectd`メトリクスを提供する`collectd_nagios`ユーティリティを呼び出すために使用されます。

## Nagiosへのメトリクスエクスポートの設定

!!! info "このインストールの例についてのメモ"
    この文書では、NRPEプラグインをインストールする方法と設定する方法を説明していますが、Nagiosが既にデフォルトのパラメータでインストールされていることを前提としています（Nagiosが`/usr/local/nagios`ディレクトリにインストールされていて、操作には`nagios`ユーザを使用すると想定しています）。プラグインやNagiosをデフォルトでない状態でインストールする場合は、コマンドとドキュメントの指示を必要に応じて調整してください。

フィルタノードからNagiosへのメトリクスエクスポートを設定するには、次のステップを実行します：

### 1. Nagiosホストと通信するようにNRPEを設定します

これには、フィルタノードホストで以下の操作を行います：
1.  NRPEの設定ファイル（デフォルトでは`/usr/local/nagios/etc/nrpe.cfg`）を開きます。

2.  このファイルの`allowed_hosts`ディレクティブにNagiosサーバのIPアドレスまたは完全修飾ドメイン名を追加します。たとえば、Nagiosホストが`10.0.30.30`のIPアドレスを使用している場合は、次のように指定します：

    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```

3.  適切なコマンドを実行してNRPEサービスを再起動します。

    --8<-- "../include-ja/monitoring/nrpe-restart-2.16.md"

### 2. NagiosホストにNagios NRPEプラグインをインストールします

これには、Nagiosホストで以下の操作を行います：
1.  NRPEプラグインのソースファイルをダウンロードして解凍し、プラグインをビルドしてインストールするための必要なユーティリティをインストールします（詳細については[NRPEのドキュメンテーション][link-nrpe-docs]を参照してください）。
2.  プラグインソースコードのディレクトリに移動し、ソースからビルドし、プラグインをインストールします。

    最小限のステップは次のとおりです：

    ```
    ./configure
    make all
    make install-plugin
    ```

### 3. NRPE NagiosプラグインがNRPEサービスと正常に対話することを確認します

これには、Nagiosホストで次のコマンドを実行します：

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

NRPEが正常に動作している場合、コマンドの出力にはNRPEのバージョン（例えば、`NRPE v3.2.1`）が含まれるはずです。

### 4. Nagiosホストで、`check_nrpe`コマンドを定義して、NRPE Nagiosプラグインを単一の引数で実行します

これには、`/usr/local/nagios/etc/objects/commands.cfg`ファイルに次の行を追加します：

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5. フィルタノードホストに`collectd_nagios`ユーティリティをインストールします

次のいずれかのコマンドを実行します：

--8<-- "../include-ja/monitoring/install-collectd-utils.md"

### 6. `collectd-nagios`ユーティリティを`nagios`ユーザの代わりに特権を持って実行するように設定します

これには、フィルタノードホストで以下の操作を行います：
1.  [`visudo`][link-visudo]ユーティリティを使用して、`/etc/sudoers`ファイルに以下の行を追加します：

    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    これにより、`nagios`ユーザは、パスワードを提供することなく、`sudo`を使用して超ユーザー権限で`collectd-nagios`ユーティリティを実行することができます。

    
    !!! info "`collectd-nagios`をスーパーユーザー権限で実行する"
        `collectd`のUnixドメインソケットを使用してデータを受け取るため、ユーティリティはスーパーユーザー権限で実行する必要があります。このソケットには、スーパーユーザーのみがアクセスできます。

2.   次のテストコマンドを実行して、`nagios`ユーザが`collectd`からメトリクス値を取得できることを確認します：

    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    このコマンドにより、`nagios`ユーザは`node.example.local`ホストの[`wallarm_nginx/gauge-abnormal`][link-metric]メトリクス（処理済みのリクエスト数）の値を取得できます。

    **コマンドの出力例：**

    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  `sudo`ユーティリティを使用してコマンドを実行できるように、NRPEサービス設定ファイルにプレフィックスを追加します：

    ```
    command_prefix=/usr/bin/sudo
    ```

### 7. 必要なメトリクスを取得するために、フィルタノードのNRPEサービス設定ファイルにコマンドを追加します

例えば、フィルタノード（`node.example.local`完全修飾ドメイン名）の最初のメトリクス`wallarm_nginx/gauge-abnormal`を受信するためのコマンド`check_wallarm_nginx_abnormal` を作成するには、次の行をNRPEサービスの設定ファイルに追加します：

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```


!!! info "メトリクスの閾値を設定する方法"
    必要に応じて、`collectd-nagios`ユーティリティが`WARNING`または`CRITICAL`ステータスを返す値の範囲を、対応する`-w`および`-c`オプションを使用して指定できます（詳細はユーティリティの[ドキュメンテーション][link-collectd-docs]をご覧ください）。

NRPEサービス設定のファイルに必要なすべてのコマンドを追加したあとは、適切なコマンドを実行してサービスを再起動します：

--8<-- "../include-ja/monitoring/nrpe-restart-2.16.md"

### 8. Nagiosホストで、フィルタノードホストを指定し、モニタリングするサービスを定義するために設定ファイルを利用します

!!! info "サービスとメトリクス"
    このドキュメントでは、1つのNagiosサービスと1つのメトリクスが同等と想定しています。

たとえば、次の方法で行います：
1.  次の内容の`/usr/local/nagios/etc/objects/nodes.cfg`ファイルを作成します：

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

    このファイルでは、`10.0.30.5` IPアドレスを持つ`node.example.local`ホストと、`wallarm_nginx_abnormal`サービスのステータスをチェックするコマンドを定義しています。これは、フィルタノードから`wallarm_nginx/gauge-abnormal`メトリクスを取得することを意味します（[`check_wallarm_nginx_abnormal`][anchor-header-7]コマンドの説明を参照）。

2.  Nagiosの設定ファイル（デフォルトでは`/usr/local/nagios/etc/nagios.cfg`）に以下の行を追加します：
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    次回起動から`nodes.cfg`ファイルのデータをNagiosが使用するために必要です。

3.  適切なコマンドを実行してNagiosサービスを再起動します：

--8<-- "../include-ja/monitoring/nagios-restart-2.16.md"

## 設定が完了しました

これでNagiosはフィルタノードの特定のメトリクスに関連するサービスを監視します。必要に応じて、興味のあるメトリクスをチェックするための他のコマンドとサービスを定義できます。

!!! info "NRPEに関する情報"
    NRPEについての追加情報のソース：
    
    *   NRPEのGitHubの[README][link-nrpe-readme]；
    *   NRPEのドキュメンテーション（[PDF][link-nrpe-pdf]）。