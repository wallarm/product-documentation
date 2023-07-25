[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.ja.md

# Active Threat検証機能の設定に対する最良の手法 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmが[脆弱性を検出](../about-wallarm/detecting-vulnerabilities.ja.md) する一つの方法は、**Active Threat Verification**という機能を使用して攻撃者をペネトレーションテスターに変え、アプリ/APIの脆弱性を探る彼らの活動から考えられるセキュリティ問題を特定することです。この機能は、トラフィックからの実際の攻撃データを使用して、アプリケーションのエンドポイントを探ることにより、可能性のある脆弱性を見つけます。この機能を安全に使用するため、本記事でその設定の最良の手法を学んでください。

デフォルトでは、**Active Threat Verification**は無効になっています。この機能を有効にするには、[攻撃リチェッカーの制御方法](#攻撃リチェッカーの制御方法)を知る必要があります。

!!! warning "Active Threat検証はIPでグループ化されたヒットがある場合"
    攻撃が起源のIPで[グループ化](../about-wallarm/protecting-against-attacks.ja.md#attack)された場合、この攻撃のActiveな検証は使用できません。

## Active Threat検証機能の作用方法

--8<-- "../include/how-attack-rechecker-works.ja.md"

## 攻撃リチェッカーの活動から見た潜在的なリスク

* 貴重なケースでは、壁略が正規のリクエストを攻撃として検出した場合、そのリクエストは**攻撃リチェッカー**によって再生されます。リクエストが冪等でない場合（例えば、アプリケーション内で新しいオブジェクトを作成する認証済みリクエスト）、**攻撃リチェッカー**のリクエストによって、ユーザーアカウントに多数の新規の不要なオブジェクトが作成されたり、予期せぬ操作が実行される可能性があります。

    このような事態のリスクを最小限に抑えるため、**攻撃リチェッカー**は再生されたリクエストから以下のHTTPヘッダーを自動的に取り除きます：

    * `Cookie`
    * `Authorization: Basic`
    * `Viewstate`
* アプリケーションが一般的でない認証方式を使用したり、リクエストを認証する必要がない場合、**攻撃リチェッカー**はトラフィックから発行される任意のリクエストを再生してシステムに害を与える可能性があります。例えば: 100回以上の重複した金額の取引や注文を繰り返すことがあります。このような事態のリスクを最小限に抑えるため、[攻撃再生用にテスト環境やステージング環境を使用する](#optional-configure-attack-rechecker-request-rewriting-rules-run-tests-against-a-copy-of-the-application)ことと、[一般的でないリクエスト認証パラメーターのマスクを行う](#正しいデータマスキングルールを設定)ことが推奨されます。

## 攻撃リチェッカーの設定のためのベストプラクティス

### 正しいデータマスキングルールを設定

アプリケーションが一般的でない種類の認証（例えば、リクエスト文字列トークンやカスタムHTTPリクエストヘッダ、POSTボディに含まれるJSON属性）を使用している場合は、情報をWallarm クラウドに送信するフィルタリングノードを防ぐために、適切な[data masking rule](../user-guides/rules/sensitive-data-rule.ja.md)を設定するべきです。その場合、再生された**攻撃リチェッカー**のリクエストは、アプリケーションによって認証されず、システムに迷惑をかけることなくなります。

### 攻撃リチェッカーの制御方法

**攻撃リチェッカー**モジュールのグローバルなオン/オフスイッチは、Wallarmコンソール → [**脆弱性**](../user-guides/vulnerabilities.ja.md) に位置しています。デフォルトでは、このモジュールは無効になっています。

### 検出したセキュリティインシデントに対する適切な通知とエスカレーションのルールを設定

WallarmはSlackやTelegram、PagerDuty、Opsgenieなどの[サードパーティのメッセージングおよびインシデント管理サービスとの統合](../user-guides/settings/integrations/integrations-intro.ja.md)を提供しています。Wallarmクラウドインスタンスを設定して、発見されたセキュリティインシデントに対する通知を情報セキュリティチームに送信するよう統合を使用することを強く推奨します。

### フィルタリングノードからWallarmクラウドまでの機密データ漏洩の対処方法

フィルタリングノードが誤ったポジティブなリクエストを見つけて、認証トークンやユーザー名/パスワードの資格情報等の機密情報を含むリクエストをWallarm クラウドに送信してしまった事を発見した場合、あなたは[Wallarmの技術サポート](mailto:support@wallarm.com)に依頼して、Wallarmクラウドストレージからそのリクエストを削除することができます。また、適切な[data masking rules](../user-guides/rules/sensitive-data-rule.ja.md)を設定することもできます。すでに格納されたデータを修正することはできません。

### オプション: 特定のアプリケーション、ドメイン、URLで攻撃リチェッカーテストを有効/無効に設定

特定のアプリケーションエンドポイントが冪等ではなく、いかなるリクエスト認証メカニズムも使用しない場合（例えば、新顾客アカウントの自己登録）、特定のエンドポイントに対する**攻撃リチェッカー**機能を無効化することが推奨されます。Wallarmは、顧客がどの顧客アプリケーション、ドメイン、URLに**攻撃リチェッカー**スキャナーを有効または無効にするか制御する機能を提供しています。これは、[**Active Threat検証のモードを設定する**というルール](../user-guides/rules/change-request-for-active-verification.ja.md#rewriting-the-request-before-attack-replaying)を使用します。

### オプション: 攻撃リチェッカーのリクエスト書き換えルールを設定（アプリケーションのコピーに対してテストを実行）

製品アプリケーションへのスキャンを完全に避けて、アプリケーションのコピーに対してチェックを実行したい場合は、再生される攻撃リクエストの特定の要素を変更するように**攻撃リチェッカー**に指示する[ルール](../user-guides/rules/change-request-for-active-verification.ja.md)を作成することが可能です。