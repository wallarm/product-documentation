# Wallarmによる攻撃防御のベストプラクティス

本記事では、一台で二役の警備員のようなユニークなプラットフォームであるWallarmを用いた攻撃防御の方法を解説します。Wallarmは、他のツール（WAAPとして知られる）と同様にウェブサイトを保護するだけでなく、システムのAPIも特に保護し、オンライン空間の技術的な部分すべてを安全に保ちます。

オンライン上には多くの脅威が存在するため、強固な防御策を持つことが非常に重要です。Wallarmは、SQLインジェクション、クロスサイトスクリプティング、リモートコード実行、パストラバーサルなどの一般的な脅威を単独で防ぐことができます。しかし、一部の巧妙な脅威やDoS攻撃、アカウント乗っ取り、API乱用といった特定のユースケースに対しては、いくつかの調整が必要になる場合があります。最適な保護が得られるよう各ステップをご案内します。セキュリティの専門家の方も、サイバーセキュリティの道を歩み始めたばかりの方も、本記事はセキュリティ戦略を強化するための貴重な情報を提供します。

## 複数のアプリケーションとテナントの管理

組織内で複数のアプリケーションや個別のテナントを利用している場合、Wallarmプラットフォームは管理の容易さを提供し有用です。各アプリケーションごとに[イベントや統計情報](../user-guides/settings/applications.md)を個別に確認でき、アプリケーションごとに特定のトリガーやルールを設定できます。必要に応じて、各テナントごとに別個のアクセス制御を伴った独立環境を作成することも可能です[詳細はこちら](../installation/multi-tenant/overview.md)。

## 信頼ゾーンの構築

新たなセキュリティ対策を導入する際、重要な業務アプリケーションの継続的な運用を最優先する必要があります。Wallarmプラットフォームによって信頼できるリソースが不必要に処理されないよう、[IP allowlist](../user-guides/ip-lists/overview.md)に割り当てるオプションがあります。

allowlistに登録されたリソースから発生するトラフィックは、デフォルトでは解析やログ記録が行われません。そのため、バイパスされたリクエストのデータは閲覧できなくなります。したがって、この使用は慎重に行う必要があります。

トラフィックの制限を必要としないURL、または手動監視を行いたいURLの場合は、[Wallarmノードをモニタリングモードに設定](../admin-en/configure-wallarm-mode.md)することを検討してください。これにより、これらのURLを対象とする悪意ある活動が捕捉され、ログに記録されます。記録されたイベントはWallarm Console UIで確認でき、異常を監視し、必要に応じて特定のIPのブロックなどの手動処理を実施できます。

## トラフィックフィルタリングモードおよび処理例外の制御

当社の柔軟なオプションを使用して[フィルトレーションモード](../admin-en/configure-wallarm-mode.md)を管理し、アプリケーションに合わせた処理のカスタマイズを段階的に実施することで、セキュリティ対策を展開できます。例えば、特定のノード、アプリケーション、またはその一部に対してモニタリングモードを有効にしてください。

必要に応じて、特定のリクエスト要素に合わせた[検知器の除外](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)を適用できます。

## denylistの設定

信頼できないソースからのトラフィックをブロックするため、VPN、Proxyサーバー、またはTorネットワークなどの疑わしい地域やソースからのアクセスを[denylist](../user-guides/ip-lists/overview.md)に取り込み、アプリケーションを保護できます。

## 多重攻撃の加害者のブロック

Wallarmがblocking modeの場合、悪意のあるペイロードを含むすべてのリクエストを自動的にブロックし、正当なリクエストのみを許可します。短時間に1つのIPアドレスから複数の悪意ある活動が検出された場合（多重攻撃の加害者と呼ばれることが多い）、[攻撃者を完全にブロック](../admin-en/configuration-guides/protecting-with-thresholds.md)することを検討してください。

## ブルートフォース攻撃の緩和を有効化

単一のIPアドレスからの認証ページやパスワードリセットフォームへのアクセス試行回数を制限することで、ブルートフォース攻撃を緩和できます。これは[特定のトリガー](../admin-en/configuration-guides/protecting-against-bruteforce.md)を設定することで実現できます。

## フォースドブラウジング攻撃の緩和を有効化

フォースドブラウジング攻撃は、攻撃者がディレクトリやアプリケーションに関する情報を含むファイルなど、隠されたリソースを探し出して利用しようとする攻撃です。これらの隠しファイルは、攻撃者が他の攻撃を実行する際の情報源となる可能性があります。特定のリソースにアクセスできなかった試行回数の上限を、[特定のトリガー](../admin-en/configuration-guides/protecting-against-bruteforce.md)を通じて定義することで、このような悪意ある活動を防止できます。

## レートリミットの設定

APIの利用頻度に適切な制限を設けない場合、DoS攻撃やブルートフォース攻撃、またはAPIの過剰利用など、システムを過負荷にする攻撃にさらされる可能性があります。[**Set rate limit** ルール](../user-guides/rules/rate-limiting.md)を使用することで、特定のスコープに対して確立できる接続数の上限を指定し、同時に受信リクエストの分散を均等に行えます。

## BOLA保護の有効化

