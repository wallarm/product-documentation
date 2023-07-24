[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.md

# アクティブな脅威検証機能の設定におけるベストプラクティス <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmが[脆弱性を検出する](../about-wallarm/detecting-vulnerabilities.md)ために使用する方法の一つは、**アクティブな脅威検証**で、攻撃者をペネトレーションテスターに変え、アプリ/APIの脆弱性を探る彼らの活動から可能なセキュリティ問題を発見することができます。このモジュールは、トラフィックからの実際の攻撃データを使用してアプリケーションのエンドポイントを探ることで、可能な脆弱性を見つけます。モジュールを安全に操作するために、この記事から設定のベストプラクティスを学んでください。

デフォルトでは、**アクティブな脅威検証**は無効になっています。モジュールを有効にするには、[Attack rechecker を制御する方法](#know-how-to-control-the-attack-rechecker)を知っておく必要があります。

!!! warning "攻撃がIPでグループ化されている場合のアクティブな脅威検証"
    アタックが発信元IPによって [グループ化](../about-wallarm/protecting-against-attacks.md#attack)されている場合、この攻撃のアクティブな検証は利用できません。

## アクティブな脅威検証機能の仕組み

--8<-- "../include-ja/how-attack-rechecker-works.md"

## Attack recheckerの活動による潜在的なリスク

* Wallarmが正当なリクエストを攻撃として検出した場合、そのリクエストは **Attack rechecker** によって再実行されます。リクエストが冪等ではない場合（例えば、アプリケーションで新しいオブジェクトを作成する認証済みリクエストなど）、**Attack rechecker** のリクエストは、ユーザーアカウント内で多数の新しい望ましくないオブジェクトを作成したり、他の予期しない操作を実行したりする可能性があります。

    このような状況のリスクを最小限に抑えるために、**Attack rechecker** は再実行されるリクエストから以下のHTTPヘッダーを自動的に削除します。
  
    * `Cookie`
    * `Authorization: Basic`
    * `Viewstate`
* アプリケーションが非標準の認証方法を使用する場合やリクエストの認証が必要でない場合、**Attack rechecker** はトラフィックからの任意のリクエストを再実行してシステムに悪影響を及ぼす可能性があります。例：100以上のお金の取引や注文を繰り返す。このような状況のリスクを最小限に抑えるために、[攻撃再生用のテスト環境やステージング環境を使用する](#optional-configure-attack-rechecker-request-rewriting-rules-run-tests-against-a-copy-of-the-application)ことや、[非標準のリクエスト認証パラメーターをマスクする](#configure-proper-data-masking-rules)ことが推奨されます。

## Attack rechecker の設定におけるベストプラクティス

### 適切なデータマスキングルールを設定する

あなたのアプリケーションが非標準の認証タイプ（例えば、リクエスト文字列トークンやカスタムHTTPリクエストヘッダー、POST本文のJSON属性など）を使用している場合、適切な[データマスキングルール](../user-guides/rules/sensitive-data-rule.md)を設定して、フィルタリングノードが情報をWallarm Cloudに送信するのを防ぐ必要があります。この場合、再実行された **Attack rechecker** のリクエストは、アプリケーションによって承認されず、システムに悪影響を与えることはありません。

### Attack recheckerを制御する方法を知っておく

**Attack rechecker** モジュールのグローバルなオン/オフスイッチは、Wallarm Console → [**Scanner** セクション](../user-guides/scanner/configure-scanner-modules.md)にあります。デフォルトでは、このモジュールは無効になっています。

### 検出されたセキュリティインシデントに対して適切な通知及びエスカレーションルールを設定する

Wallarmは、Slack、Telegram、PagerDuty、Opsgenieなどの[サードパーティ製のメッセージングやインシデント管理サービスとの統合](../user-guides/settings/integrations/integrations-intro.md)を提供しています。情報セキュリティチームに発見されたセキュリティインシデントに関する通知を送信するために、Wallarm Cloudインスタンスを統合を使用するように設定することを強くお勧めします。

### フィルタリングノードからWallarm Cloudへの潜在的な機密データ漏れを処理する方法を知っておく

フィルタリングノードが、認証トークンやユーザー名/パスワード資格情報などの機密データを含む偽陽性リクエストをWallarm Cloudに送信してしまったことがわかった場合、[Wallarm技術サポート](mailto:support@wallarm.com)に連絡して、Wallarm Cloudのストレージからリクエストを削除するよう依頼することができます。また、適切な[データマスキングルール](../user-guides/rules/sensitive-data-rule.md)を設定することができます。既に保存されているデータを変更することはできません。

### オプション：特定のアプリケーション、ドメイン、URLに対してAttack recheckerのテストを有効/無効にする

アプリケーションのエンドポイントが冪等でなく、リクエストの認証メカニズムを使用していない場合（例えば、新規顧客アカウントの自動登録など）、特定のエンドポイントに対して**Attack rechecker** 機能を無効にすることが推奨されます。Wallarmは、**Attack rechecker** スキャナを特定の顧客アプリケーション、ドメイン、またはURLで有効または無効にすることができるかどうかを制御する機能を提供しています。[**アクティブな脅威検証のモードを設定** というルール](../user-guides/rules/change-request-for-active-verification.md#rewriting-the-request-before-attack-replaying)を使用して行います。

### オプション：Attack recheckerリクエストの書き換えルールを設定する（アプリケーションのコピーに対してテストを実行する）

アプリケーションのコピーに対してチェックを実行し、本番アプリケーションのスキャンを完全に回避したい場合、再実行される攻撃リクエストの特定の要素を変更するように指示する[ルール](../user-guides/rules/change-request-for-active-verification.md)を作成することができます。