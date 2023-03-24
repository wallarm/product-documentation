[link-work-with-scope]:     check-scope.md
[link-configure-scanner]:   configure-scanner.md
[link-rfc]:                 https://tools.ietf.org/html/rfc5936
[link-scanner]:             https://my.wallarm.com/scanner
[link-api]:                 https://console.eu1.wallarm.com

[anchor1]:  #network-scope-scanning
[anchor2]:  #searching-for-typical-vulnerabilities-and-security-issues
[anchor3]:  #active-threat-verification
[anchor4]:  #updating-the-status-of-previously-detected-vulnerabilities

# スキャナー概要 <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

スキャナーは以下のタスクを実行します:
* [ネットワークスコープのスキャン][anchor1]
* [典型的な脆弱性とセキュリティ問題の検索][anchor2]
* [アクティブな脅威の検証][anchor3]
* [以前に検出された脆弱性のステータスの更新][anchor4]


## ネットワークスコープのスキャンング

**ネットワークスコープ**とは、企業の公開リソース（ドメインおよびIPアドレス）が公開ネットワークに接続されているものです。これは、典型的な脆弱性をスキャンする範囲を定義し、セキュリティプロセスの基礎となります。

プロジェクトが進むと、スコープ内のリソースの数が着実に増え、それらをコントロールすることが不可避的に減少します。

リソースは、企業のデータセンターだけでなく共有ホスティングにも配置されることがあります。例えば、マーケティング担当者が新しいランディングページを作成し、新しいキャンペーンを開始する場合です。これらのリソースは、メインプロジェクトのサブドメインに配置され、プロジェクトのセキュリティが危険にさらされる可能性があります。

ハッカーは常に企業のスコープ内で最も保護されていないリソースを選び、これらのリソースを最初に攻撃しようとします。

Wallarmは、企業のセキュリティ評価や侵入テストを行う際に、白帽子のハッカーが使用するすべてのスコープ発見メカニズムを統合しています。

スコープの発見は、ドメインとIPアドレスのマッピングで終わらず、インターネットからアクセスできるネットワークリソースも発見します。これには、Wallarmがまずポートをスキャンし、次にこれらのポート上のネットワークリソースを検出します。

スコープデータの収集と更新の継続的なプロセスにはさまざまな方法が使用されます。

* 自動モード
    * DNSゾーン転送（[AXFR][link-rfc]）
    * NSおよびMXレコードの受信
    * SPFレコードデータの受信
    * サブドメイン辞書検索
    * SSL証明書の解析

* [ウェブインターフェース][link-scanner]またはWallarm [API][link-api]を介した手動データ入力。

これにより、ペネトレーションテストを行う白帽子のハッカーと同じ品質の企業リソースのマップが作成されます。

## 典型的な脆弱性とセキュリティ問題の検索

ネットワークスコープを収集した後、スキャナーはそれに含まれるすべてのIPアドレスとドメインを典型的な脆弱性に対してチェックします。

## アクティブな脅威の検証

スキャナーは、トラフィックからの[各攻撃を再現](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)します。このメカニズムにより、攻撃中に悪用された可能性のある脆弱性が検出されます。

安全上の理由から、リクエストからの攻撃を再現する場合、認証データ（クッキー、基本認証、ViewState）が削除されます。この機能の正確な動作には、アプリケーション側で追加の設定が必要になる場合があります。

## 以前に検出された脆弱性のステータスの更新

スキャナーは定期的に脆弱性のステータスをチェックし、それらを修正済みに設定するか、逆に再現されたものを再オープンします。

現在の脆弱性と1ヶ月以内に修正された脆弱性は、1日に1回チェックされます。

1ヶ月以上前に修正された脆弱性は、1週間に1回チェックされます。

偽のとしてマークされた脆弱性はチェックされません。

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/CiF2oLmxBac" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->