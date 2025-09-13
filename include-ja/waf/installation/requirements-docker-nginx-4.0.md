* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされている必要があります
* Dockerイメージをダウンロードするために`https://hub.docker.com/r/wallarm/node`へのアクセスが必要があります。アクセスがファイアウォールによってブロックされていないことを確認してください
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です
* US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`へのアクセスが必要があります。アクセスがファイアウォールによってブロックされていないことを確認してください
* 攻撃検出ルールの更新をダウンロードするため、また[allowlisted, denylisted, or graylisted][ip-lists-docs]の国、地域、データセンターに対する正確なIPアドレスを取得するために、以下のIPアドレスへのアクセスが必要があります

    --8<-- "../include/wallarm-cloud-ips.md"