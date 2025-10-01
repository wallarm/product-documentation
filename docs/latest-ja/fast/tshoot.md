[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token

#   トラブルシューティング

##  よくある問題と解決方法

**次のような場合はどうしますか...**

* **...FASTノードのコンソール出力に次のいずれかのメッセージが表示される場合はどうすればよいですか?**

--8<-- "../include/fast/console-include/tshoot/request-timeout.md"
    
    または

--8<-- "../include/fast/console-include/tshoot/access-denied.md"
    
    **解決策:** 次を確認してください

    * FASTノードおよび対応するDockerホストにインターネット接続があること（特に、Wallarmの`api.wallarm.com`および`us1.api.wallarm.com`のAPIサーバーに`TCP/443`でアクセス可能であること）、および
    * 正しい[トークン][link-token]を使用し、適切なWallarm APIサーバーと通信していること。なお、FASTは、APIサーバーが欧州クラウドか米国クラウドかに応じて異なるトークンを使用します。
    
* **...リクエストソースがFASTノードの自己署名SSL証明書を信頼しない場合はどうすればよいですか?**

    **解決策:** [こちらの手順][doc-ssl]に記載された任意の方法で信頼できるSSL証明書を設定してください。
    
* **...FASTノードが起動しているのにベースラインリクエストが記録されない場合はどうすればよいですか?**

    **解決策:** 次を確認してください:

    * リクエストソースがFASTノードをプロキシサーバーとして使用するように設定されており、接続先ノードのポート、ドメイン名、またはIPアドレスが正しく指定されていること。
    * リクエストソースが使用するすべてのプロトコルについて、FASTノードをプロキシサーバーとして使用していること（よくある例として、FASTノードをHTTPプロキシとして使用している一方で、リクエストソースがHTTPSリクエストを送信しようとしているケースがあります）。
    * [`ALLOWED_HOST`][doc-allowed-host]環境変数が正しく設定されていること。
    
* **...FASTノードでFASTテストやカスタム拡張が実行されていない場合はどうすればよいですか?**

    **解決策:** FASTノードがベースラインリクエストを記録しており、これらのベースラインリクエストが当該ノードで使用中のテストポリシーに準拠していることを確認してください。

##  サポートチームへの連絡

上記の一覧に該当する問題が見つからない場合、または提示の解決策が役に立たないとお考えの場合は、Wallarmサポートチームにご連絡ください。

[メールを送信](mailto:support@wallarm.com)するか、Wallarmポータルでフォームに入力できます。ポータルからフィードバックを送信するには、次の操作を行ってください:

* ポータルの右上にあるクエスチョンマークをクリックします。
* 開いたサイドバーで「Wallarm Support」を選択します。
* メールを作成して送信します。

##  診断データの収集

Wallarmサポートチームの担当者から、FASTノードに関する診断データの収集を依頼される場合があります。

いくつかの環境変数を設定し、次のコマンドを実行してデータを収集してください（診断データを取得したいFASTノードコンテナの実際の名前で、`<FAST node container's name>`を置き換えてください）:

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST node container's name> /usr/local/bin/collect_info_fast.sh

docker cp <FAST node container's name>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

これらのコマンドが正常に実行されると、診断データはDockerホスト上の`fast_supout-$TIMESTAMP.tar.gz`アーカイブに保存されます。アーカイブ名の`$TIMESTAMP`は収集時刻を表します。