* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされていること  
* Dockerイメージをダウンロードするために `https://hub.docker.com/r/wallarm/envoy` にアクセスできること。ファイアウォールによりアクセスがブロックされていないことをご確認ください  
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを有するアカウントにアクセスできること  
* US Wallarm Cloudを使用する場合は`https://us1.api.wallarm.com`に、EU Wallarm Cloudを使用する場合は`https://api.wallarm.com`にアクセスできること。ファイアウォールによりアクセスがブロックされていないことをご確認ください  
* 攻撃検出ルールの更新をダウンロードするため、および[許可リストに登録済み、ブロックリストに登録済み、またはグレイリストに登録済み][ip-lists-docs]の国、地域、データセンターの正確なIPを取得するため、以下のIPアドレスにアクセスできること

    --8<-- "../include/wallarm-cloud-ips.md"