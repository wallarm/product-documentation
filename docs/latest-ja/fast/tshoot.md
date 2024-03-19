[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token

# トラブルシューティング

## 一般的な問題とその解決方法

**もし......**

* **...FASTノードが次のメッセージのいずれかをコンソール出力に表示する場合は?**

--8<-- "../include-ja/fast/console-include/tshoot/request-timeout.md"
    
    または

--8<-- "../include-ja/fast/console-include/tshoot/access-denied.md"
    
    **解決策:** 確認してください:

    * FASTノードと対応するDockerホストがインターネットアクセスを持っていること（特に、Wallarmの `api.wallarm.com` と `us1.api.wallarm.com` APIサーバーが `TCP/443` でアクセス可能であるべきです）、そして
    * 適切な[トークン][link-token]値を使用して適切なWallarm APIサーバーと通信していること。FASTは、それらがEuropeanクラウドかAmericanクラウドのどちらに属しているかによって、APIサーバーに接続するための*異なる*トークンを使用します。
    
* **...リクエストソースがFASTノードの自己署名SSL証明書を信頼しない場合は?**

    **解決策:** 任意の方法を使用して信頼できるSSL証明書を設定します。方法は[このドキュメント][doc-ssl]に記載されています。
    
* **...FASTノードが起動し動作しているが、ベースラインリクエストが記録されていない場合は?**

    **解決策:** 次のことを確認してください:

    * リクエストソースはFASTノードをプロキシサーバーとして使用し、接続するノードの正確なポート、ドメイン名、またはIPアドレスが提供されています。
    * リクエストソースは、ソースが使用しているすべてのプロトコルについてFASTノードをプロキシサーバーとして使用しています（一般的な状況は、FASTノードがHTTPプロキシとして使用され、一方でリクエストソースがHTTPSリクエストを送信しようとしています）。
    * [`ALLOWED_HOST`][doc-allowed-host]環境変数が正しく設定されていること。
    
* **...FASTノード上でFASTテストやカスタム拡張が実行されていない場合は?**

    **解決策:** FASTノードがベースラインリクエストを記録し、これらのベースラインリクエストがノードが使用しているテストポリシーに準拠していることを確認します。

## サポートチームへのお問い合わせ

上記のリストに問題が見つからない場合、または解決策が役立たないと思われる場合は、Wallarmのサポートチームにお問い合わせください。

[電子メールを送信する](mailto:support@wallarm.com)か、Wallarmポータルのフォームに記入してください。ポータルを通じてフィードバックを送信するには、以下の手順を行います:

* ポータルの右上隅にあるクエスチョンマークをクリックします。
* 開いたサイドバーで「Wallarm Support」を選択します。
* メールを書き出して送信します。

## 診断データの収集

WallarmサポートチームのメンバーがFASTノードに関する診断データの一部の収集をお願いすることがあります。

いくつかの環境変数を設定し、次のコマンドを実行してデータを収集します（`<FAST node container's name>` を診断データを取得したいFASTノードコンテナの実際の名前で置き換えてください）:

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST node container's name> /usr/local/bin/collect_info_fast.sh

docker cp <FAST node container's name>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

これらのコマンドを正常に実行すると、診断データはDockerホストの `fast_supout-$TIMESTAMP.tar.gz` アーカイブに格納されます。アーカイブ名の `$TIMESTAMP` は収集時刻を表します。