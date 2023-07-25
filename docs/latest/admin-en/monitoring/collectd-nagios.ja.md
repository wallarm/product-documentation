[img-collectd-nagios]:      ../../images/monitoring/collectd-nagios.png

[link-nagios]:              https://www.nagios.org/
[link-nagios-core]:         https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]:           https://github.com/NagiosEnterprises/nrpe/blob/master/README.ja.md
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]:       https://collectd.org/documentation/manpages/collectd-nagios.1.shtml
[link-nrpe-readme]:         https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]:            https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]:              ../../admin-en/monitoring/available-metrics.ja.md#number-of-requests

[doc-gauge-abnormal]:        available-metrics.ja.md#number-of-requests
[doc-unixsock]:             fetching-metrics.ja.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]:          #7-add-commands-to-the-nrpe-service-configuration-file-on-the-filter-node-to-get-the-required-metrics

#   `collectd-nagios`ユーティリティを介したNagiosへのメトリックのエクスポート

このドキュメントでは、[`collectd-nagios`][link-collectd-nagios]ユーティリティを使用して、フィルタノードメトリックを[Nagios][link-nagios]モニタリングシステム（[Nagios Core][link-nagios-core]エディションが推奨されますが、このドキュメントはどのNagiosエディションでも適用できます）にエクスポートする例を示します。


!!! info "前提条件と要件"
    *   `collectd`サービスは、Unixドメインソケットを介して動作するように設定する必要があります（詳細については[こちら][doc-unixsock]を参照してください）。
    *   すでにNagios Coreエディションがインストールされていることが前提です。
        
        まだインストールされていない場合は、Nagios Coreをインストールしてください（例：[これらの手順][link-nagios-core-install]に従ってください）。
    
        必要に応じて、別のエディションのNagios（例：Nagios XI）を使用することができます。
        
        以下では、「Nagios」という用語は、特に別の記載がない限り、どのエディションのNagiosにも適用されるものとします。
        
    *   フィルタノードおよびNagiosホスト（例：SSHプロトコルを介して）に接続する能力を持っており、スーパーユーザ権限を持つ`root`アカウントまたは別のアカウントで作業ができる必要があります。
    *   [Nagios Remote Plugin Executor][link-nrpe-docs]サービス（以下では*NRPE*と記載されます）がフィルタノードにインストールされている必要があります。

##  例：ワークフロー

--8<-- "../include/monitoring/metric-example.ja.md"

![!Example workflow][img-collectd-nagios]

このドキュメントで使用されている展開スキームは、以下のとおりです。
*   Wallarmフィルタノードは、`10.0.30.5`IPアドレスおよび`node.example.local`完全修飾ドメイン名を介してアクセスできるホストに展開されています。
*   Nagiosは、`10.0.30.30` IPアドレスを介してアクセスできる別のホストにインストールされています。
*   リモートホストでコマンドを実行するために、NRPEプラグインが使用されます。このプラグインには、
    *   フィルタノードと一緒に監視されたホストにインストールされている`nrpe`サービスが含まれます。標準のNRPEポートである`5666/TCP`でリッスンします。
    *   Nagiosホストにインストールされている`check_nrpe` NRPE Nagiosプラグインで、`nrpe`サービスがインストールされているリモートホストでコマンドを実行できるようになっています。
*   NRPEは、Nagios互換のフォーマットで`collectd`メトリックを提供する`collectd_nagios`ユーティリティを呼び出すために使用されます。

##  Nagiosへのメトリックのエクスポート設定


!!! info "このインストール例に関して"
    このドキュメントでは、Nagiosが既にデフォルトのパラメータでインストールされている場合のNRPEプラグインのインストールと設定方法を説明しています（Nagiosが`/usr/local/nagios`ディレクトリにインストールされており、`nagios`ユーザーを使用して操作していることが前提です）。プラグインやNagiosの非デフォルトのインストールを行っている場合は、必要に応じてドキュメントから対応するコマンドと手順を調整してください。

フィルタノードからNagiosへのメトリックのエクスポートを設定するには、次の手順を実行します。

### 1.  NRPEのNagiosホストとの通信を設定する

これを行うには、フィルタノードホストで以下を実行します。
1.  NRPE設定ファイルを開きます（デフォルト：`/usr/local/nagios/etc/nrpe.cfg`）。
    
2.  このファイルの`allowed_hosts`ディレクティブに、NagiosサーバーのIPアドレスまたは完全修飾ドメイン名を追加します。例えば、Nagiosホストが`10.0.30.30` IPアドレスを使用している場合：
    
    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
    
3.  適切なコマンドを実行して、NRPEサービスを再起動します。

    --8<-- "../include/monitoring/nrpe-restart-2.16.ja.md"

### 2.  Nagios NRPEプラグインをNagiosホストにインストールする

これを行うには、Nagiosホストで次の手順を実行します。
1.  NRPEプラグインのソースファイルをダウンロードして解凍し、プラグインのビルドとインストールに必要なユーティリティをインストールします（[NRPEドキュメント][link-nrpe-docs]を参照してください）。
2.  プラグインのソースコードがあるディレクトリに移動し、ソースからビルドし、プラグインをインストールします。

    最小限の手順は以下の通りです。
    
    ```
    ./configure
    make all
    make install-plugin
    ```
    
