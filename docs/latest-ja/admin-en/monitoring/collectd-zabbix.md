[img-zabbix-scheme]:        ../../images/monitoring/zabbix-scheme.png

[link-zabbix]:              https://www.zabbix.com/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-zabbix-agent]:        https://www.zabbix.com/zabbix_agent
[link-zabbix-passive]:      https://www.zabbix.com/documentation/4.0/manual/appendix/items/activepassive
[link-zabbix-app]:          https://hub.docker.com/r/zabbix/zabbix-appliance
[link-docker-ce]:           https://docs.docker.com/install/
[link-zabbix-repo]:         https://www.zabbix.com/download
[link-allowroot]:           https://www.zabbix.com/documentation/4.0/manual/appendix/config/zabbix_agentd
[link-sed-docs]:            https://www.gnu.org/software/sed/manual/sed.html#sed-script-overview
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-metric]:              available-metrics.md#number-of-requests

[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

#   `collectd-nagios` ユーティリティを経由して Zabbix にメトリクスをエクスポート

この文書は、[`collectd-nagios`][link-collectd-nagios] ユーティリティを使用してフィルターノードのメトリクスを [Zabbix][link-zabbix] 監視システムにエクスポートする例を提供しています。

##  例のワークフロー

--8<-- "../include-ja/monitoring/metric-example.md"

![Example workflow][img-zabbix-scheme]

この文書では、以下のデプロイスキームが使用されています：
*   Wallarm のフィルターノードは、`10.0.30.5` の IP アドレスと、`node.example.local` のフルクオリファイドドメイン名を通じてアクセス可能なホストにデプロイされています。

    ホストには [Zabbix エージェント][link-zabbix-agent] 4.0 LTS がデプロイされており

    *   `collectd-nagios` ユーティリティを使用してフィルターノードのメトリクスをダウンロードします。
    *   `10050/TCP` ポートで受信接続をリッスンします（このため、Zabbix アプライアンスの使用により [パッシブチェック][link-zabbix-passive] が行われます）。
    *   メトリックの値を Zabbix アプライアンスへ渡します。
    
*   `10.0.30.30` の IP アドレスを持つ専用ホスト（以下、Docker ホストといいます）では、[Zabbix アプライアンス][link-zabbix-app] 4.0 LTS が Docker コンテナの形でデプロイされています。

    この Zabbix アプライアンスには
    
    *   一定期間ごとにフィルターノードのホストにインストールされた Zabbix エージェントに問い合わせて、監視メトリックの変更に関する情報を取得する Zabbix サーバー。
    *   `80/TCP` ポートで利用可能な Zabbix サーバー管理 Web インターフェースが含まれています。

##  Zabbxi へのメトリクスのエクスポート設定


!!! info "前提条件"
    次が想定されています：

    *   `collectd` サービスは Unix ドメインソケットを介して動作するように設定されています（詳細は [こちら][doc-unixsock] を参照してください）。
    *   [Docker Community Edition][link-docker-ce] はすでに `10.0.30.30` の Docker ホストにインストールされています。
    *   `node.example.local` のフィルターノードはすでにデプロイされ、設定され、更なる設定（例えば、SSH プロトコルを経由して）のために利用可能で、稼働しています。

### Deploying Zabbix

Zabbix アプライアンス 4.0 LTS をデプロイするには、Docker ホストで以下のコマンドを実行します：

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

これで、作業可能な Zabbix モニタリングシステムができました。

### Deploying the Zabbix Agent

フィルターノードを持つホスト上に Zabbix エージェント 4.0 LTS をインストールします：
1.  フィルターノードに接続します（例えば、SSH プロトコルを使用します）。`root` または他のスーパーユーザの権限を持つアカウントで実行していることを確認します。
2.  Zabbix リポジトリを接続します（あなたのオペレーティングシステム用の [手順書][link-zabbix-repo] の「Zabbix リポジトリのインストール」エントリを使用します）。
3.  関連するコマンドを実行して Zabbix エージェントをインストールします：

    --8<-- "../include-ja/monitoring/install-zabbix-agent.md"

4.  Zabbix アプライアンスと連携するために Zabbix エージェントを設定します。これを行うには、`/etc/zabbix/zabbix_agentd.conf` 設定ファイルに以下の変更を行います：

    ```
    Server=10.0.30.30			    # Zabbix IP アドレス
    Hostname=node.example.local		# フィルターノードを持つホストの FQDN
    ```
    
### Configuring Metrics Collection Using the Zabbix Agent

フィルターノードに接続します（例えば、SSH プロトコルを使用します）し、Zabbix エージェントを使用したメトリクスの収集を設定します。これを行うには、フィルターノードを持つホスト上で以下の手順を実行します：

####    1.  `collectd_nagios` ユーティリティをインストール
    
関連するコマンドを実行します：

--8<-- "../include-ja/monitoring/install-collectd-utils.md"

####    2.  `zabbix` ユーザーを代表して `collectd-nagios` ユーティリティが特権を持って実行するように設定します
   
以下の行を `/etc/sudoers` ファイルに追加するために [`visudo`][link-visudo] ユーティリティを使用します：
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
これにより、`zabbix` ユーザは、パスワードを提供する必要なく `sudo` ユーティリティを使用して、`collectd-nagios` ユーティリティをスーパーユーザの特権で実行することができます。

!!! info "スーパーユーザの特権で `collectd-nagios` を実行"
    このユーティリティは、データを受信するために `collectd` Unix ドメインソケットを使用するため、スーパーユーザの権限で実行する必要があります。このソケットにはスーパーユーザーだけがアクセスできます。
    
    `zabbix` ユーザを `sudoers` リストに追加する代わりに、Zabbix エージェントを `root` として実行するように設定することができます（これにはセキュリティリスクが伴う可能性があるため、推奨されません）。これは、エージェントの設定ファイルで [`AllowRoot`][link-allowroot] オプションを有効にすることで達成できます。
        
####    3.  `zabbix` ユーザが `collectd` からメトリックの値を受け取ることができることを確認します。
    
フィルターノード上で以下のテストコマンドを実行します：
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```

このコマンドは、フィルターノードを持つホスト `node.example.local` の [`wallarm_nginx/gauge-abnormal`][link-metric] メトリックの値を取得するために `zabbix` ユーザを呼び出します。
    
**コマンド出力の例：**

```
OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
```
    
####    4.  必要なメトリクスを取得するために、フィルターノードのホスト上の Zabbix エージェントの設定ファイルにカスタムパラメータを追加します。
    
例えば、フルクオリファイドドメイン名 `node.example.local` のフィルターノードのメトリック `wallarm_nginx/gauge-abnormal` に対応するカスタムパラメータ `wallarm_nginx-gauge-abnormal` を作成するには、設定ファイルに以下の行を追加します：
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```

!!! info "メトリック値の抽出"
    メトリックの値を `collectd-nagios` ユーティリティの出力から取得するには（例えば、`OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;`）、この出力を `sed` ユーティリティにパイプし、不要な文字を削除する `sed` スクリプトを実行します。
    
    スクリプトの構文については [`sed` 文書][link-sed-docs] を参照してください。

####    5.  必要なすべてのコマンドが Zabbix エージェントの設定ファイルに追加されたら、エージェントをリスタートします。

--8<-- "../include-ja/monitoring/zabbix-agent-restart-2.16.md"

##  設定完了

これで、Zabbix を使用して、Wallarm に固有のメトリクスに関連するユーザパラメータを監視することができます。