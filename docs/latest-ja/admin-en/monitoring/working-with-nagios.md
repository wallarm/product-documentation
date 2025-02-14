[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

#   Nagiosでフィルタノードのメトリクスを操作する

あらかじめ作成されたサービスのステータスがNagiosによって正常に監視されていることを確認します：
1.  NagiosのWebインターフェースにログインします。
2.  「サービス(Services)」リンクをクリックしてサービスページに移動します。
3.  `wallarm_nginx_abnormal`サービスが表示され、「OK」ステータスであることを確認します：

    ![Service status][img-nagios-service-status]

    
    !!! info "サービスチェックの強制"
        サービスのステータスが「OK」でない場合、そのステータスを確認するためにサービスのチェックを強制することができます。
        
        これを行うには、「サービス(Service)」列のサービス名をクリックし、「サービスコマンド(Service Commands)」リストから「次のこのサービスのチェックを再スケジュールする(Reschedule the next check of this service)」を選択し、必要なパラメータを入力します。
    

4.  「ステータス(Status)」列のサービス名のリンクをクリックしてサービスの詳細情報を表示します：

    ![Detailed information about service][img-nagios-service-details]

    Nagiosに表示されているメトリック値（「Performance Data」行）がフィルタノードの`wallarm-status`出力と一致していることを確認します：

    --8<-- "../include-ja/monitoring/wallarm-status-check-latest.md"
 
5.  フィルタノードで保護されたアプリケーションにテスト攻撃を行います。これを行うために、curlユーティリティまたはブラウザを使用してアプリケーションに悪意のあるリクエストを送信することができます。

    --8<-- "../include-ja/monitoring/sample-malicious-request.md"
    
6.  Nagiosの「Performance Data」値が増加し、フィルタノードの`wallarm-status`に表示された値と一致していることを確認します：

    --8<-- "../include-ja/monitoring/wallarm-status-output-latest.md"

    ![Updated Performance Data value][img-nagios-service-perfdata-updated]

これで、フィルタノードの`wallarm_nginx/gauge-abnormal`メトリックの値がNagiosのサービスの状態情報に表示されるようになります。

!!! info "Nagiosのデータ可視化"
    デフォルトでは、Nagios Coreはサービスステータス(`OK`、`WARNING`、`CRITICAL`)のみを追跡ます。「Performance Data」に含まれるメトリック値を保存および可視化するためには、例えば[PNP4Nagios][link-PNP4Nagios]のようなサードパーティのユーティリティを使用することができます。