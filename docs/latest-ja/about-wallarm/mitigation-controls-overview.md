[link-cloud-node-synchronization]: ../admin-en/configure-cloud-node-synchronization-en.md
[img-rules-create-backup]:      ../images/user-guides/rules/rules-create-backup.png

# Mitigation Controls <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Mitigation controlsはWallarmの[攻撃保護](protecting-against-attacks.md#tools-for-attack-detection)を追加のセキュリティ対策で拡張し、Wallarmの動作をきめ細かく調整できるようにします。

## Mitigation controlsでできること

Mitigation controlsを使用すると、次の機能を有効化および設定できます。

* [Real-time blocking mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
* [GraphQL API protection](../api-protection/graphql-rule.md)
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../api-protection/enumeration-attack-protection.md)
* [DoS protection](../api-protection/dos-protection.md)
* [File upload restriction policy](../api-protection/file-upload-restriction.md)

## Mitigation control branches

Mitigation controlsは、エンドポイントURIやその他の条件に基づいて自動的に入れ子のブランチにグループ化されます。これにより、Mitigation controlの効果が下位に継承されるツリー状の構造が形成されます。原則は次のとおりです。

* すべてのブランチは[all traffic](#scope)のMitigation controlsを継承します。
* 各ブランチでは、子エンドポイントは親からMitigation controlの効果を継承します。
* 個別指定が継承より優先されます。
* 直接指定が正規表現より優先されます。
* 大文字小文字を区別する指定が区別しない指定より優先されます。

## Enabling

Mitigation controlsを使用するには以下が必要です。

* [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションプラン
* （大半のコントロール）[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1または[Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1

これらの条件を満たしていてもWallarm Consoleに**Security controls** → **Mitigation Controls**セクションが表示されない場合は、有効化のため[Wallarmサポートチーム](https://support.wallarm.com/)にお問い合わせください。

## Configuration

設定はWallarm Consoleの**Security controls** → **Mitigation Controls**セクションで行います。また、API Sessionsなど、システム内の別の場所から一部のMitigation control設定にアクセスすることもできます。

![UIのMitigation Controlsページ](../images/user-guides/mitigation-controls/mc-main-page.png)

設定前に[ブランチ](#mitigation-control-branches)の考え方に慣れ、既存の設定を確認してください。

一般に、任意のMitigation controlの設定は以下の手順で構成されます。

1. 必要に応じて、カスタムの**Title**を設定します。
1. 条件を設定します（すべて満たされた場合に→アクション）。
1. アクション（Mitigation mode）を設定します。

### Scope

**Scope**は、そのコントロールを適用するリクエスト（URIやその他のパラメータに基づく）を定義します。ルールのリクエスト条件と同様の方法で設定します。詳細は[こちら](../user-guides/rules/rules.md#configuring)をご覧ください。

**Scope**セクションを空のままにすると、Mitigation controlは**all traffic**および**all applications**に適用され、このようなコントロールはすべての[ブランチ](#mitigation-control-branches)に継承されます。

### Advanced conditions

[Scope](#scope)に加えて、Mitigation controlには、アクションを実行するかどうかを決定する他の条件を含めることがあります。例：

* [GraphQL API protection](../api-protection/graphql-rule.md)の場合はpolicy positionsで、リクエストがいずれかに違反した場合にのみコントロールが動作します。
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)の場合は、リクエストの複数のパラメータで構成され、指定したすべてのパラメータ/値が満たされた場合にのみコントロールが動作します。

[Enumeration attack protection](../api-protection/enumeration-attack-protection.md)や[DoS protection](../api-protection/dos-protection.md)のような一部のコントロールでは、**Scope filters**セクションで**session context parameters**を使用し、**API Sessions**で[重要として定義](../api-sessions/setup.md#session-context)されたパラメータのリストから素早く選択できます。このセクションの**Add custom**オプションを使用すると、現在**API Sessions**に存在しないパラメータをフィルタとして追加できます。その場合、これらのパラメータは**API Sessions**のcontext parametersにも追加されます（hidden。つまり、リクエストに含まれていればsession detailsでこれらのパラメータは表示されますが、API Sessionの[context parameter configuration](../api-sessions/setup.md#session-context)には表示されません）。

詳細条件を指定するために、[regular expressions](#regular-expressions)を使用できます。

### Mitigation mode

すべての条件が満たされると、Mitigation controlはアクションを実行します。必要なアクションは**Mitigation mode**セクションで選択します。

| Mitigation mode | 説明 |
| --- | --- |
| **Inherited** | モードは[all-traffic **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode)およびWallarmノードの[構成](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive)から継承されます。 |
| **Monitoring** | 検出された攻撃を記録するだけで、ブロックは行いません。記録された攻撃は**API Sessions**の該当する[session details](../api-sessions/exploring.md#specific-activities-within-session)に表示されます。<br>一部のコントロールでは、このモード中に送信元IPを[Graylist](../user-guides/ip-lists/overview.md)に追加する追加オプションを選択できます。 |
| **Blocking** | 攻撃を記録してブロックします。[ブロック方法](../about-wallarm/protecting-against-attacks.md#attack-handling-process)はコントロールの種類によって異なり、real-time blocking、[IP-based blocking](../user-guides/ip-lists/overview.md)、またはsession-based blocking<sup>*</sup>になります。 |
| **Excluding** | [指定したscope](#mitigation-control-branches)に対するこのタイプのMitigation controlを停止します。詳細は[Excluding mode vs. disabling](#excluding-mode-vs-disabling)をご覧ください。 |
| **Safe blocking** | 攻撃を記録しますが、送信元IPが[Graylist](../user-guides/ip-lists/overview.md)にある場合にのみブロックします。 |

<small><sup>*</sup> 現時点ではsession-based blockingは未対応です。</small>

利用可能なモードの一覧はコントロールによって異なる場合があります。

### Excluding mode vs. disabling

**On/Off**スイッチャーを使用してMitigation controlを一時的に無効化し、必要に応じて再度有効化できます。以下の例で、無効化したMitigation controlと、Excludingモードで有効化したMitigation controlの違いをご確認ください。

* コントロールは[ブランチで動作](#mitigation-control-branches)することを考慮してください。
* たとえば、`example.com`に対して[DoS protection](../api-protection/dos-protection.md)コントロール（1分あたり50リクエスト）を設定し、子の`example.com/login`に同種のコントロール（1分あたり10リクエスト）を設定しているとします。これにより、`example.com`配下のすべてのアドレスには1分あたり50リクエストの制限が適用されますが、`example.com/login`配下ではより厳しく1分あたり10リクエストの制限となります。
* `example.com/login`のrate abuse protectionコントロールを無効化（スイッチャーを**Off**）すると、そのコントロールは何もしなくなります（削除したのと同じ状態）——この場合、全体の制限は親コントロールにより決まります（1分あたり50リクエスト）。
* `example.com/login`のrate abuse protectionコントロールを再有効化し、そのMitigation modeを**Excluding**に設定すると、このブランチではrate abuse protectionが停止します。つまり、`example.com`全体では1分あたり50リクエストの制限が適用されますが、`example.com/login`ではrate abuse protectionタイプの制限は一切適用されません。

### Regular expressions

ScopeやScope filtersなどのさまざまなMitigation controlパラメータの指定には、正規表現を使用できます。

* **Scope**セクションはPIRE正規表現ライブラリを使用します。使い方の詳細は[こちら](../user-guides/rules/rules.md#condition-type-regex)をご覧ください。
* その他のセクションは[PCRE](https://www.pcre.org/)を使用します。正規表現を使用するには以下の演算子を使います。

    | 演算子 | 説明 |
    | --- | --- |
    | ~ (Aa)  | 大文字小文字を区別しない正規表現で検索します。 |
    | !~ (Aa) | 大文字小文字を区別しない正規表現で除外します。 |
    | ~       | 大文字小文字を区別する正規表現で検索します。 |
    | !~      | 大文字小文字を区別する正規表現で除外します。 |

## デフォルトコントロール

Wallarmは一連の**デフォルトのMitigation controls**を提供しており、有効化するとWallarmプラットフォームの検出能力が大幅に向上します。これらのコントロールは、多様な一般的攻撃パターンに対して堅牢な保護を提供するよう事前設定されています。現在のデフォルトMitigation controlsは以下のとおりです。

* [GraphQL protection](../api-protection/graphql-rule.md)
* ユーザーID、オブジェクトID、ファイル名に対する[BOLA (Broken Object Level Authorization) enumeration protection](../api-protection/enumeration-attack-protection.md#bola)
* パスワード、OTP、認証コードに対する[Brute force protection](../api-protection/enumeration-attack-protection.md#brute-force)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md#forced-browsing)（404 probing）
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md#generic-enumeration)として以下を含みます：
    
    * ユーザー/メールの列挙
    * SSRF（Server-Side Request Forgery）の列挙
    * User-agentのローテーション

デフォルトセットのすべてのコントロールには`Default`ラベルが付与されています。これらのコントロールは次のとおりです。

* 新規クライアントにはWallarmによって自動追加され有効（`On`）、既存クライアントでは無効（`Off`）です。

    !!! info "デフォルトコントロールが見当たらない場合"
        [必須](#obligatory_default_controls)のものを除いてデフォルトコントロールが表示されず、試してみたい場合は、[Wallarmサポートチーム](https://support.wallarm.com/)までご連絡ください。

* すべては初期状態で[all traffic](#scope)に適用されています（変更可能）。
* すべては初期状態で`Monitoring`[Mitigation mode](#mitigation-mode)を使用しています（変更可能）。
* 削除はできません。
* 他のコントロールと同様に無効化/再有効化や編集が可能です。編集により、アプリケーションの特性、トラフィックパターン、ビジネスコンテキストに応じて任意のデフォルトコントロールをカスタマイズできます。たとえば、既定のしきい値を調整したり、**Scope filters**セクションを使用して特定のエンドポイントを除外したりできます。
<!--* Can be **reset to its default configuration** at any time.-->

![デフォルトMitigation controls](../images/user-guides/mitigation-controls/mc-defaults.png)

--8<-- "../include/mc-subject-to-change.md"

<a name="obligatory_default_controls"></a>**必須のデフォルトコントロール**

* All traffic [Real-time blocking mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)コントロール
* [Overlimit res](../user-guides/rules/configure-overlimit-res-detection.md) <!--this is a general setting, not MC-->

## ルールセットのライフサイクル

作成したMitigation controlsと[rules](../user-guides/rules/rules.md)はカスタムルールセットを形成します。Wallarmノードは受信リクエストの解析時にこのカスタムルールセットに依存します。

rulesおよびMitigation controlsの変更は即時には反映されません。変更は、カスタムルールセットの**ビルド**と**フィルタリングノードへのアップロード**が完了した後にのみ、リクエスト解析プロセスに適用されます。

--8<-- "../include/custom-ruleset.md"