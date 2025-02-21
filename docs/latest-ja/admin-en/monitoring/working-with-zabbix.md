[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png

[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need

# Zabbixにおけるフィルタノードメトリクスの取り扱い

Zabbixのウェブインターフェースのログインページにアクセスするには、`http://10.0.30.30`に移動してください。ウェブインターフェースには、標準のログイン（`Admin`）およびパスワード（`zabbix`）を使用してログインしてください。

フィルタノード`node.example.local`のメトリクスを監視するには、以下の手順を実行してください。

1.  新しいホストを作成するには、以下の手順を実行してください:
    1.  *Configuration → Hosts* タブに移動し、*Create host* ボタンをクリックしてください。
    2.  フィルタノードホストの完全修飾ドメイン名を*Host name* フィールドに入力してください（例：`node.example.local`）。
    3.  *Groups* フィールドからホストを配置するグループを選択してください（例として、事前定義された“Linux servers”グループを使用するか、専用のグループを作成してください）。
    4.  フィルタノードホストのIPアドレス（`10.0.30.5`）を*Agent interfaces* パラメータグループに入力してください。デフォルトのポート値（`10050`）はそのままにしてください。
      
        
        !!! info "ドメイン名を使用して接続する"
            必要に応じて、Zabbixエージェントに接続するためのドメイン名を設定できます。その場合、適切な設定を変更してください。
        
      
    5.  必要に応じて他の設定を構成してください。
    6.  *Enabled* チェックボックスにチェックが入っていることを確認してください。
    7.  *Add* ボタンをクリックしてホスト作成プロセスを完了してください。
    
    ![Zabbixホストの構成][img-zabbix-hosts]
   
2.  フィルタノードホストの監視対象メトリクスを追加してください。単一のメトリクスを追加するには、以下の手順に従ってください:
    1.  *Configuration → Hosts* タブのホスト一覧から作成済みのホスト`node.example.local`をクリックしてください。
    2.  ホストデータのページが表示されますので、*Items*タブに切り替え、*Create item*ボタンをクリックしてください。 
    3.  *Name*フィールドにメトリクス名を入力してください（例：`Wallarm NGINX Attacks`）。
    4.  *Type*、*Host interface*、および*Type of information*パラメータはそのままにしてください。
    5.  *Key*フィールドにメトリクスのキー名を入力してください（[Zabbix agent configuration][doc-zabbix-parameters]の`UserParameter=`に記載された内容、例：`wallarm_nginx-gauge-abnormal`）。
    6.  必要に応じて、メトリクス値の更新頻度やその他のパラメータを調整してください。
    7.  *Enabled*チェックボックスにチェックが入っていることを確認してください。
    8.  *Add*ボタンをクリックしてメトリクスの追加プロセスを完了してください。
    
    ![メトリクスの追加][img-zabbix-items]

3.  追加したメトリクスのビジュアル表示を設定してください:
    1.  ウェブインターフェースの左上にあるZabbixロゴをクリックしてダッシュボードにアクセスしてください。 
    2.  ダッシュボードを変更するには、*Edit dashboard*ボタンをクリックしてください:
        1.  *Add widget*ボタンをクリックしてウィジェットを追加してください。
        2.  *Type*ドロップダウンリストから必要なウィジェットタイプを選択してください（例：“Plain Text”）。
        3.  *Name*フィールドに適当な名前を入力してください。
        4.  *Items*リストに必要なメトリクス（例として、新たに作成した`Wallarm NGINX Attacks`）を追加してください。
        5.  *Show text as HTML*および*Dynamic Items*チェックボックスにチェックが入っていることを確認してください。
        6.  *Add widget*ウィザードの手順を進め、*Add*ボタンをクリックしてください。
        
        ![メトリクス付きウィジェットの追加][img-zabbix-widget]
      
    3.  *Save changes*ボタンをクリックして、ダッシュボードへの変更を保存してください。

4.  監視動作を確認してください: 
    1.  Zabbixウィジェットに表示される処理済みリクエストの現在値がフィルタノード上の`wallarm-status`の出力と一致していることを確認してください。
    
        1.  統計サービスのデフォルト設定を使用している場合は、`curl http://127.0.0.8/wallarm-status`コマンドを実行してください。 
        2.  それ以外の場合、上記と同様の正しいコマンドを構築するために、`/etc/nginx/conf.d/wallarm-status.conf`（オールインワンインストーラーの場合は`/etc/nginx/wallarm-status.conf`）の設定ファイルを参照してください。
        ```
        {"requests":64,"attacks":16,"blocked":0,"abnormal":64,"tnt_errors":0,"api_errors":0,"requests_lost":0,"segfaults":0,"memfaults":0,"softmemfaults":0,"time_detect":0,"db_id":46,"custom_ruleset_id":4,"proton_instances": { "total":2,"success":2,"fallback":0,"failed":0 },"stalled_workers_count":0,"stalled_workers":[] }
        ```

        ![メトリクス値の確認][img-global-view-0]

    2.  フィルタノードによって保護されているアプリケーションに対してテスト攻撃を実行してください。この攻撃の実施には、`curl`ユーティリティまたはブラウザで悪意のあるリクエストを送信することができます。
        
        --8<-- "../include/monitoring/sample-malicious-request.md"
        
    3.  `wallarm-status`の出力とZabbixウィジェットの両方で、リクエストカウンターが増加していることを確認してください:
    
        --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

        ![増加したメトリクス値の確認][img-global-view-16]

これで、Zabbixダッシュボードには、フィルタノード`node.example.local`の`wallarm_nginx/gauge-abnormal`メトリクスが表示されます。
