Splunk 9.0 以降で Wallarm イベントを整理してすぐに使用できるダッシュボードにするには、 [Splunk 用 Wallarm アプリケーション](https://splunkbase.splunk.com/app/6610) をインストールできます。

このアプリケーションでは、Wallarm から受信したイベントで自動的に充填される事前に設定されたダッシュボードが提供されます。さらに、アプリケーションを使用すると、各イベントの詳細ログに進むことができ、ダッシュボードからデータをエクスポートすることができます。

![!Splunk dashboard][splunk-dashboard-by-wallarm-img]

Splunk 用の Wallarm アプリケーションをインストールするには、

1. Splunk UI ➝ **アプリ**で `Wallarm API セキュリティ` アプリケーションを見つけます。
1. **インストール** をクリックし、Splunkbase の資格情報を入力します。

すでに Splunk に Wallarm イベントがログされている場合、ダッシュボードに表示され、Wallarm が発見するさらにイベントも表示されます。

また、すぐに使用できるダッシュボードを完全にカスタマイズすることができます。 例えば、そのビューまたは [検索文字列](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search)を、すべての Splunk レコードからデータを抽出するために使用します。