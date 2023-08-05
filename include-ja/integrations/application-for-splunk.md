Splunk 9.0以降でWallarmのイベントを整理し、使用する準備ができたダッシュボードにするには、[Splunk用のWallarmアプリケーション](https://splunkbase.splunk.com/app/6610)をインストールできます。

このアプリケーションでは、Wallarmから受け取ったイベントが自動的に入力される事前に設定されたダッシュボードを提供します。さらに、各イベントの詳細なログに進み、ダッシュボードからデータをエクスポートすることも可能になります。

![!Splunkダッシュボード][splunk-dashboard-by-wallarm-img]

Splunk用のWallarmアプリケーションをインストールするには：

1. Splunk UI➝ **Apps**で`Wallarm API Security`アプリケーションを探します。
1. **install** をクリックして、Splunkbaseの認証情報を入力します。

一部のWallarmイベントがすでにSplunkにログインされている場合、それらはダッシュボードに表示され、Wallarmがさらに発見するイベントも同様です。

さらに、準備済みのダッシュボードを完全にカスタマイズすることもできます。例えば、そのビューだけでなく、すべてのSplunkレコードからデータを抽出するために使用する[検索文字列](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search)などです。