[img-nagios-service-status]: ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]: ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]: ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]: http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

# Nagiosでフィルタノードのメトリクスを操作する

事前に作成したサービスのステータスがNagiosによって正常に監視されていることを確認します。
1. Nagiosのウェブインターフェイスにログインします。
2. 「Services」リンクをクリックしてサービスページに移動します。
3. `wallarm_nginx_abnormal`サービスが表示され、「OK」ステータスになっていることを確認します：

    ![!Service status][img-nagios-service-status]

    !!! info "サービスチェックの強制"
        サービスが「OK」状態でない場合、サービスのステータスを確認するためにチェックを強制することができます。
        
        これを行うには、「Service」カラムのサービス名をクリックし、「Service Commands」リストで「Reschedule the next check of this service」を選択し、必要なパラメータを入力して実行します。    
    

4. 「Status」カラムのサービス名リンクをクリックして、サービスの詳細情報を表示します：

    ![!Detailed information about service][img-nagios-service-details]

    Nagiosに表示されているメトリック値（「Performance Data」行）が、フィルタノード上の`wallarm-status`出力と一致していることを確認します：

    --8<-- "../include-ja/monitoring/wallarm-status-check-latest.md"

5. フィルタノードで保護されたアプリケーションに対してテスト攻撃を実行します。これには、curlユーティリティまたはブラウザを使用して、アプリケーションに悪意のあるリクエストを送信します。

    --8<-- "../include-ja/monitoring/sample-malicious-request.md"
    
6. Nagiosでの「Performance Data」値が増加し、フィルタノード上の`wallarm-status`に表示される値と一致していることを確認します：

    --8<-- "../include-ja/monitoring/wallarm-status-output-latest.md"

    ![!Updated Performance Data value][img-nagios-service-perfdata-updated]

これで、フィルタノードの`curl_json-wallarm_nginx/gauge-abnormal`メトリックの値が、Nagiosのサービス状態情報に表示されるようになりました。

!!! info "Nagiosデータの視覚化"
    デフォルトでは、Nagios Coreはサービスステータス（`OK`、`WARNING`、`CRITICAL`）の追跡のみをサポートしています。 「Performance Data」に含まれるメトリック値を保存および可視化するためには、例えば[PNP4Nagios][link-PNP4Nagios]のようなサードパーティ製ユーティリティを使用できます。