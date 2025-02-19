* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされています
* Dockerイメージをダウンロードするために`https://hub.docker.com/r/wallarm/node`へのアクセスが必要です。アクセスがファイアウォールによりブロックされていないことを確認してください
* Wallarm Consoleの**Administrator**役割を持つアカウントに、[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)でアクセスしてください
* US Wallarm Cloudを利用している場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用している場合は`https://api.wallarm.com`へのアクセスが必要です。アクセスがファイアウォールによりブロックされていないことを確認してください
* 攻撃検出ルールの更新と[API仕様][api-policy-enf-docs]のダウンロード、および[許可国・拒否国またはグレイリストに登録された][ip-lists-docs]国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへのアクセスが必要です

    --8<-- "../include/wallarm-cloud-ips.md"