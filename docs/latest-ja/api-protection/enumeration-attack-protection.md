# 列挙攻撃の保護 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmは、攻撃者にとって高い価値を持つ情報の漏えいを防ぐため、APIを[列挙攻撃](../attacks-vulns-list.md#enumeration-attacks)から保護します。攻撃者は有効なユーザー名やメールアドレス、システムリソースを特定することで、後続攻撃の焦点を大幅に絞り込めます。この偵察フェーズにより、攻撃者は対象システムの理解を深め、脆弱性を発見し、より巧妙で標的化された攻撃を計画できる可能性が高まり、最終的に侵害成功の確率が上がってしまいます。

[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1または[Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1以上が必要です。

## 緩和コントロール

Wallarmは、列挙からの保護を構成するための複数の[緩和コントロール](../about-wallarm/mitigation-controls-overview.md)を提供します。どのコントロールを使用するか選択する際は、次を考慮してください。

<table>
  <tr>
    <th>コントロール</th>
    <th>特記事項</th>
    <th>列挙対象</th>
    <th>攻撃</th>
  </tr>
  <tr>
    <td><b>Brute force protection</b></td>
    <td rowspan="3">指定した時間枠内に各パラメータで観測されたユニーク値の数をカウントします。</td>
    <td><code>password</code></td>
    <td><code>Brute force</code></td>
  </tr>
  <tr>
    <td><b>BOLA protection</b></td>
    <td><code>object ID</code>, <code>user ID</code></td>
    <td><code>BOLA</code></td>
  </tr>
  <tr>
    <td><b>Enumeration attack protection</b></td>
    <td>任意のパラメータ</td>
    <td><code>Enum</code></td>
  </tr>
  <tr>
    <td><b>Forced browsing protection</b></td>
    <td>設定した時間枠内にアクセスされたユニークなエンドポイント数をカウントします。</td>
    <td><code>URL</code>s</td>
    <td><code>Forced browsing</code></td>
  </tr>
</table>

したがって:

* 非公開URLの列挙を防ぎたい場合は、**Forced browsing protection**コントロールを使用します。
* 任意のパラメータの列挙を防ぎたい場合は、**Enumeration attack protection**コントロールを使用できます（オールインワンの解決策です）。
* さまざまな候補を試して有効なパスワードを得ようとする試行を強調表示したい場合は、**Brute force protection**コントロールを使用します。
* 有効なユーザーIDやオブジェクトIDの列挙を特に強調表示したい場合は、**BOLA protection**コントロールを使用します。

!!! info "従来の機能"
    緩和コントロールは、[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションで利用できる高度なツールです。[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションでは、[brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)、[forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)、および[BOLA protection](../admin-en/configuration-guides/protecting-against-bola-trigger.md)はトリガーで構成します。

## デフォルト保護

Wallarmは、列挙保護のための[デフォルト](../about-wallarm/mitigation-controls-overview.md#default-controls)の緩和コントロールを提供します。デフォルトコントロールは複製・編集、または無効化できます。

<!--You can **reset default control to its default configuration** at any time.-->

--8<-- "../include/mc-subject-to-change.md"

### Brute force

**Brute force protection**の[デフォルト](#default-protection)緩和コントロールは、パスワード、OTP、認証コードの列挙の試行を検知するための汎用的な構成を提供し、すべてのトラフィックに対して`Monitoring`[mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode)で有効化されています。

Brute forceのデフォルトコントロールを確認するには、Wallarm Console → **Security Controls** → **Mitigation Controls**の**Brute force protection**セクションで、`Default`ラベルの付いたコントロールを確認します。

編集により、アプリケーションの特性、トラフィックパターン、ビジネス状況に合わせてデフォルトコントロールをカスタマイズできます。たとえば、しきい値を調整できます。

### BOLA

**BOLA protection**の[デフォルト](#default-protection)緩和コントロールは、ユーザーID、オブジェクトID、ファイル名の列挙の試行を検知するための汎用的な構成を提供し、すべてのトラフィックに対して`Monitoring`[mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode)で有効化されています。

BOLAのデフォルトコントロールを確認するには、Wallarm Console → **Security Controls** → **Mitigation Controls**の**BOLA protection**セクションで、`Default`ラベルの付いたコントロールを確認します。

編集により、アプリケーションの特性、トラフィックパターン、ビジネス状況に合わせてデフォルトコントロールをカスタマイズできます。たとえば、しきい値や列挙対象として追跡するパラメータを調整できます。

### 汎用の列挙

**Enumeration attack protection**の[デフォルト](#default-protection)緩和コントロールは、次の列挙の試行を検知するための汎用的な構成を提供します。

* ユーザー/メールアドレスの列挙
* SSRF（Server-Side Request Forgery）の列挙
* User-Agentのローテーション

これは、すべてのトラフィックに対して`Monitoring`[mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode)で有効化されています。

汎用の列挙に関するデフォルトコントロールを確認するには、Wallarm Console → **Security Controls** → **Mitigation Controls**の**Enumeration attack protection**セクションで、`Default`ラベルの付いたコントロールを確認します。

編集により、アプリケーションの特性、トラフィックパターン、ビジネス状況に合わせてデフォルトコントロールをカスタマイズできます。たとえば、しきい値や列挙対象として追跡するパラメータを調整できます。

### Forced browsing

**Forced browsing protection**の[デフォルト](#default-protection)緩和コントロールは、非公開URLの列挙の試行を検知するための汎用的な構成を提供し、すべてのトラフィックに対して`Monitoring`[mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode)で有効化されています。

Forced browsingのデフォルトコントロールを確認するには、Wallarm Console → **Security Controls** → **Mitigation Controls**の**Forced browsing protection**セクションで、`Default`ラベルの付いたコントロールを確認します。

編集により、アプリケーションの特性、トラフィックパターン、ビジネス状況に合わせてデフォルトコントロールをカスタマイズできます。たとえば、しきい値や**Scope**を調整できます。

## 構成

次の手順で列挙からの保護を構成します。

* コントロールを適用する**Scope**（エンドポイント、特定のリクエストのみ）を定義します。
* 列挙の試行を追跡する対象として**Enumerated parameters**を選択します。
* **Enumeration threshold**を設定します（しきい値を超えるとコントロールが動作します）。
* Scopeでニーズをすべて満たせない場合は、**Scope filters**を設定します。
* **Mitigation mode**でアクションを設定します。

スコープや詳細条件の設定、列挙対象パラメータの選択には、[正規表現](#regular-expressions)を使用できます。

### Scope

**Scope**は、どのリクエストにコントロールを適用するか（URIやその他のパラメータに基づく）を定義します。ルールにおけるリクエスト条件と同じ要領で構成します。詳細は[こちら](../user-guides/rules/rules.md#configuring)をご覧ください。

**Scope**セクションを空のままにすると、緩和コントロールは**すべてのトラフィック**および**すべてのアプリケーション**に適用され、そのようなコントロールはすべての[branches](../about-wallarm/mitigation-controls-overview.md#mitigation-control-branches)に継承されます。

### Scope filters 

[Scope](#scope)だけでは要件を満たせない場合、保護メカニズムの対象となるリクエストが満たすべき追加条件を定義できます。

条件として、次の値や値パターンを使用できます。

* リクエストの組み込みパラメータ（Wallarmフィルタリングノードが処理する各リクエストに含まれるメタ情報の要素）
* **Session context parameters**（**API Sessions**で[重要として定義](../api-sessions/setup.md#session-context)されたパラメータを一覧からすばやく選択）— このセクションの**Add custom**オプションを使用して、現在**API Sessions**に存在しないパラメータをフィルターとして追加できます。その場合、これらのパラメータは**API Sessions**のコンテキストパラメータにも追加されます（非表示。つまり、リクエストに含まれていればセッション詳細で確認できますが、API Sessionの[context parameter configuration](../api-sessions/setup.md#session-context)には表示されません）。

!!! info "パフォーマンスに関する注意"
    **Scope**の設定はパフォーマンス面で負荷が小さいため、目的を満たせる場合はScopeを優先して使用し、複雑な条件付けが必要な場合のみ**Scope filters**を使用することを推奨します。

### Enumerated parameters

**Enumerated parameters**セクションでは、列挙を監視するパラメータを選択します。正確一致または[regex](#regular-expressions)による一致のいずれかで監視対象のパラメータ群を選択します（1つの緩和コントロール内ではどちらか一方のみ使用できます）。

正確一致の場合、**Add custom**オプションを使用して、現在**API Sessions**に[存在しない](../api-sessions/setup.md#session-context)パラメータを列挙対象として追加できます。その場合、これらのパラメータは**API Sessions**のコンテキストパラメータにも追加されます（非表示。つまり、リクエストに含まれていればセッション詳細で確認できますが、API Sessionの[context parameter configuration](../api-sessions/setup.md#session-context)には表示されません）。

regexで**Filter by parameter name**と**Filter by parameter value**の両方を指定した場合、それらは組み合わされます（`AND`演算子）。例えば、nameに`(?i)id`、valueに`\d*`を指定すると`userId`パラメータに一致しますが、パラメータ値が数字の組み合わせであるリクエストのみをカウントします。

リクエストが[Scope](#scope)と[Scope filters](#scope-filters)を満たし、かつ列挙監視対象パラメータに対してユニーク値を**含む**場合、そのパラメータのカウンタは`+1`されます。

### Enumeration threshold

**Brute force, BOLAおよび汎用の列挙保護**

これらの保護は、指定した時間枠（秒）内に各[列挙パラメータ](#enumerated-parameters)で観測されたユニーク値の数をカウントします。**Enumerated parameters**に列挙された各パラメータは独立して追跡されます。

いずれかのパラメータでしきい値に達すると、Wallarmは[Mitigation mode](#mitigation-mode)に従ってアクションを実行します。

**Forced browsing protection**

この保護は、設定した時間枠（秒）内にアクセスされたユニークなエンドポイント数をカウントします。しきい値に達すると、Wallarmは[Mitigation mode](#mitigation-mode)に従ってアクションを実行します。

### Mitigation mode

いずれかのカウンタがしきい値を超えた場合、選択したアクションが実行されます。

* **Monitoring** — 攻撃として記録され、この攻撃に属するリクエストは[API Sessions](../api-sessions/overview.md)で`Brute force`、`Forced browsing`、`BOLA`、または汎用の`Enum`攻撃に属するとマークされますが、リクエストはブロックされません。
* **Blocking** → **Block IP address** — 攻撃として記録され、この攻撃に属するリクエストはAPI Sessionsで該当攻撃に属するとマークされます。これらのリクエストの送信元IPは、選択した期間、[denylist](../user-guides/ip-lists/overview.md)に追加されます。

### 正規表現

**Scope**セクションでは[PIRE](../user-guides/rules/rules.md#condition-type-regex)正規表現ライブラリを使用し、詳細条件では[PCRE](https://www.pcre.org/)を使用します。正規表現を使用する際は、次の演算子を使用します。

| Operator | 説明 |
| --- | --- |
| ~ (Aa)  | 大文字小文字を区別しない正規表現で一致を検索します。 |
| !~ (Aa) | 大文字小文字を区別しない正規表現で一致を除外します。 |
| ~       | 大文字小文字を区別する正規表現で一致を検索します。 |
| !~      | 大文字小文字を区別する正規表現で一致を除外します。 |

## 例

例えば、eコマースの`E-APPC`アプリケーションでは、各ユーザーの注文情報を`/users/*/orders`に保存しているとします。攻撃者は数字のさまざまな組み合わせを試すスクリプトで、注文IDの一覧を取得できる可能性があります。これを防ぐには、各ユーザーアカウント配下に注文を保存するルートに対して、`in minute`に`more than 2 unique values`というカウンタを設定します。これを超えた場合、その活動をオブジェクト（ユーザーの注文）のIDを列挙しようとする試み（BOLA攻撃）としてマークし、送信元IPを1時間ブロックします。

そのためには、次のスクリーンショットのように**BOLA protection**の緩和コントロールを構成します。

![BOLA保護の緩和コントロール - 例](../images/user-guides/mitigation-controls/mc-bola-example-01.png)

この例では、パラメータ値のregex`\d*`は「0個以上の数字」を表し、数字で構成されたオブジェクトIDの列挙を試みていることを示します。

<!-- ## Testing

To test the mitigation control described in the [Example](#example) section, TBD. -->

## 検出された攻撃の表示

列挙攻撃が[Mitigation mode](#mitigation-mode)に従って検出またはブロックされると、[API Sessions](../api-sessions/exploring.md)セクションに表示されます。

![API Sessionsにおける列挙攻撃（Brute force）](../images/user-guides/mitigation-controls/mc-found-attack-in-api-sessions.png)

該当する攻撃タイプのセッションは**Attack**フィルターで検索できます。必要に応じて、セッション詳細内でもフィルタリングして、列挙攻撃に関連するリクエストのみを表示できます。