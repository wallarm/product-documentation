* Wallarm Consoleにおいて2要素認証が無効になっている[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)用の**Administrator**または**Deploy**ロールを持つアカウントへのアクセスが可能である必要があります。
* SELinuxが無効化されているか、[instructions][configure-selinux-instr]に従って設定されている必要があります。
* 全てのコマンドをスーパーユーザー(例: `root`)として実行できる必要があります。
* リクエスト処理とpostanalyticsが異なるサーバーで行われる場合: [instructions][install-postanalytics-instr]に従って、別のサーバーにpostanalyticsがインストールされている必要があります。
* `https://repo.wallarm.com`にパッケージをダウンロードするためのアクセスが可能である必要があります。アクセスがファイアウォールによってブロックされていないことを確認してください。
* `https://us1.api.wallarm.com:444`にアクセスしてUS Wallarm Cloudで作業するか、`https://api.wallarm.com:444`にアクセスしてEU Wallarm Cloudで作業する必要があります。アクセスがプロキシサーバー経由でのみ設定できる場合は、[instructions][configure-proxy-balancer-instr]に従ってください。
* インストール済みのテキストエディターとして**vim**, **nano**またはその他のエディターが必要です。手順では**vim**が使用されています。