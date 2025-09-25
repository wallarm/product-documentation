* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされている必要があります。
* Dockerイメージをダウンロードするために`https://hub.docker.com/r/wallarm/envoy`にアクセスできる必要があります。アクセスがファイアウォールによってブロックされていないことを確認します。
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセスが必要です。
* US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`に、EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`にアクセスできる必要があります。アクセスがファイアウォールによってブロックされていないことを確認します。
* 攻撃検知ルールの更新をダウンロードし、[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録されている国、地域、またはデータセンターの正確なIPアドレスを取得するために、以下のIPアドレスにアクセスできる必要があります。

    --8<-- "../include/wallarm-cloud-ips.md"