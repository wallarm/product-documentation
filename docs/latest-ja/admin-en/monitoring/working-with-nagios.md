[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

# Nagiosにおけるフィルタノードメトリクスの取り扱い

Nagiosが前に作成したサービスの状態を正常に監視していることを確認します:
1.  NagiosのWebインターフェースにログインします。
2.  「Services」リンクをクリックして、サービスのページに移動します。
3.  wallarm_nginx_abnormalサービスが表示され、「OK」ステータスであることを確認します:

    ![Service status][img-nagios-service-status]

    
    !!! info "サービスチェックの強制実行"
        サービスが「OK」ステータスでない場合、サービスの状態を確認するためにチェックを強制実行できます。
        
        この操作では、「Service」列のサービス名をクリックし、「Service Commands」リストから「Reschedule the next check of this service」を選択して、必要なパラメータを入力しチェックを実行します。    
    

4.  「Status」列にあるリンク（サービス名）をクリックして、サービスの詳細情報を表示します:

    ![Detailed information about service][img-nagios-service-details]

    Nagiosに表示されるメトリクス値（「Performance Data」行）がフィルタノード上のwallarm-status出力と一致していることを確認します:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
 
5.  フィルタノードで保護されたアプリケーションに対してテスト攻撃を実施します。この操作では、curlユーティリティまたはブラウザを使用してアプリケーションに悪意のあるリクエストを送信できます。

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
6.  Nagiosの「Performance Data」値が増加し、フィルタノード上のwallarm-statusに表示された値と一致していることを確認します:

    --8<-- "../include/monitoring/wallarm-status-output-latest.md"

    ![Updated Performance Data value][img-nagios-service-perfdata-updated]

これで、フィルタノードのcurl_json-wallarm_nginx/gauge-abnormalメトリクスの値がNagiosのサービス状態情報に表示されます。

!!! info "Nagiosデータ可視化"
    デフォルトでは、Nagios Coreはサービスステータス（OK、WARNING、CRITICAL）の追跡のみをサポートします。「Performance Data」に含まれるメトリクス値を保存および可視化するために、[PNP4Nagios][link-PNP4Nagios]などのサードパーティ製ユーティリティを利用できます。