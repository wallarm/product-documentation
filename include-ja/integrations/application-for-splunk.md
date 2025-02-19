Splunk 9.0以降でWallarmイベントをすぐに利用できるダッシュボードにまとめるためには、[Wallarm application for Splunk](https://splunkbase.splunk.com/app/6610)をインストールできます。

本アプリケーションは、Wallarmから受信したイベントで自動的に埋め込まれる事前設定済みのダッシュボードを提供します。さらに、本アプリケーションでは各イベントの詳細ログに進み、ダッシュボードからデータをエクスポートすることができます。

![Splunkダッシュボード][splunk-dashboard-by-wallarm-img]

Splunk用Wallarmアプリケーションをインストールする方法:

1. Splunk UI➝**Apps**で`Wallarm API Security`アプリケーションを見つけます。
1. **Install**をクリックし、Splunkbase認証情報を入力します。

もし既にSplunkにWallarmイベントがログされている場合、これらはダッシュボードに表示されるほか、Wallarmが今後検出するイベントも表示されます。

さらに、すぐに利用できるダッシュボードの表示や、全てのSplunkレコードからデータを抽出するために使用されている[検索文字列](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search)などを完全にカスタマイズできます。