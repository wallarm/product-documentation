# クレデンシャルスタッフィング検出 <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[クレデンシャルスタッフィング](../attacks-vulns-list.md#credential-stuffing)は、ハッカーが侵害されたユーザー資格情報のリストを使用して、複数のウェブサイトのユーザーアカウントに不正アクセスを試みるサイバー攻撃です。この記事では、Wallarmの**クレデンシャルスタッフィング検出**を使用して、この種の脅威を検出する方法について説明します。

クレデンシャルスタッフィング攻撃は、異なるサービス間で同一のユーザー名やパスワードを再利用する一般的な慣行と、容易に推測可能な（弱い）パスワードを選ぶ傾向のために危険です。成功したクレデンシャルスタッフィング攻撃では、より少ない試行で済むため、攻撃者は頻繁にリクエストを送る必要がなくなり、ブルートフォース保護などの標準的な対策が効果を発揮しなくなります。

## Wallarmがクレデンシャルスタッフィングに対処する方法

Wallarmの**クレデンシャルスタッフィング検出**は、侵害されたまたは弱い資格情報を使用してアプリケーションにアクセスしようとする試みについてのリアルタイム情報を収集・表示します。また、このような試みについての即時通知と、アプリケーションにアクセスするためのすべての侵害または弱い資格情報のダウンロード可能なリストを提供します。

