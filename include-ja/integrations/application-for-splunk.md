Splunk 9.0以降でWallarmのイベントをすぐに使えるダッシュボードに整理して表示するには、[Splunk向けWallarmアプリケーション](https://splunkbase.splunk.com/app/6610)をインストールできます。

このアプリケーションは、Wallarmから受信したイベントが自動的に取り込まれる事前構成済みのダッシュボードを提供します。加えて、各イベントの詳細ログにアクセスしたり、ダッシュボードからデータをエクスポートしたりできます。

![Splunkダッシュボード][splunk-dashboard-by-wallarm-img]

Splunk向けWallarmアプリケーションをインストールするには:

1. Splunk UI ➝ **Apps**で`Wallarm API Security`アプリケーションを探します。
1. **Install**をクリックし、Splunkbaseの認証情報を入力します。

一部のWallarmイベントが既にSplunkに記録されている場合は、それらがダッシュボードに表示され、今後Wallarmが検出するイベントも表示されます。

さらに、すぐに使えるダッシュボードは、そのビューや、すべてのSplunkレコードからデータを抽出するために使用する[検索文字列](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search)などを含め、完全にカスタマイズできます。