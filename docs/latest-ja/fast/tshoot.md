# トラブルシューティング

## よくある問題とその解決方法

**～の場合の対処方法**

* **...FASTノードがコンソール出力に次のいずれかのメッセージを表示している場合？**

--8<-- "../include/fast/console-include/tshoot/request-timeout.md"
    
    または

--8<-- "../include/fast/console-include/tshoot/access-denied.md"
    
    **解決策：** 以下の点を必ず確認してください：

    * FASTノードと対応するDockerホストがインターネットに接続できること（特に、Wallarmの`api.wallarm.com`および`us1.api.wallarm.com` APIサーバーに`TCP/443`でアクセスできる必要があります）。
    * 正しい [token][link-token] 値を使用し、適切なWallarm APIサーバーと通信していること。なお、FASTではAPIサーバーへの接続に際し、ノードが欧州クラウドにあるか米国クラウドにあるかに応じて*異なる*トークンを使用します。
    
* **...リクエスト元がFASTノードの自己署名SSL証明書を信頼していない場合？**

    **解決策：** [these instructions][doc-ssl]に記載された方法のいずれかを使用して、信頼できるSSL証明書を設定してください。
    
* **...FASTノードは稼働しているにもかかわらず、ベースラインリクエストが記録されていない場合？**

    **解決策：** 以下を確認してください：

    * リクエスト元がFASTノードをプロキシサーバーとして設定しており、接続先ノードの正しいポート、ドメイン名、またはIPアドレスが指定されていること。
    * リクエスト元が使用するすべてのプロトコルに対してFASTノードをプロキシサーバーとして利用していること（一般的には、FASTノードがHTTPプロキシとして利用され、リクエスト元がHTTPSリクエストを送信しようとしている場合があります）。
    * [`ALLOWED_HOST`][doc-allowed-host]環境変数が正しく設定されていること。
    
* **...FASTノードでFASTテストまたはカスタム拡張機能が実行されていない場合？**

    **解決策：** FASTノードがベースラインリクエストを記録しており、これらのベースラインリクエストがノードで使用されているテストポリシーに準拠していることを確認してください。

## サポートチームへのお問い合わせ

上記リストにお探しの問題がない場合、または解決策が役に立たないと判断された場合は、Wallarmのサポートチームにお問い合わせください。

[メールを送信する](mailto:support@wallarm.com)か、Wallarmポータル上のフォームにご記入ください。ポータルを通じてフィードバックを送信するには、以下の手順に従ってください：

* ポータル右上のクエスチョンマークをクリックしてください。
* 開いたサイドバーから「Wallarm Support」項目を選択してください。
* メールを作成して送信してください。

## 診断データの収集

Wallarmのサポートチームのメンバーが、FASTノードに関する診断データの収集を依頼する場合があります。

いくつかの環境変数を設定した後、以下のコマンドを実行してデータを収集してください（`<FAST node container's name>`は、診断データを取得したいFASTノードコンテナの実際の名前に置き換えてください）：

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST node container's name> /usr/local/bin/collect_info_fast.sh

docker cp <FAST node container's name>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

これらのコマンドが正常に実行されると、診断データはDockerホスト上の`fast_supout-$TIMESTAMP.tar.gz`アーカイブに格納されます。アーカイブ名の`$TIMESTAMP`は収集時刻を表します。