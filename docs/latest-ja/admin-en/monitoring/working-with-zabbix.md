[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png

[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need

#   Zabbixでフィルターノードメトリクスを操作する方法

ZabbixのWebインターフェイスログインページにアクセスするためには `http://10.0.30.30` に行ってください。標準的なログイン(`Admin`)とパスワード(`zabbix`)を使って、Webインターフェイスにログインしてください。

`node.example.local`のフィルターノードのメトリクスをモニタリングするために、次のアクションを実行してください: 

1.  次のステップに従って新しいホストを作成してください:
    1.  *設定 → ホスト* タブに行き、*ホストを作成* ボタンをクリックしてください。
    2.  *ホスト名* フィールドにフィルターノードホストの完全修飾ドメイン名を入力してください (`node.example.local`)。
    3.  *グループ* フィールドからホストを配置するグループを選択してください (例えば、予め定義された"Linux servers" グループを使用するか、専用のグループを作成することができます)。
    4.  *エージェントインターフェイス* パラメータグループにフィルターノードホストのIPアドレス(`10.0.30.5`)を入力してください。デフォルトのポート値(`10050`)は変更しないでください。
   
    !!! info "ドメイン名を使用した接続"
        必要に応じて、Zabbixエージェントに接続するためのドメイン名を設定することができます。これを行うためには、適切な設定をそれに応じて変更してください。
        
    5. 必要に応じて他の設定を構成してください。
    6.  *有効化* チェックボックスがチェックされていることを確認してください。
    7.  *追加* ボタンをクリックしてホスト作成プロセスを完了してください。
    
    ![Configuring a Zabbix host][img-zabbix-hosts] 

2.  フィルターノードホストで監視すべきメトリクスを追加します。単一のメトリクスを追加するためには、以下の手順に従ってください:
    1. *設定 → ホスト* タブ上のホストのリストで、作成したホスト `node.example.local` の名前をクリックしてください。
    2. ホストデータが含まれているページが開きます。*アイテム* タブに切り替えて、*アイテムを作成* ボタンをクリックしてください。 
    3. *名前* フィールドにメトリクス名を入力してください (例えば、 `Wallarm NGINX Attacks`)。
    4.  *タイプ*、*ホストインターフェイス*、および*情報のタイプ* パラメータをそのままにします。
    5.  *キー* フィールドにメトリクスのキー名を入力してください (これは `UserParameter=`内で[Zabbix agent configuration][doc-zabbix-parameters]のように指定されています。例えば、`wallarm_nginx-gauge-abnormal`)。
    6.  必要に応じて、メトリクス値の更新頻度と他のパラメータを調整してください。
    7.  *有効化* チェックボックスがチェックされていることを確認してください。
    8. *追加* ボタンをクリックして、メトリクスの追加を完了してください。

    ![Adding a metric][img-zabbix-items]

3.  追加したメトリクスの視覚化を設定します:
    1.  ダッシュボードにアクセスするために、Webインターフェイスの左上角のZabbixロゴをクリックしてください。 
    2.  ダッシュボードに変更を加えるために、*ダッシュボードの編集* ボタンをクリックしてください：
        1.  *ウィジェットを追加* ボタンをクリックしてウィジェットを追加します。
        2.  *タイプ* のドロップダウンリストから必要なウィジェットタイプを選択してください (例えば、 "Plain Text")。
        3.  *名前* フィールドに適切な名前を入力してください。
        4.  新しく作成した `Wallarm NGINX Attacks` のように、*アイテム* リストに必要なメトリクスを追加します。
        5. *テキストをHTMLとして表示* チェックボックスと *動的アイテム* チェックボックスがチェックされていることを確認してください。
        6.  *追加* ボタンをクリックして、ウィジェットの追加ウィザードを完了します。
        
        ![Adding widget with the metric][img-zabbix-widget]
      
    3.  ダッシュボードに加えた変更を保存するために、*変更を保存* ボタンをクリックしてください。

4.  モニタリングの操作を確認します: 
    1.  フィルタノード上の`wallarm-status`の出力とZabbixウィジェットの現在の処理済みリクエストの数が一致していることを確認してください。
    
        --8<-- "../include-ja/monitoring/wallarm-status-check-padded-latest.md"

        ![Viewing the metric value][img-global-view-0]

    2.  フィルタノードによって保護されたアプリケーションに対するテスト攻撃を実行します。これを行うために、`curl` ユーティリティまたはブラウザを使用してアプリケーションに悪意のあるリクエストを送信できます。

        --8<-- "../include-ja/monitoring/sample-malicious-request.md"
        
    3.  `wallarm-status` の出力とZabbixウィジェットのリクエストカウンターが共に増加していることを確認してください:
    
        --8<-- "../include-ja/monitoring/wallarm-status-output-padded-latest.md"

        ![Viewing the changed metric value][img-global-view-16]

Zabbixダッシュボードでは、`node.example.local`フィルターノードの`wallarm_nginx/gauge-abnormal`メトリクスが表示されています。
