* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされている必要があります。
* Dockerイメージのダウンロードのために`https://hub.docker.com/r/wallarm/node`へのアクセスが必要です。アクセスがファイアウォールでブロックされていないことを確認してください。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です。
* US Wallarm Cloudをご利用の場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudをご利用の場合は`https://api.wallarm.com`へのアクセスが必要です。アクセスがファイアウォールでブロックされていないことを確認してください。
* 攻撃検知ルールおよび[API仕様][api-policy-enf-docs]の更新のダウンロードと、ご利用の[allowlisted、denylisted、graylisted][ip-lists-docs]の国・地域・データセンターに対応する正確なIPアドレスの取得のために、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"