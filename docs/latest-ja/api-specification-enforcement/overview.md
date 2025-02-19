```markdown
[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API仕様強制概要  <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

**API仕様強制**は、アップロードした仕様に基づいてAPIにセキュリティポリシーを適用するよう設計されています。その主な機能は、仕様書に記載されたエンドポイントの記述と実際にREST APIへ送信されたリクエストとの間に不整合があるかどうかを検出することです。不整合が確認された場合、システムは事前に定義されたアクションを実行して対処します。

![API Specification Enforcement - diagram](../images/api-specification-enforcement/api-specification-enforcement-diagram.png)

## API仕様強制が対処する問題

組織内では、API経由で公開された多数のアプリケーションや、大量の外部IP（自動化ツールを含む）からのアクセスが試みられる場合があります。特定の送信元、送信先や動作に対して個別に制限を設けることは、リソースを大量に消費する作業です。

API仕様強制は、ポジティブセキュリティモデルを活用することでセキュリティ対策の労力を軽減します。すなわち、仕様書によって許可される内容を定義し、限られた数のポリシーでその他すべての対応方法を定義します。

仕様書によりAPIインベントリが網羅的に記述されている場合、以下のことが可能です:

* この仕様をWallarmにアップロードします。
* 数クリックで、仕様に記載されていない、または矛盾するAPI要素へのリクエストに対してポリシーを設定できます。

これにより:

* 特定の制限ルールの作成を回避できます。
* これらのルールに対する必然的な更新を回避できます。
* 直接的な制限ルールが設定されていない攻撃を見逃すことはありません。

## 動作の仕組み

リクエストは様々な点で仕様に違反する可能性があります:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

API仕様強制を使用すると、通常、CPU使用率が約20%増加します。

リソース消費を抑制するために、API仕様強制には時間（50 ms）とリクエストサイズ（1024 KB）の制限があります。これらの制限を超えると、リクエストの処理を停止し、**Specification processing overlimit** [イベント](viewing-events.md#overlimit-events)が**Attacks**セクションに作成され、いずれかの制限が超過したことが通知されます。

!!! info "API仕様強制とその他の防御策"
    API仕様強制がリクエストの処理を停止した場合でも、他のWallarm防御手続きによって処理されないことを意味するわけではありません。従って、攻撃である場合、Wallarmの設定に従って登録またはブロックされます。

これらの制限やWallarmの動作（オーバーリミットの監視からそのリクエストのブロックへの切り替え）を変更するには、[Wallarm Support](mailto:support@wallarm.com)にお問い合わせください。

API仕様強制は、Wallarmノードが実施する通常の[攻撃検知](../about-wallarm/protecting-against-attacks.md)にその規制を追加するものであり、置き換えるものではありません。これにより、トラフィックは攻撃の兆候がないことと、仕様への適合性の両方がチェックされます。

## セットアップ

API仕様強制でAPIを保護するには、仕様をアップロードし、[こちら](setup.md)に記載の通りポリシーを設定してください。
```