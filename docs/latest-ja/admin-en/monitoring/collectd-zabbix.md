[img-zabbix-scheme]: ../../images/monitoring/zabbix-scheme.png

[link-zabbix]: https://www.zabbix.com/
[link-collectd-nagios]: https://collectd.org/wiki/index.php/Collectd-nagios
[link-zabbix-agent]: https://www.zabbix.com/zabbix_agent
[link-zabbix-passive]: https://www.zabbix.com/documentation/4.0/manual/appendix/items/activepassive
[link-zabbix-app]: https://hub.docker.com/r/zabbix/zabbix-appliance
[link-docker-ce]: https://docs.docker.com/install/
[link-zabbix-repo]: https://www.zabbix.com/download
[link-allowroot]: https://www.zabbix.com/documentation/4.0/manual/appendix/config/zabbix_agentd
[link-sed-docs]: https://www.gnu.org/software/sed/manual/sed.html#sed-script-overview
[link-visudo]: https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-metric]: available-metrics.md#number-of-requests

[doc-unixsock]: fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

# `collectd-nagios`ユーティリティを使用したZabbixへのメトリックのエクスポート

このドキュメントでは、[`collectd-nagios`][link-collectd-nagios]ユーティリティを使用して、フィルターノードメトリックを[Zabbix][link-zabbix]監視システムにエクスポートする例を説明します。

## 例のワークフロー

--8<-- "../include-ja/monitoring/metric-example.md"


![!Example workflow][img-zabbix-scheme]

このドキュメントでは、次のデプロイメントスキームが使用されます。
* Wallarmフィルターノードは、`10.0.30.5` IPアドレスおよび`node.example.local`完全修飾ドメイン名を介してアクセス可能なホストにデプロイされます。

  このホストには[Zabbixエージェント][link-zabbix-agent] 4.0 LTSがデプロイされており、

  * `collectd-nagios`ユーティリティを使用してフィルターノードメトリックスをダウンロードします
  * `10050/TCP`ポートでの受信接続をリッスンします（したがって、Zabbix Applianceを使用して[passive checks][link-zabbix-passive]が行われます）。
  * メトリック値をZabbix Applianceに渡します。
    
* `10.0.30.30` IPアドレスの専用ホスト（以下「Dockerホスト」と呼ばれます）に、[Zabbixアプライアンス][link-zabbix-app] 4.0 LTSがDockerコンテナの形式でデプロイされます。
    
  Zabbixアプライアンスには、

  * Zabbixサーバーは、フィルターノードホストにインストールされたZabbixエージェントから監視対象メトリックの変更に関する情報を取得するために、定期的にZabbixエージェントをポーリングします。
  * Zabbixサーバーの管理Webインターフェイスが`80/TCP`ポートで利用できます。
    
## Zabbixへのメトリックエクスポートの設定

!!! info "前提条件"
    次のことが前提条件とされています。

    * `collectd`サービスはUnixドメインソケット経由で動作するように設定されています（詳細については[こちら][doc-unixsock]を参照してください）。
    * `10.0.30.30`のDockerホストに[Docker Community Edition][link-docker-ce]がすでにインストールされています。
    * `node.example.local`フィルターノードが既にデプロイされ、設定され、さらなる設定のために利用可能であり（例：SSHプロトコル経由）、正常に動作しています。

### Zabbixのデプロイ

Zabbixアプライアンス4.0 LTSをデプロイするには、Dockerホストで次のコマンドを実行します：

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

これで、Zabbix監視システムが動作している状態になります。

### Zabbixエージェントのデプロイ

フィルターノードを持つホストにZabbixエージェント4.0 LTSをインストールします。
1. フィルターノードに接続します（例えばSSHプロトコルを使用して）。`root`または別のスーパーユーザー権限を持つアカウントで実行していることを確認してください。
2. Zabbixリポジトリを接続します（[手順][link-zabbix-repo]の「Install Zabbix repository」エントリをお使いのオペレーティングシステムに合わせて使用してください）。
3. 適切なコマンドを実行してZabbixエージェントをインストールします：

    --8<-- "../include-ja/monitoring/install-zabbix-agent.md"

4. ZabbixエージェントをZabbixアプライアンスと連携させるように設定します。これには、`/etc/zabbix/zabbix_agentd.conf`設定ファイルを次のように編集します：
   
    ```
    Server=10.0.30.30			    # ZabbixのIPアドレス
    Hostname=node.example.local		# フィルターノードのホストのFQDN
    ```

### Zabbixエージェントを使用したメトリック収集の設定

フィルターノードに接続し（例：SSHプロトコルを使用して）、Zabbixエージェントを使用したメトリック収集の設定を行います。これには、フィルターノードのホストで次の手順を実行します。

####    1.  `collectd_nagios`ユーティリティのインストール

適切なコマンドを実行します：

--8<-- "../include-ja/monitoring/install-collectd-utils.md"

####    2.  `collectd-nagios`ユーティリティを、`zabbix`ユーザー代表で昇格した権限で実行するように設定します。
   
[`visudo`][link-visudo]ユーティリティを使用して、次の行を`/etc/sudoers` ファイルに追加します：

```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```

これにより、`zabbix`ユーザーは、パスワードを提供することなく、`sudo`ユーティリティを使用して`collectd-nagios`ユーティリティをスーパーユーザー権限で実行できるようになります。

!!! info "`collectd-nagios`をスーパーユーザー権限で実行"
    このユーティリティは、`collectd`のUnixドメインソケットを使用してデータを受信するため、スーパーユーザー権限で実行する必要があります。このソケットにはスーパーユーザーのみがアクセスできます。

    `sudoers`リストに`zabbix`ユーザーを追加する代わりに、Zabbixエージェントを`root`として実行するように設定できます（これはセキュリティリスクを伴う可能性があるため、推奨されません）。これは、エージェントの設定ファイルで[`AllowRoot`][link-allowroot]オプションを有効にすることで実現できます。

####    3.  `zabbix`ユーザーが`collectd`からメトリック値を取得できることを確認합니다。
    
フィルターノードで次のテストコマンドを実行します：

``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
```

このコマンドは、`zabbix`ユーザーがフィルターノードを含む`node.example.local`ホストの[`curl_json-wallarm_nginx/gauge-abnormal`][link-metric] メトリックの値を取得するためのものです。

**コマンド出力の例：**

```
OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
```

####    4.  必要なメトリックを取得するために、フィルターノードのZabbixエージェント設定ファイルにカスタムパラメータを追加します。
   
例えば、`node.example.local`のフィルターノードの`curl_json-wallarm_nginx/gauge-abnormal`メトリックに対応するカスタムパラメータ`wallarm_nginx-gauge-abnormal`を作成するには、以下の行を設定ファイルに追加します：

```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```

!!! info "メトリック値の抽出"
    `collectd-nagios`ユーティリティの出力で`value=`の後に続くメトリックの値（例：`OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;`）を抽出するには、この出力を`sed`ユーティリティにパイプし、不必要な文字を取り除く`sed`スクリプトを実行します。

    そのスクリプトの構文については、[`sed`ドキュメント][link-sed-docs]を参照してください。

####    5.  すべての必要なコマンドがZabbixエージェント設定ファイルに追加された後、エージェントを再起動します

--8<-- "../include-ja/monitoring/zabbix-agent-restart-2.16.md"

## セットアップ完了

これで、Zabbixを使ってWallarm固有のメトリックに関連するユーザーパラメータを監視できるようになります。