### 3.  NRPE NagiosプラグインがNRPEサービスと正常にやり取りできることを確認する

これを行うには、Nagiosホストで次のコマンドを実行します。

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

NRPEが正常に動作している場合、コマンドの出力にはNRPEのバージョン（例：`NRPE v3.2.1`）が含まれます。

### 4.  Nagiosホストで1つの引数を使用してNRPE Nagiosプラグインを実行する`check_nrpe`コマンドを定義する

これを行うには、`/usr/local/nagios/etc/objects/commands.cfg`ファイルに次の行を追加します。

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5. フィルタノードホストに`collectd_nagios`ユーティリティをインストールする

以下のコマンドのいずれかを実行します。

--8<-- "../include/monitoring/install-collectd-utils.ja.md"

### 6.  `nagios`ユーザーに代わって`collectd-nagios`ユーティリティを特権で実行するように設定する

これを行うには、フィルタノードホストで以下の手順を実行します。
1.  [`visudo`][link-visudo]ユーティリティを使用して、`/etc/sudoers`ファイルに次の行を追加します。
    
    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    これにより、`nagios`ユーザーは、パスワードを提供することなく`sudo`を使用して`collectd-nagios`ユーティリティをスーパーユーザー権限で実行できるようになります。

    
    !!! info "スーパーユーザー権限で`collectd-nagios`を実行する"
        ユーティリティは、`collectd` Unixドメインソケットを使用してデータを受信するため、スーパーユーザー権限で実行する必要があります。このソケットには、スーパーユーザーのみがアクセスできます。

2.  次のテストコマンドを実行して、`nagios`ユーザーが`collectd`からメトリック値を取得できることを確認します。
    
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    このコマンドにより、`nagios`ユーザーは`node.example.local`ホストの[`curl_json-wallarm_nginx/gauge-abnormal`][link-metric]メトリック（処理されたリクエストの数）の値を取得できます。
    
    **コマンド出力の例：**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  NRPEサービスの設定ファイルにプレフィックスを追加して、`sudo`ユーティリティを使ってコマンドを実行できるようにします。
    
    ```
    command_prefix=/usr/bin/sudo
    ```### 7. 必要なメトリックスを取得するために、フィルタノードのNRPEサービス設定ファイルにコマンドを追加する

例えば、`node.example.local`の完全修飾ドメイン名を持つフィルタノードの`curl_json-wallarm_nginx/gauge-abnormal`メトリックを受信する`check_wallarm_nginx_abnormal`という名前のコマンドを作成するには、NRPEサービスの設定ファイルに以下の行を追加します。

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
```

!!! info "メトリックの閾値を設定する方法"
    必要に応じて、`-w`および`-c`オプションを使用して、`collectd-nagios`ユーティリティが`WARNING`または`CRITICAL`ステータスを返す値の範囲を指定することができます（詳細情報は、ユーティリティの[ドキュメント][link-collectd-docs]で入手できます）。
    
必要なすべてのコマンドをNRPEサービス設定ファイルに追加したら、適切なコマンドを実行してサービスを再起動します。

--8<-- "../include/monitoring/nrpe-restart-2.16.ja.md"

### 8. Nagiosホストで、フィルタノードホストを指定し、監視するサービスを定義するために設定ファイルを使用します

!!! info "サービスとメトリック"
    このドキュメントでは、1つのNagiosサービスが1つのメトリックに相当すると仮定されています。

例を以下のように行うことができます：
1. 以下の内容を持つ`/usr/local/nagios/etc/objects/nodes.cfg`ファイルを作成します。

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

    このファイルでは、`10.0.30.5` IPアドレスを持つ`node.example.local`ホストと、`wallarm_nginx_abnormal`サービスのステータスをチェックするコマンドを定義しています。これは、フィルタノードから`curl_json-wallarm_nginx/gauge-abnormal`メトリックを受信することを意味します（[`check_wallarm_nginx_abnormal`][anchor-header-7]コマンドの説明を参照）。

2. Nagios設定ファイルに（デフォルトでは`/usr/local/nagios/etc/nagios.cfg`）以下の行を追加します。

    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```

    これにより、Nagiosは次の起動時から`nodes.cfg`ファイルのデータを使用するようになります。

3. 適切なコマンドを実行してNagiosサービスを再起動します。

--8<-- "../include/monitoring/nagios-restart-2.16.ja.md"

## 設定が完了しました。

Nagiosは、フィルタノードの特定のメトリックに関連するサービスを監視しています。必要に応じて、他のコマンドやサービスを定義して、関心のあるメトリックをチェックすることができます。

!!! info "NRPEに関する情報"
    NRPEに関する追加情報のソース：
    
    *   GitHub上のNRPEの[README][link-nrpe-readme]；
    *   NRPEドキュメント（[PDF][link-nrpe-pdf]）。