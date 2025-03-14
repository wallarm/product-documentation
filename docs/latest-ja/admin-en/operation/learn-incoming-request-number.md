# アプリケーションで処理された月間リクエスト数の把握方法

Wallarmの主要なライセンス/請求方式は、環境に展開されたWallarmフィルタリングノードで処理されたリクエスト数に基づいています。本書では、アプリケーションで処理されたリクエスト数を簡単に把握する方法を説明します。

## 情報にアクセスできるチーム

通常、企業内の以下のチームは情報に容易にアクセスできる場合があります:

* DevOps
* Technical Operations
* Cloud Operations
* Platform Operations
* DevSecOps
* System Administrators
* Application Administrators
* NOC

## リクエスト数の把握方法

アプリケーションによって処理されたリクエスト数を調査する方法はいくつかあります:

* ELBもしくはALBロードバランサーを使用するAWSのお客様は、ロードバランサーのAWSモニタリングメトリクスを利用して、ロードバランサーが提供するアプリケーションの1日あたり、1週間あたりのリクエスト数を推定できます:

    ![AWS monitoring example](../../images/operation/aws-requests-example.png)

    たとえば、グラフに1分あたりの平均リクエスト数が350であり、1ヶ月あたり平均730時間が存在すると仮定すると、月間のリクエスト数は`350 * 60 * 730 = 15,330,000`と計算できます。

* HTTPロードバランサーを使用するGCPユーザーは、モニタリングメトリクス**https/request_count**を利用できます。このメトリクスはNetwork Load Balancersでは利用できません。

* Microsoft IISユーザーは、**Requests Per Sec**メトリクスを参照して1秒あたりの平均リクエスト数を求め、1台のIISサーバーによって1ヶ月に処理されるリクエスト数を計算できます。計算時には、1ヶ月あたり平均`730 * 3,600`秒が存在すると仮定してください。

* New Relic、Datadog、AppDynamics、SignalFXなどのApplication Performance Monitoringサービスを利用するユーザーは、APMコンソールから情報を取得できます（エッジレイヤーに関与するすべてのサーバーの集計値を取得し、1台のサーバーのみにならないようにご注意ください）.

* Datadog、AWS CloudWatch（その他多数）などのクラウドベースのインフラ監視システムを利用するユーザーや、PrometheusやNagiosなどの内部監視システムを利用するユーザーは、多くの場合、エッジロケーション（ロードバランサー、ウェブサーバー、アプリケーションサーバー）で処理されるリクエスト数をすでに監視しており、その情報を使用して月間の平均処理リクエスト数を容易に推定できます.

* もう一つの手法は、エッジロードバランサーまたはウェブサーバーのログを利用して、一定期間（理想的には24時間）のログレコード数をカウントする方法です。1つのログレコードが1つのリクエストに対応していると仮定してください。たとえば、このウェブサーバーはNGINXアクセスログファイルを1日1回ローテーションし、ログファイルに653,525件のリクエストが記録されています: 

    ```bash
    cd /var/log/nginx/
    zcat access.log.2.gz |wc -l
    # 653525
    ```

    * サーバーが1ヶ月に処理するリクエスト数の概算は`653,525 * 30 = 19,605,750`です.
    * 使用中のウェブサーバーの総数が分かれば、アプリケーション全体で処理されるリクエスト数の概算を行うことができます.

* Google Analyticsなどのユーザーエクスペリエンストラッキングおよび監視サービスを利用する純粋なウェブアプリケーションでは、サービスから提供ページやすべての埋め込みオブジェクト数に関する情報を取得できます.