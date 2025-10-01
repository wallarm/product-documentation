[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcementの概要  <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

**API Specification Enforcement**は、アップロードした仕様に基づいてAPIにセキュリティポリシーを適用するために設計されています。その主な機能は、仕様内のエンドポイント記述とREST APIに対して行われる実際のリクエストとの不一致を検出することです。こうした不整合が特定された場合、システムは事前定義されたアクションを実行して対処できます。

![API Specification Enforcement - 図](../images/api-specification-enforcement/api-specification-enforcement-diagram.png)

## API Specification Enforcementが解決する課題

組織では、APIで公開された多数のアプリケーションを利用しており、それらにアクセスしようとする外部のIPアドレス（自動化ツールを含む）も多数存在する場合があります。特定の送信元、対象、または挙動に結び付けた制限を個別に作成する作業は、多くのリソースを消費します。

API Specification Enforcementは、ポジティブセキュリティモデルを活用することでセキュリティ運用の負担を軽減します。仕様によって許可されるものを定義し、少数のポリシーによってそれ以外の扱い方を定義します。

**API仕様でAPIインベントリを網羅的に記述している場合、次のことができます**:

* この仕様をWallarmにアップロードします。
* いくつかのクリックで、仕様に存在しない、または仕様に矛盾するAPI要素へのリクエストに対するポリシーを設定します。

その結果、次のことが実現します:

* 個別の制限ルールの作成を避けられます。
* それらのルールに不可避な更新作業も回避できます。
* 個別の制限ルールが未設定の攻撃も見逃しません。

## 動作の仕組み

リクエストはさまざまな観点で仕様に違反する可能性があります:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

API Specification Enforcementを使用すると、CPU使用量は通常、約20%増加します。

リソースの消費を抑えるため、API Specification Enforcementには時間(50 ms)とリクエストサイズ(1024 KB)の制限があります。これらの制限を超えた場合、処理を停止し、**Attacks**セクションに**Specification processing overlimit**[イベント](viewing-events.md#overlimit-events)を作成して、いずれかの制限を超過したことを通知します。

!!! info "API Specification Enforcementとその他の防御手段"
    API Specification Enforcementがリクエストの処理を停止しても、他のWallarmの保護処理で処理されないという意味ではありません。したがって、それが攻撃であれば、Wallarmの設定に従って記録されるかブロックされます。

制限やWallarmの動作(制限超過の監視からそのようなリクエストのブロックへの変更)を変更するには、[Wallarmサポート](mailto:support@wallarm.com)にお問い合わせください。

なお、API Specification EnforcementはWallarmノードが実施する通常の[攻撃の検出](../about-wallarm/protecting-against-attacks.md)に追加で適用されるものであり、それを置き換えるものではありません。したがって、トラフィックは攻撃の兆候の有無と仕様への適合の両方について検査されます。

## セットアップ

API Specification EnforcementでAPIの保護を開始するには、仕様をアップロードし、[こちら](setup.md)に従ってポリシーを設定します。