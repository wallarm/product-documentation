# API攻撃面の検出 <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarmの[API Attack Surface Management](overview.md)のコンポーネントである**API攻撃面の検出**（**AASD**）は、選択したドメインをスキャンしてそのすべての外部ホストおよびAPIを検出し、WebおよびAPIベースの攻撃に対する保護状況を評価し、WAF/WAAPソリューションの不足を特定します。Wallarmにサブスクライブするだけで動作するため、何もデプロイする必要はありません。本記事はそのコンポーネントの概要を説明します。

![API攻撃面の検出](../images/api-attack-surface/aasm-api-surface.png)

## 対応する問題

組織の外部APIのリストを完全に把握することは、監視されていないまたは文書化されていないAPIが悪意のある攻撃の侵入口となる可能性があるため、潜在的なセキュリティリスクを軽減するための第一歩です。

**API攻撃面の検出**のWallarmコンポーネントは、以下の提供内容によりこれらの問題の解決を支援します：

* 選択したドメインに対する外部ホストの自動検出。
* 検出されたホストの開放ポートの自動検出。
* 検出されたホストのAPIの自動検出。  

    以下の**APIタイプ**（プロトコル）が検出できます：JSON-API、GraphQL、XML-RPC、JSON-RPC、OData、gRPC、WebSocket、SOAP、WebDav、HTML WEB。  

    HTML WEB―ブラウザを使用した人間のアクセスのために設計されたHTMLウェブページです。静的なHTMLウェブページである場合もあれば、アプリケーションの単一のHTMLページで、そのアプリケーションが別のAPIにアクセスする場合もあります。

* 検出されたホストの[セキュリティ体制](#security-posture)評価の自動化。
* API攻撃面全体のWAAPスコアの算出。
* セキュリティベンダー、データセンター、ロケーションごとの資産概要。  

    1つのホストが複数のIPアドレスを持つ場合、データセンターおよび地理的ロケーションごとの資産統計はホスト単位ではなくIPアドレス単位で評価されます。CDNの使用により、資産の位置が代表的でない場合があります。

* 検出されたホストのセキュリティ問題の自動検出。

これらはすべて、Wallarmへのサブスクリプションによって得られ、何もデプロイする必要はなく、即座に解析データを入手できます。

## ホストを検索するドメイン

ホストを検索する**ルートドメイン**のリストを以下の方法で定義可能です：

1. **API Attack Surface**または**Security Issues**セクションで、Configureをクリックします。
2. **Scope**タブで、ドメインを追加します。  

　Wallarmはホストとその[security issues](security-issues.md)の検索を開始し、検索の進捗と結果が**Status**タブに表示されます。

![AASM - スコープの設定](../images/api-attack-surface/aasm-scope.png)

ドメインは3日ごとに自動再スキャンされるため、新しいホストは自動的に追加され、以前リストにあったが再スキャンで発見されなかったホストはリストに残ります。

任意のドメインについて、**Configure**→**Status**から手動でスキャンの再開、一時停止、継続が可能です。

## 検出されたホストのデータ

ドメインに対してホストが検出された後、Wallarm Consoleで**API Attack Surface**セクションに移動します。リスト内のホストをクリックすると、以下が表示されます： 

* ホストで検出された開放ポート
* ホストで検出されたAPI
* ホストの[評価済み](#security-posture)WAAPスコアの詳細

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(60.65% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/dqmlj6dzflgq?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## セキュリティ体制

Wallarmは外部ネットワーク境界のセキュリティ体制を自動的に評価し、その状態を0（最低）から100（最高）の**合計スコア**として反映します。

![API攻撃面 - 保護スコア](../images/api-attack-surface/aasm-api-surface-protection-score.png)

合計スコアは、次の要素を組み込んだ複雑な独自の計算式を用いて算出されます：

* **WAAPカバレッジスコア**は、外部のWebおよびAPIサービスがWAF/WAAPソリューションによって保護されている割合を反映します。このスコアは、WAF/WAAPセキュリティで保護されたHTTP/HTTPSポートの割合として算出されます。
* **平均WAAPスコア**は、外部ホストのWebおよびAPI攻撃に対する耐性を表します。このスコアは、AASMがブロッキングモードで動作するアクティブなWAAPソリューションを識別し、エラーなくWAAPスコアが評価されたすべてのホストの平均値として算出されます。

　特定のエンドポイントのWAAPスコアはWallarmによるテストの結果であり、以下の式で算出されます：

```
((AppSec + FalsePositive) / 2 + APISec) / 2
```

* `AppSec` - SQLインジェクション、XSS、コマンドインジェクションなどのWeb攻撃に対する耐性。
* `APISec` - GraphQL、SOAP、gRPCプロトコルを標的とするAPI攻撃に対する耐性。
* `FalsePositive` - 正当なリクエストを誤って脅威と判定せずに正確に許可する能力。

各ホストについて、詳細なWAAPスコア評価レポート（PDF形式）をダウンロード可能です。

* **追加の指標**として、TLSカバレッジ、セキュリティ問題の有無、および検出されたセキュリティ問題が含まれます。