侵害されたおよび弱いパスワードを特定するために、Wallarmは[HIBP](https://haveibeenpwned.com/)の公開資格情報データベースから収集された850万以上のレコードの包括的なデータベースを使用します。

![クレデンシャルスタッフィング - スキーマ](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

Wallarmのクレデンシャルスタッフィング検出は、以下の一連のアクションを適用することで、資格情報データを安全に保持します：

1. リクエストがノードに到着すると、パスワードから[SHA-1](https://en.wikipedia.org/wiki/SHA-1)を生成し、数文字をクラウドに送信します。
1. クラウドは、受け取った文字で始まる既知の侵害パスワードのデータベースを確認します。見つかった場合、SHA-1暗号化形式でノードに送られ、ノードはそれをリクエストからのパスワードと比較します。
1. 一致する場合、ノードはこの攻撃情報とともにリクエストから取得したログインを含め、クレデンシャルスタッフィング攻撃をクラウドに報告します。
1. ノードはリクエストをアプリケーションに渡します。

このように、Wallarmノードを備えたマシンのパスワードは、Wallarmクラウドに暗号化されていない状態で送信されることはありません。認証データは同時に送信されず、クライアントの認証データがネットワーク内で安全に保持されていることを確保します。

**大量および個別の試行**

クレデンシャルスタッフィング検出は、ボットによる大量の侵害資格情報の使用試行と、他の方法では検出できない単一の試行の両方を登録することが可能です。

**緩和策**

盗まれたまたは弱いパスワードを持つアカウントを知ることで、アカウント所有者とのコミュニケーション、アカウントへのアクセスを一時的に停止するなど、これらのアカウントのデータを保護するための対策を開始できます。

Wallarmは、正当なユーザーもブロックすることを避けるため、侵害された資格情報を持つリクエストをブロックしません。ただし、以下の場合はクレデンシャルスタッフィング試行がブロックされることに注意してください：

* 検出された悪意のあるボット活動の一部であり、[API Abuse Prevention](../api-abuse-prevention/overview.md)モジュールを有効にした場合。
* 他の[攻撃の兆候](../attacks-vulns-list.md)の一部であるリクエストです。

## 有効化

Wallarmの**クレデンシャルスタッフィング検出**を有効にするには：

1. お使いの[サブスクリプションプラン](../about-wallarm/subscription-plans.md#subscription-plans)が**クレデンシャルスタッフィング検出**を含んでいることを確認してください。サブスクリプションプランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.)へのリクエストを送ってください。
1. Wallarmノードが[バージョン4.10](../updating-migrating/what-is-new.md)以上であり、以下のアーティファクトのいずれかを使用してデプロイされていることを確認してください：

    * [オールインワンインストーラー](../installation/nginx/all-in-one.md)
    * [NGINXベースのIngressコントローラー用Helmチャート](../admin-en/installation-kubernetes-en.md)
    * [NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)
    * [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md)
1. ユーザーの[役割](../user-guides/settings/users.md#user-roles)が**クレデンシャルスタッフィング検出**の設定を許可していることを確認してください。
1. Wallarmコンソール → **クレデンシャルスタッフィング**で、機能性を有効にします（デフォルトでは無効）。

**クレデンシャルスタッフィング検出**が有効になると、動作を開始するために[設定](#configuring)が必要です。

## 設定

侵害された資格情報の使用試みをチェックする認証エンドポイントのリストを作成する必要があります。リストを作成するには、Wallarmコンソール → **クレデンシャルスタッフィング**に移動します。

![Wallarmコンソール - クレデンシャルスタッフィング](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

エンドポイントをリストに追加する方法は2つあります：

* **推奨されるエンドポイント**のリストから、2種類のエレメントが含まれます：

    * パスワードとログインを格納するパラメーターを指定するために正規表現を利用するWallarmの事前定義ルール。
    <!--
        ![クレデンシャルスタッフィング - 推奨されるエンドポイント - 事前定義ルール](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)
    -->
    * [API Discovery](../api-discovery/overview.md)モジュールによって見つかった認証に使用されるエンドポイントで、実際にトラフィックを受信したと記録されています。

* 手動 - 独自の認証エンドポイントも含めることができ、完全な保護が確保されます。手動で追加する場合、[URI](../user-guides/rules/rules.md#uri-constructor)とパスワードおよびログインの認証パラメーターを検索する方法を設定します。

    * **パラメーターの正確な位置** - パスワードとログインの場所を正確に指定する必要があります。
    <!--
        ![クレデンシャルスタッフィング - 認証エンドポイントの追加 - 正確な位置](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)
    -->
    * **正規表現** - [正規表現](../user-guides/rules/rules.md#condition-type-regex)を使用して、パスワードおよびログインのエンドポイントパラメーターを検索します。
    
        ![クレデンシャルスタッフィング - 認証エンドポイントの追加 - 正規表現](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## 侵害された資格情報の使用試みの表示

過去7日間に侵害された資格情報を使用した試みの回数が**クレデンシャルスタッフィング**セクションに表示されます。カウンターをクリックすると、過去7日間のすべての[`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type)攻撃を表示する**攻撃**セクションにリダイレクトされます。

攻撃のいずれかを展開して、パスワードが侵害されたログインのリストを表示します。

![攻撃 - クレデンシャルスタッフィング](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## 侵害された資格情報のCSVリストの取得

侵害された資格情報の総数が**クレデンシャルスタッフィング**セクションに表示されます。カウンターをクリックすると、侵害された資格情報のリストが含まれたCSVファイルがブラウザによってダウンロードされます。

## 通知の取得

侵害された資格情報を使用した試みについて、メール、メッセンジャー、または[統合システム](../user-guides/settings/integrations/integrations-intro.md)のいずれかに即時通知を受け取ることができます。このような通知を有効にするには、Wallarmコンソールの**トリガー**セクションで、**Compromised user account**条件を持つ1つ以上のトリガーを設定します。

監視したいアプリケーションやホスト、およびレスポンスタイプによって通知を絞り込むことができます。

**トリガーの例：Slackで侵害された資格情報を使用した試みの通知**

この例では、侵害された資格情報を使用した新しい試みが検出された場合、設定したSlackチャンネルに通知が送信されます。

![クレデンシャルスタッフィングトリガー](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**トリガーのテスト：**

1. Wallarmコンソール → **Integrations**に移動し、[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドで、[Slackとの統合](../user-guides/settings/integrations/slack.md)を設定します。
1. **クレデンシャルスタッフィング**セクションで、クレデンシャルスタッフィングが有効になっていること、および次のWallarmの事前定義ルールが**推奨されるエンドポイント**からアクティブな**認証エンドポイント**に追加されていることを確認します：

    リクエストは：

    ```
    /**/{{login|auth}}.*
    ```

    パスワードはこちらに位置しています：

    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    ログインはこちらに位置しています：

    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

1. トリガーの作成し上記のような図に示されているように、それを自分のSlack統合にマップします。
1. 侵害された資格情報が含まれるリクエストをノードの`localhost/login`エンドポイントに送信します：

    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```

1. **攻撃**セクションで、リクエストが`credential_stuffing`タイプのイベントとして登録されていることを確認します：侵害された資格情報を使用した試み。
1. 攻撃を