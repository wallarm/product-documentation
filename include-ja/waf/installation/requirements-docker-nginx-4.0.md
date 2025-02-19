* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされていること
* Dockerイメージをダウンロードするために`https://hub.docker.com/r/wallarm/node`にアクセスできること。ファイアウォールによりアクセスがブロックされていないことを確認してください
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleにて**Administrator**ロールのアカウントにアクセスできること
* US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`に、EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`にアクセスできること。ファイアウォールによりアクセスがブロックされていないことを確認してください
* 攻撃検出ルールの更新ダウンロードおよび[ホワイトリスト、ブラックリスト、またはグレイリスト済み][ip-lists-docs]国、地域、またはデータセンターの正確なIP取得のため、以下のIPアドレスへのアクセスが可能であること

    --8<-- "../include/wallarm-cloud-ips.md"