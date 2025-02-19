# セキュリティ問題の検出 <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

一度[API Surface Discovery](api-surface.md)がドメインの外部ホストを特定すると、Wallarmはこれらのホストにセキュリティ問題が存在するか確認します。発見された場合、その問題は**Security Issues**セクションに一覧表示され、詳細が記載されます。本記事では提示された情報の活用方法について説明します。

## セキュリティ問題の調査

外部ホストで見つかったセキュリティ問題を調査するには、Wallarm ConsoleでAASMの**Security Issues**セクションに移動してください。

![Security Issues](../images/api-attack-surface/security-issues.png)

ここでは、発見された問題の詳細な情報が提示されます。内容は以下を含みます：

* 簡潔な説明と詳細な問題の記述
* リスクレベルの評価および各レベルごとのセキュリティ問題の分布
* 最も脆弱なホストの一覧

## セキュリティ問題の検索対象ドメインの定義

セキュリティ問題を検索する対象のルートドメインのリストを定義できます：

1. **API Attack Surface**または**Security Issues**セクションで、**Configure**をクリックしてください。
1. **Scope**タブで、ドメインを追加します。

Wallarmは、該当ドメイン下のサブドメインや公開された漏洩認証情報の検索を開始します。検索の進捗と結果は**Status**タブに表示されます。

![Security issues - configuring scope](../images/api-attack-surface/security-issues-configure-scope.png)

## API漏洩

Wallarmは、以下の2段階の手順でAPI漏洩に関するセキュリティ問題を検索します：

1. **Passive scan**：対象ドメインに関連して公開された（漏洩した）データを、公開リソース上で確認します。
1. **Active scan**：リストにあるドメインについて自動的にサブドメインを検索します。その後、未認証ユーザーとして各エンドポイントにリクエストを送り、レスポンスやページのソースコードに機微なデータが含まれているかを確認します。検索対象のデータは以下の通りです：認証情報、APIキー、クライアントシークレット、認可トークン、メールアドレス、公開および非公開のAPIスキーマ（API仕様）。

見つかった漏洩に対する対処方法を管理できます：

* もしWallarmの[ノード](../user-guides/nodes/nodes.md)を展開している場合は、漏洩したAPI認証情報の使用試行をブロックするためにバーチャルパッチを適用してください。

    [virtual patch rule](../user-guides/rules/vpatch-rule.md)が作成されます。
    
    注：漏洩したシークレットの値が6文字以上、または正規表現が4096文字以下の場合にのみバーチャルパッチの作成が可能です。これらの条件を満たさない場合、`Not applicable`の修復状態が表示されます。この制限は正当なトラフィックのブロックを防ぐためのものです。

* 誤って追加されたと考えられる場合は、漏洩を誤検出としてマークしてください。
* 問題が解決したことを示すために、漏洩をクローズしてください。
* 漏洩をクローズしても削除されるわけではありません。問題が依然として実際である場合は、再オープンしてください。

## バーチャルパッチによってブロックされたリクエストの表示

Wallarm Console→**Attacks**で、**Type**フィルターを`Virtual patch`（`vpatch`）に設定することで、バーチャルパッチによってブロックされたリクエストを確認できます。

![Events - Security issues (API leaks) via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

なお、このフィルターには、**Security Issues**機能によって引き起こされたバーチャルパッチイベントだけでなく、他の目的で作成されたすべてのバーチャルパッチも一覧表示される点に注意してください。