Broken Object Level Authorization (BOLA) 脆弱性により、攻撃者はAPIリクエストを通じてオブジェクトの識別子により該当オブジェクトにアクセスし、そのデータを読み取ったり変更したりして認可機構を回避する可能性があります。BOLA攻撃を防ぐため、脆弱なエンドポイントを手動で指定し、それらの接続に対して制限を設けるか、Wallarmによって自動的に脆弱なエンドポイントを識別・保護するように設定できます。[詳細はこちら](../admin-en/configuration-guides/protecting-against-bola.md)

## API乱用防止の導入

[API Abuse Preventionプロファイル](../api-abuse-prevention/setup.md)を設定することで、アカウント乗っ取り、スクレイピング、セキュリティクローラー、その他の自動化された悪意ある行動によるAPIの乱用を停止およびブロックできます。

## クレデンシャルスタッフィング検出の有効化

クレデンシャルスタッフィング検出を有効化すると、侵害されたまたは弱い資格情報を使用してアプリケーションにアクセスしようとする試行に関するリアルタイム情報や、アプリケーションへのアクセスを許可するすべての侵害または弱い資格情報のダウンロード可能なリストが提供されます。

盗まれたまたは弱いパスワードを使用するアカウントの情報を得ることで、アカウント所有者への連絡、アカウントアクセスの一時停止など、これらのアカウントのデータを保護するための対策を講じることが可能です。

## カスタム攻撃検知ルールの作成

特定のシナリオにおいて、[攻撃検知署名の追加または仮想パッチの作成](../user-guides/rules/regex-rule.md)を手動で行うことが有益である場合があります。Wallarmは攻撃検知に正規表現を頼っていませんが、正規表現に基づく追加署名の導入を許可しています。

## 機微なデータのマスキング

Wallarmノードは攻撃情報をWallarm Cloudに送信します。認証情報（クッキー、トークン、パスワード）、個人情報、支払い情報など特定のデータは、処理が行われるサーバー内に留める必要があります。[データマスキングルール](../user-guides/rules/sensitive-data-rule.md)を作成し、Wallarm Cloudに送信する前に特定のリクエストポイントの元の値を切り詰めることで、機微なデータを信頼できる環境内に保持できます。

## ユーザーセッションの解析

「Attacks」または「Incidents」セクションに表示される攻撃のみを扱っている場合、攻撃が属するリクエストの論理的なシーケンスといった完全なコンテキストを把握できません。Wallarmの[**API Sessions**](../api-sessions/overview.md)は、このコンテキストを提供することで、アプリケーションがどのように攻撃されているかの一般的なパターンや、実施されたセキュリティ対策によって影響を受ける業務ロジックを把握するのに役立ちます。

ユーザーセッションを解析して、脅威アクターの行動パターンを特定し、攻撃や悪意あるボットの検知精度を確認し、リスクのあるシャドウ、ゾンビその他のエンドポイントを追跡し、パフォーマンスの問題などを特定してください。

## シームレスなSIEM/SOAR統合および重要イベントの即時アラート

Wallarmは、Sumo Logic、Splunkなどの各種SIEM/SOARシステムとのシームレスな統合を提供し、すべての攻撃情報を中央管理のためにSOCセンターへ容易にエクスポートできます。Wallarmの統合機能と[トリガー](../user-guides/triggers/triggers.md)機能を併用することで、特定の攻撃、denylistに登録されたIP、全体的な攻撃ボリュームに関するレポートやリアルタイム通知の設定に優れたツールを利用できます。

## 多層防御戦略

アプリケーション向けに堅牢で信頼性の高いセキュリティ対策を構築するには、多層防御戦略を採用することが重要です。これは、相互に補完する一連の保護策を実施し、耐性のあるディフェンスインデプス（多層防御）セキュリティポスチャーを形成することを意味します。Wallarmセキュリティプラットフォームが提供する対策に加えて、以下の実施を推奨します：

* クラウドサービスプロバイダーのL3 DDoS保護を利用してください。L3 DDoS保護はネットワークレベルで動作し、分散型DoS攻撃の緩和に寄与します。ほとんどのクラウドサービスプロバイダーは、サービスの一環としてL3保護を提供しています。
* ウェブサーバーまたはAPIゲートウェイの安全な構成の推奨事項に従ってください。例えば、[NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)または[Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway)を使用している場合は、安全な構成ガイドラインに準拠するようにしてください。

これらの追加の実施策をWallarmの[Wallarm L7 DDoS protection](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm)対策と併せて取り入れることで、アプリケーション全体のセキュリティを大幅に向上させることが可能です。

## OWASP APIトップ脅威のカバレッジの確認と強化

OWASP API Security Top 10は、APIのセキュリティリスク評価におけるゴールドスタンダードです。これらのAPI脅威に対するAPIのセキュリティポスチャーを測定するため、Wallarmは2023年版の主要脅威の緩和に関する明確な可視化と指標を提供する[ダッシュボード](../user-guides/dashboards/owasp-api-top-ten.md)を提供します。これらのダッシュボードは、全体のセキュリティ状態を評価し、適切なセキュリティ制御を設定することで発見されたセキュリティ問題に事前に対処できるよう支援します。

## JA3フィンガープリンティングの有効化

以下の機能をより正確にするために：

* [API Sessions](../api-sessions/overview.md)
* [API Abuse Prevention](../api-abuse-prevention/overview.md)（API Sessions機構を利用）

未認証トラフィックの識別精度を向上させるため、[JA3フィンガープリンティング](../admin-en/enabling-ja3.md#overview)の有効化を推奨します。