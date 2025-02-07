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

# Zabbixへのメトリクスのエクスポート（`collectd-nagios`ユーティリティを使用）

本書は、[`collectd-nagios`][link-collectd-nagios]ユーティリティを使用してWallarmフィルタノードのメトリクスを[Zabbix][link-zabbix]監視システムにエクスポートする例を示します。

##  エクスポートのワークフロー

--8<-- "../include/monitoring/metric-example.md"

![Example workflow][img-zabbix-scheme]

本書で使用する展開スキームは以下の通りです:
* Wallarmフィルタノードは、IPアドレス`10.0.30.5`および完全修飾ドメイン名`node.example.local`でアクセス可能なホスト上に展開されています。  
　
　このホストには[Zabbix agent][link-zabbix-agent] 4.0 LTSが展開されており、
　
　* `collectd-nagios`ユーティリティを使用してフィルタノードのメトリクスをダウンロードします。
　* `10050/TCP`ポートで着信接続をリッスンします（このため[passive checks][link-zabbix-passive]はZabbix Applianceを使用して行われます）。
　* メトリクス値をZabbix Applianceに渡します。
　
* 専用ホスト（IPアドレス`10.0.30.30`、以下Dockerホストと呼びます）上に、Dockerコンテナの形態で[Zabbix Appliance][link-zabbix-app] 4.0 LTSが展開されています。  
　
　Zabbix Applianceには、
　
　* フィルタノードホストにインストールされたZabbix Agentを定期的にポーリングし、監視対象のメトリクスの変化を取得するZabbixサーバが含まれています。
　* `80/TCP`ポートで利用可能なZabbixサーバ管理のウェブインターフェイスが含まれています。

## Zabbixへのメトリクスエクスポートの設定

!!! info "前提条件"
    以下の前提条件が整っているものとします:
　
    * `collectd`サービスはUnixドメインソケット経由での動作用に設定済みです（詳細は[こちら][doc-unixsock]を参照してください）。
    * Dockerホスト`10.0.30.30`には[Docker Community Edition][link-docker-ce]が既にインストールされています。
    * フィルタノード`node.example.local`は既に展開され、設定済みであり、（例えばSSHプロトコルを介して）更なる設定が可能かつ稼働中です。

### Zabbixの展開

Dockerホスト上で以下のコマンドを実行してZabbix Appliance 4.0 LTSを展開してください:

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

これで稼働中のZabbix監視システムが用意されます。

### Zabbix Agentの展開

フィルタノードが展開されているホストにZabbix Agent 4.0 LTSをインストールします:
1.  フィルタノードに接続します（例えばSSHプロトコルを使用）。`root`または他のスーパーユーザー権限のあるアカウントで実行していることを確認してください。
2.  使用しているオペレーティングシステムに対する[Zabbixリポジトリのインストール][link-zabbix-repo]手順を参照し、Zabbixリポジトリを接続します。
3.  適切なコマンドを実行してZabbix Agentをインストールします:

    --8<-- "../include/monitoring/install-zabbix-agent.md"

4.  フィルタノードホスト上のZabbix AgentがZabbix Applianceと連携するように設定します。これには、`/etc/zabbix/zabbix_agentd.conf`設定ファイルに以下の変更を行います:
   
    ```
    Server=10.0.30.30			    # Zabbix IPアドレス
    Hostname=node.example.local		# フィルタノードがあるホストのFQDN
    ```

### Zabbix Agentを使用したメトリクス収集の設定

フィルタノードに接続し（例えばSSHプロトコルを使用）Zabbix Agentによるメトリクス収集の設定を行います。フィルタノードホストで以下の手順を実施してください:

#### 1. `collectd_nagios`ユーティリティのインストール

適切なコマンドを実行してください:

--8<-- "../include/monitoring/install-collectd-utils.md"

#### 2. `collectd-nagios`ユーティリティが`zabbix`ユーザーに代わって昇格権限で実行されるよう設定

[`visudo`][link-visudo]ユーティリティを使用し、`/etc/sudoers`ファイルに以下の行を追加してください:
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
これにより`zabbix`ユーザーは、パスワードを要求されることなくsudoユーティリティ経由で昇格権限で`collectd-nagios`ユーティリティを実行できるようになります。

!!! info "`collectd-nagios`を昇格権限で実行"
    このユーティリティは、データ受信用の`collectd` Unixドメインソケットを使用するため、スーパーユーザー権限で実行する必要があります。スーパーユーザーのみがこのソケットにアクセスできます。
    
    `zabbix`ユーザーをsudoersリストに追加する代替方法として、Zabbix Agentを`root`として実行するように設定することも可能ですが（これはセキュリティリスクを伴うため推奨されません）、エージェント設定ファイルで[`AllowRoot`][link-allowroot]オプションを有効化することで実現できます。
        
#### 3. `zabbix`ユーザーが`collectd`からメトリクス値を受け取れることを確認

フィルタノードで以下のテストコマンドを実行してください:
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```

このコマンドは、`zabbix`ユーザーがフィルタノードホスト`node.example.local`に対して[`wallarm_nginx/gauge-abnormal`][link-metric]メトリクスの値を取得するために実行されます。
    
**コマンド出力例:**

```
OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
```
    
#### 4. 必要なメトリクスを取得するため、フィルタノードホスト上のZabbix Agent設定ファイルにカスタムパラメータを追加

例えば、完全修飾ドメイン名`node.example.local`のフィルタノードに対して`wallarm_nginx/gauge-abnormal`メトリクスに対応するカスタムパラメータ`wallarm_nginx-gauge-abnormal`を作成するには、設定ファイルに以下の行を追加してください:
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```
    
!!! info "メトリクス値の抽出"
    `collectd-nagios`ユーティリティの出力（例: `OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;`）で`value=`の後に続くメトリクス値のみを抽出するため、出力が`sed`ユーティリティにパイプされ、不要な文字が除去されます。
    
    詳細な構文については、[`sed` documentation][link-sed-docs]を参照してください。

#### 5. すべての必要なコマンドをZabbix Agent設定ファイルに追加した後、エージェントを再起動してください

--8<-- "../include/monitoring/zabbix-agent-restart-2.16.md"

## 設定完了

これでWallarm固有のメトリクスに関連するユーザーパラメータをZabbixで監視できるようになります。