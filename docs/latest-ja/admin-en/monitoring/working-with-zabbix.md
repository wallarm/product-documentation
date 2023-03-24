[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png

[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need

#   Zabbixでフィルタリングノードのメトリックを扱う方法

`http://10.0.30.30` に移動して、Zabbixウェブインターフェイスのログインページにアクセスします。標準のログイン（`Admin`）およびパスワード（`zabbix`）を使用して、Webインターフェースにログインします。

`node.example.local`フィルタリングノードのメトリックを監視するには、以下の操作を行います：

1.  新しいホストを作成するには、以下の手順を実行します。
    1.  *設定 → ホスト*タブに移動し、*ホスト作成*ボタンをクリックします。
    2.  *ホスト名*フィールドに、フィルタリングノードホストの完全修飾ドメイン名（`node.example.local`）を入力します。
    3.  *グループ*フィールドから、ホストを配置するグループを選択します（たとえば、事前定義された「Linuxサーバー」グループを使用するか、専用のグループを作成することができます）。
    4.  *エージェントインターフェイス*パラメータグループに、フィルタリングノードホストのIPアドレス（`10.0.30.5`）を入力します。デフォルトのポート値（`10050`）をそのまま維持します。

        !!! info "ドメイン名を使用して接続する"
            必要に応じて、Zabbixエージェントに接続するためにドメイン名を設定できます。これを行うには、適切な設定を変更します。
        
    5.  必要に応じて、他の設定を構成します。
    6.  *有効*チェックボックスがチェックされていることを確認します。
    7.  *追加*ボタンをクリックして、ホストの作成プロセスを完了します。

    ![!Zabbixホストを設定する][img-zabbix-hosts]

2.  フィルタリングノードホストに監視する必要があるメトリックを追加します。単一のメトリックを追加するには、以下の手順を実行します。
    1.  *設定 → ホスト*タブのホストのリストで作成したホスト `node.example.local` の名前をクリックします。
    2.  ホストデータのページが開きます。*アイテム* タブに切り替え、*アイテム作成* ボタンをクリックします。
    3.  *名前*フィールドにメトリック名を入力します（例：`Wallarm NGINX攻撃`）。
    4.  *タイプ*、*ホストインターフェイス*、および*情報のタイプ*パラメータをそのまま維持します。
    5.  *キー*フィールドに、メトリックのキー名を入力します（[Zabbixエージェント設定][doc-zabbix-parameters]の`UserParameter=`で指定されるように、たとえば`wallarm_nginx-gauge-abnormal`）。
    6.  必要に応じて、メトリック値の更新頻度などのパラメータを調整します。
    7.  *有効*チェックボックスがチェックされていることを確認します。
    8.  *追加*ボタンをクリックして、メトリックの追加プロセスを完了します。

    ![!メトリックの追加][img-zabbix-items]

3.  追加されたメトリックの視覚化を設定します:
    1.  Zabbixウェブインターフェースの左上にあるZabbixロゴをクリックして、ダッシュボードにアクセスします。
    2.  *ダッシュボード編集*ボタンをクリックして、ダッシュボードに変更を加えます。
        1.  *ウィジェット追加*ボタンをクリックして、ウィジェットを追加します。
        2.  *タイプ*ドロップダウンリストから、必要なウィジェットタイプ（例えば、「プレーンテキスト」）を選択します。
        3.  *名前*フィールドに好ましい名前を入力します。
        4.  *アイテム*リストに必要なメトリックを追加します（例：新しく作成された `Wallarm NGINX Attacks`）。
        5. *テキストをHTMLとして表示*および*動的アイテム*のチェックボックスがチェックされていることを確認します。
        6. *追加*ボタンをクリックして、*ウィジェット追加*ウィザードを完了します。
        
        ![!メトリックのウィジェットを追加する][img-zabbix-widget]

    3.  ダッシュボードに加えた変更を保存するには、*変更を保存*ボタンをクリックします。

4.  監視操作を確認します:
    1.  Zabbixウィジェットの現在の処理済みリクエスト数が、フィルタリングノードでの `wallarm-status` の出力と一致していることを確認します。
    
        --8<-- "../include-ja/monitoring/wallarm-status-check-padded-latest.md"

        ![!メトリック値を表示する][img-global-view-0]

    2.  フィルタリングノードで保護されたアプリケーションにテスト攻撃を実行します。これを行うには、`curl`ユーティリティまたはブラウザを使用して、アプリケーションに悪意のあるリクエストを送信します。
        
        --8<-- "../include-ja/monitoring/sample-malicious-request.md"
        
    3.  `wallarm-status`の出力とZabbixウィジェットの両方で、リクエストカウンタが増加していることを確認します。
    
        --8<-- "../include-ja/monitoring/wallarm-status-output-padded-latest.md"

        ![!変更されたメトリック値を表示する][img-global-view-16]

今後はZabbixダッシュボードに、`node.example.local`フィルタリングノードの`curl_json-wallarm_nginx/gauge-abnormal`メトリックが表示されます。