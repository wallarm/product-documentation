[link-regex]:                   https://github.com/yandex/pire
[link-request-processing]:      request-processing.md
[img-add-rule]:                 ../../images/user-guides/rules/section-rules-add-rule.png
[link-attack-detection-tools]:  ../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection
[link-sub-plans]:               ../../about-wallarm/subscription-plans.md#core-subscription-plans
[link-filtration-mode]:         ../../admin-en/configure-wallarm-mode.md
[link-nodes]:                   ../../about-wallarm/overview.md#how-wallarm-works
[link-sessions]:                ../../api-sessions/overview.md
[link-brute-force-protection]:  ../../admin-en/configuration-guides/protecting-against-bruteforce.md
[link-cloud-node-synchronization]: ../../admin-en/configure-cloud-node-synchronization-en.md
[img-rules-create-backup]:      ../../images/user-guides/rules/rules-create-backup.png

# ルール

ルールは、リクエストの解析およびその後の処理におけるWallarmの[既定][link-attack-detection-tools]の挙動を微調整するために使用します。つまり、ルールを使用すると、悪意のあるリクエストの検出方法や、そのようなリクエストが検出された際のシステムの動作を変更できます。

ルールは[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)のCloudにある**Rules**セクションで設定します。

![Rules section](../../images/user-guides/rules/section-rules.png)

!!! warning "ルール適用の遅延"
    ルールを変更しても、[ルールセットのコンパイル](#ruleset-lifecycle)とフィルタリングノードへのアップロードに時間がかかるため、すぐには反映されません。

## ルールでできること

ルールを使用して、アプリケーションやAPIへの攻撃に対するWallarmのミティゲーション方法を制御し、攻撃検出を細かく調整し、リクエスト/レスポンスを変更できます。

* 緩和制御:
    * [高度なレート制限](../../user-guides/rules/rate-limiting.md)
    * [バーチャルパッチ](../../user-guides/rules/vpatch-rule.md)
    * [カスタム攻撃検出器](../../user-guides/rules/regex-rule.md)
    * [ファイルアップロード制限](../../api-protection/file-upload-restriction.md#rule-based-protection)

* 攻撃検出の微調整:
    * 特定のドメイン/エンドポイントに対して[フィルタリングモードの上書き](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)を行います
    * [特定の攻撃を無視](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)します
    * 特定のドメイン/エンドポイントまたはリクエストの一部に対して[カスタム攻撃検出器を無効化](../../user-guides/rules/regex-rule.md#partial-disabling)します
    * [バイナリデータ処理](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)を構成します
    * [パーサーの構成](../../user-guides/rules/request-processing.md#managing-parsers)によりリクエスト処理を微調整します
    * 特定のドメイン/エンドポイントおよびリクエストに対して[API Abuse Preventionを無効化](../../api-abuse-prevention/exceptions.md#exceptions-for-target-urls-and-specific-requests)します
    * [リクエスト処理時間を制限](../../user-guides/rules/configure-overlimit-res-detection.md)してノード動作を微調整します

* リクエスト/レスポンスの変更:
    * [機微データのマスキング](../../user-guides/rules/sensitive-data-rule.md)を行います
    * [レスポンスヘッダーを変更](../../user-guides/rules/add-replace-response-header.md)してアプリケーションセキュリティの追加レイヤーを構成します

## ルールブランチ

ルールは、エンドポイントURIやその他の条件によって自動的にネストされたブランチにグループ化されます。これにより、ルールが下位に継承されるツリー状の構造が構築されます。原則は次のとおりです。

* すべてのブランチは[既定](#default-rules)ルールを継承します。
* ブランチ内では、子エンドポイントは親からルールを継承します。
* 個別指定は継承より優先されます。
* 直接指定は[正規表現](rules.md#condition-type-regex)より優先されます。
* 大文字小文字を[区別](rules.md#condition-type-equal)する指定は、[区別しない](rules.md#condition-type-iequal-aa)指定より優先されます。

![Rulesタブの概要](../../images/user-guides/rules/rules-overview.png)

### Default rules

アクションを指定しつつ、いずれのエンドポイントにも紐付けないルールを作成できます。これらは**default rules**と呼ばれます。このようなルールはすべてのエンドポイントに適用されます。

* 既定ルールを作成するには、[標準の手順](#configuring)に従いますが、URIは空白のままにします。エンドポイントに紐付かない新しいルールが作成されます。
* 作成済みの既定ルール一覧を表示するには、**Default rules**ボタンをクリックします。
* 既定ルールはすべてのブランチに継承されます。

!!! info "トラフィックフィルタリングモードの既定ルール"
    Wallarmはすべてのクライアントに対して`Set filtration mode`の既定ルールを自動作成し、その値を[全体のフィルタリングモード](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)設定に基づいて設定します。

### ブランチルールの表示

ルールブランチの操作方法に関する詳細です。

* エンドポイントを展開するには、青い円をクリックします。
* 個別ルールがないエンドポイントはグレー表示され、クリックできません。
    
    ![エンドポイントのブランチ](../../images/user-guides/rules/rules-branch.png)

* エンドポイントのルールを表示するには、それをクリックします。最初に、このエンドポイントの個別ルールが表示されます。
* 特定のエンドポイントのルール一覧を表示している際、継承されたルールを表示するには**Distinct and inherited rules**をクリックします。継承されたルールは個別ルールと共に表示され、個別に比べてグレー表示されます。

    ![エンドポイントの個別ルールと継承ルール](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## 構成

新しいルールを追加するには、[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)のCloudにある**Rules**セクションに移動します。ルールは既存の[ブランチ](#rule-branches)に追加することも、存在しない場合は新しいブランチを作成して一から追加することもできます。

![新しいルールの追加][img-add-rule]

ルールは、対象エンドポイント、メソッド、特定のパラメータや値の存在など、いくつかの条件が満たされた場合にのみリクエストに適用される点に注意してください。また、多くの場合、ルールはリクエストの一部にのみ適用されます。ルールとリクエスト構造の相互作用をよりよく理解するために、フィルタリングノードが[リクエストをどのように解析するか][link-request-processing]を理解することをお勧めします。

ルール条件は次の方法で定義できます。

* [URI constructor](#uri-constructor) - リクエストメソッドとエンドポイントを1つの文字列で指定して、ルール条件を構成できます。
* [Advanced edit form](#advanced-edit-form) - URI constructorを拡張し、メソッド/エンドポイントに加えて、アプリケーション、ヘッダー、クエリ文字列パラメータなどの追加条件も構成できるようにします。

### URI constructor

URI constructorでは、リクエストメソッドとエンドポイントを1つの文字列で指定して、ルール条件を構成できます。

#### 一般的な使い方

URI constructorは次を提供します。

* リクエストメソッドを選択するセレクターです。メソッドを選択しない場合、ルールは任意のメソッドのリクエストに適用されます。
* 次の値形式を受け付けるリクエストエンドポイント用のフィールドです。

    | 形式 | 例 |
    | ------ | ------ |
    | 次のコンポーネントを含む完全なURI:<ul><li>スキーム（この値は無視されます。スキームを明示的に指定するにはAdvanced edit formを使用できます）</li><li>ドメインまたはIPアドレス</li><li>ポート</li><li>パス</li><li>クエリ文字列パラメータ</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | いくつかのコンポーネントを省略したURI | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>``[header, 'HOST']` - 任意の値</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | `*`がコンポーネントの任意の空でない値を意味するURI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - 任意の空でない値（Advanced edit formでは非表示）</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - 任意の空でない値（Advanced edit formでは非表示）</li><li>`[action_ext]` - 任意の空でない値（Advanced edit formでは非表示）</li>この値は`example.com/api/create/user.php`にマッチし、<br>`example.com/create/user.php`および`example.com/api/create`にはマッチしません。</ul>|
    | `**`がコンポーネントの数に制限がなく、その欠如も含むことを意味するURI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>この値は`example.com/api/create/user`および`example.com/api/user`にマッチします。<br>この値は`example.com/user`、`example.com/api/user/index.php`、`example.com/api/user/?w=delete`にはマッチしません。</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - 任意の空でない値（Advanced edit formでは非表示）</li><li>`[action_ext]` - 任意の空でない値（Advanced edit formでは非表示）</li>この値は`example.com/api/create/user.php`および`example.com/api/user/create/index.php`にマッチし、<br>`example.com/api`、`example.com/api/user`、`example.com/api/create/user.php?w=delete`にはマッチしません。</ul> |
    | あるコンポーネント値にマッチさせるための[正規表現](#condition-type-regex)を使用するURI（正規表現は`{{}}`で囲む必要があります） | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>この値は`example.com/user/3445`にマッチし、<br>`example.com/user/3445/888`および`example.com/user/3445/index.php`にはマッチしません。</ul> |

URI constructorに指定した文字列は、自動的に以下の[条件](#conditions)の集合にパースされます。

* `method`
* `header`。URI constructorではヘッダー`HOST`のみを指定できます。
* `path`、`action_name`、`action_ext`。ルール作成を確定する前に、これらのリクエスト部位の値が次のいずれかの方法でパースされていることを確認してください。
    * ある番号の`path`の明示値 + `action_name` + `action_ext`（任意）
    * `action_name` + `action_ext`（任意）の明示値
    * `action_name`と`action_ext`を伴わない、ある番号の`path`の明示値
* `query`

URI constructorで指定した値は、[Advanced edit form](#advanced-edit-form)でのみ利用できる他の条件で補完できます。

#### ワイルドカードの使用

WallarmのURI constructorでワイルドカードを使用できますか？いいえ、そしてはい、です。「いいえ」とは、[古典的な](https://en.wikipedia.org/wiki/Wildcard_character)意味では使用できないということです。「はい」とは、次のように動作することで同じ結果を得られるということです。

* URIのパース対象コンポーネント内では、ワイルドカードの代わりに正規表現を使用します。
* URIフィールド自体に`*`または`**`を配置して、1つまたは任意数のコンポーネントを置き換えます（[上](#uri-constructor)のセクションの例を参照）。

**詳細**

正規表現の構文は古典的なワイルドカードとは異なりますが、同じ結果を達成できます。例えば、次のマスクに相当するものを得たいとします。

* `something-1.example.com/user/create.com` と
* `anything.something-2.example.com/user/create.com`

…古典的なワイルドカードであれば、次のように入力しようとするでしょう。

* `*.example.com/user/create.com`

しかしWallarmでは、`something-1.example.com/user/create.com`は次のようにパースされます。

![URIをコンポーネントに分解してパースする例](../../images/user-guides/rules/something-parsed.png)

…ここで、`something-1.example.com`は`header`-`HOST`の条件です。ワイルドカードは条件の中では使用できないと述べましたので、代わりに正規表現を使用する必要があります。条件タイプをREGEXに設定し、Wallarmの[特有の構文](#condition-type-regex)で正規表現を使用します。

1. 「任意の文字数」を意味する`*`は使用しません。
1. 「実際のドット」として解釈してほしいすべての`.`を角括弧で囲みます。

    `something-1[.]example[.]com`

1. 任意の1文字の置き換えとして角括弧なしの`.`を使用し、その後ろに量指定子`*`（直前の繰り返し0回以上）を付けて`.*`とします。つまり:

    `.*[.]example[.]com`

1. コンポーネントの終端であることを示すために、式の末尾に`$`を追加します。

    `.*[.]example[.]com$`

    !!! info "より簡単な方法"
        `.*`を省略して`[.]example[.]com$`のみにしても構いません。どちらの場合も、`[.]example[.]com$`の前には任意の文字が任意回数現れるとWallarmは解釈します。

    ![ヘッダーコンポーネントで正規表現を使用](../../images/user-guides/rules/wildcard-regex.png)

### Advanced edit form

Advanced edit formは[URI constructor](#uri-constructor)（メソッドとURI）の機能を拡張し、これらに加えてアプリケーション、ヘッダー、クエリ文字列パラメータなどの追加のルール条件も構成できるようにします。

#### Conditions

条件は、どのリクエスト部位にどの値が存在すべきかを示します。ルールは、すべての条件が満たされたときに適用されます。条件はルールの**If request is**セクションに一覧表示されます。

現在、以下の条件をサポートしています。

* **application**: アプリケーションIDです。
* **proto**: HTTPプロトコルバージョン（1.0, 1.1, 2.0, ...）です。
* **scheme**: httpまたはhttpsです。
* **uri**: ドメインを除いたリクエストURLの一部です（例えば、`http://example.com/blogs/123/index.php?q=aaa`へのリクエストでは`/blogs/123/index.php?q=aaa`）。
* **path**、**action_name**、**action_ext** は階層的なURIコンポーネント列で、意味は次のとおりです。 

    * **path**: `/`で区切られたURI部分の配列です（最後のURI部分は配列に含まれません）。URIに1つの部分しかない場合、配列は空になります。
    * **action_name**: `/`の後、最初のピリオド（`.`）の前にあるURIの最後の部分です。このURI部分は、その値が空文字列であっても常にリクエストに存在します。
    * **action_ext**: 最後のピリオド（`.`）の後にあるURIの部分です。リクエストに存在しない場合があります。
* **query**: クエリ文字列パラメータです。
* **header**: リクエストヘッダーです。ヘッダー名を入力すると、最も一般的な値がドロップダウンリストに表示されます。例えば: `HOST`、`USER-AGENT`、`COOKIE`、`X-FORWARDED-FOR`、`AUTHORIZATION`、`REFERER`、`CONTENT-TYPE`。

    !!! info "`HOST`ヘッダーのFQDNおよびIPアドレスに対するルール管理"
        `HOST`ヘッダーがFQDNに設定されている場合、そのFQDNに紐づくIPアドレスを宛先とするリクエストにはルールは適用されません。そのようなリクエストにもルールを適用するには、ルール条件で`HOST`ヘッダー値として特定のIPを設定するか、FQDNとそのIPそれぞれに対して別のルールを作成してください。

        `HOST`ヘッダーを変更するロードバランサの背後にある場合、Wallarmノードは元の値ではなく更新後の値に基づいてルールを適用します。例えば、バランサが`HOST`をIPからドメインに切り替えた場合、ノードはそのドメインのルールに従います。

* **method**: リクエストメソッドです。値を明示的に指定しない場合、ルールは任意のメソッドのリクエストに適用されます。

#### Condition type: EQUAL (`=`)

値は比較対象と完全に一致していなければなりません。例えば、値が`example`の場合、マッチするのは`example`のみです。

!!! info "HOSTヘッダー値に対するEQUAL条件タイプ"
    ルールでより多くのリクエストをカバーできるよう、HOSTヘッダーに対するEQUAL条件タイプを制限しています。EQUALタイプの代わりに、大文字小文字を区別しないIEQUALタイプの使用を推奨します。
    
    以前にEQUALタイプを使用していた場合、自動的にIEQUALタイプに置き換えられます。

#### Condition type: IEQUAL (`Aa`)

値は比較対象と大文字小文字を問わず一致していなければなりません。例えば、`example`、`ExAmple`、`exampLe`は値`example`にマッチします。

#### Condition type: REGEX (`.*`)

値は正規表現にマッチしていなければなりません。

**正規表現の構文**

正規表現でリクエストにマッチさせるには、PIREライブラリを使用します。基本的に構文は標準的ですが、以下および[PIREリポジトリ][link-regex]のREADMEに記載のとおりいくつか特有の点があります。

??? info "正規表現の構文を表示"
    そのまま使用できる文字です。
    
    * 英小文字: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * 英大文字: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * 数字: `0 1 3 4 5 6 7 8 9`
    * 特殊文字: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * 空白文字

    `\`でエスケープする代わりに角括弧`[]`で囲む必要がある文字です。
    
    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859に従ってASCIIに変換する必要がある文字です。
    
    * UTF‑8文字（例えば、文字`ʃ`はASCIIでは`Ê`です）

    文字クラスです。
    
    * 改行以外の任意の1文字は`.`です
    * 正規表現のグルーピング、`()`内に存在する記号の検索、または優先順位の設定には`()`です
    * `[]`は角括弧内に存在するいずれか1文字（大文字小文字は区別）です。以下のような用途で使用できます。
        * 大文字小文字を無視する（例: `[cC]`）
        * `[a-z]`でいずれかの英小文字にマッチ
        * `[A-Z]`でいずれかの英大文字にマッチ
        * `[0-9]`でいずれかの数字にマッチ
        * `[a-zA-Z0-9[.]]`で英小文字、英大文字、数字、またはドットのいずれかにマッチ

    論理演算子です。
    
    * `~`はNOTと同義です。否定する式と文字は`()`で囲む必要があります。<br>例: `(~(a))`
    * `|`はORと同義です
    * `&`はANDと同義です

    文字列境界を指定する文字です。
    
    * `^`は文字列の先頭です
    * `$`は文字列の末尾です

    量指定子です。
    
    * `*`は直前の正規表現の0回以上の繰り返しです
    * `+`は直前の正規表現の1回以上の繰り返しです
    * `?`は直前の正規表現の0回または1回の繰り返しです
    * `{m}`は直前の正規表現の`m`回の繰り返しです
    * `{m,n}`は直前の正規表現の`m`回から`n`回の繰り返しです。`n`を省略すると上限は無限を意味します

    特有の挙動を持つ組み合わせです。
    
    * `^.*$`は`^.+$`と同義です（空文字列は`^.*$`にマッチしません）
    * `^.?$`、`^.{0,}$`、`^.{0,n}$`は`^.+$`と同義です

    一時的に未対応です。
    
    * `\W`（非英数字）、`\w`（英数字）、`\D`（非数字）、`\d`（数字）、`\S`（非空白）、`\s`（空白）といった文字クラス

    未対応の構文です。
    
    * 3桁の8進数コード `\NNN`、`\oNNN`、`\ONNN`
    * `\c`経由での制御文字の指定 `\cN`（例: CTRL+Cのための`\cC`）
    * 文字列の先頭を示す`\A`
    * 文字列の末尾を示す`\z`
    * 文字列末尾の空白文字前後を示す`\b`
    * `??`、`*?`、`+?`の遅延量指定子
    * 条件式

**正規表現のテスト**

正規表現をテストするには、Wallarmの**cpire**ユーティリティを使用します。LinuxベースのOSに[Wallarm all-in-one installer](../../installation/nginx/all-in-one.md)経由でインストールするか、次の方法で[Wallarm NGINX-based Docker image](../../admin-en/installation-docker-en.md)から実行します。

=== "All-in-oneインストーラー"
    1. まだダウンロードしていない場合は、Wallarm all-in-one installerをダウンロードします。

        ```
        curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.x86_64-glibc.sh
        ```
    1. まだインストールしていない場合は、Wallarmモジュールをインストールします。
        
        ```
        sudo sh wallarm-6.4.1.x86_64-glibc.sh -- --batch --token <API_TOKEN>
        ```
    1. **cpire**ユーティリティを実行します。
        
        ```bash
        /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    1. 正規表現にマッチするかどうかを確認したい値を入力します。
=== "NGINXベースのDockerイメージ"
    1. WallarmのDockerイメージから**cpire**ユーティリティを実行します。
    
        ```
        docker run --rm -it wallarm/node:6.4.1 /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    1. 正規表現にマッチするかどうかを確認したい値を入力します。

ユーティリティは次の結果を返します。

* 値が正規表現にマッチする場合は`0`
* 値が正規表現にマッチしない場合は`FAIL`
* 正規表現が無効な場合はエラーメッセージ

!!! warning "`\`文字の取り扱いの注意点"
    式に`\`が含まれる場合は、`[]`と`\`でエスケープしてください（例: `[\\]`）。

**Wallarm Console経由で追加された正規表現の例**

* <code>/.git</code>を含む任意の文字列にマッチさせるには

    ```
    /[.]git
    ```
* <code>.example.com</code>を含む任意の文字列にマッチさせるには

    ```
    [.]example[.]com
    ```
* 末尾が<code>/.example.*.com</code>（ここで`*`は任意の文字が任意回数繰り返されることを意味します）で終わる任意の文字列にマッチさせるには

    ```
    /[.]example[.].*[.]com$
    ```
* 1.2.3.4および5.6.7.8を除くすべてのIPアドレスにマッチさせるには

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* 末尾が<code>/.example.com.php</code>で終わる任意の文字列にマッチさせるには

    ```
    /[.]example[.]com[.]php$
    ```
* <code>sqlmap</code>を小文字・大文字の組み合わせで含む任意の文字列（<code>sqLmAp</code>、<code>SqLMap</code>など）にマッチさせるには

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* 次のいずれかを含む任意の文字列にマッチさせるには: <code>admin\\.exe</code>、<code>admin\\.bat</code>、<code>admin\\.sh</code>、<code>cmd\\.exe</code>、<code>cmd\\.bat</code>、<code>cmd\\.sh</code>

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* 次のいずれかを含む任意の文字列にマッチさせるには: 小文字・大文字の組み合わせの<code>onmouse</code>、小文字・大文字の組み合わせの<code>onload</code>、<code>win\\.ini</code>、<code>prompt</code>

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* `Mozilla`で始まり、かつ`1aa875F49III`という文字列を含まない任意の文字列にマッチさせるには
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* 次のいずれかを含む任意の文字列にマッチさせるには: `python-requests/`、`PostmanRuntime/`、`okhttp/3.14.0`、`node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### Condition type: ABSENT (`∅`)

指定した部位がリクエストに存在しない必要があります。この場合、比較対象の引数は使用されません。

## Ruleset lifecycle

作成したすべてのルールと[ミティゲーション制御](../../about-wallarm/mitigation-controls-overview.md)はカスタムルールセットを形成します。Wallarmノードは受信リクエストの解析時にカスタムルールセットに依存します。

ルールおよびミティゲーション制御の変更は即座には反映されません。変更は、カスタムルールセットの**ビルド**および**フィルタリングノードへのアップロード**が完了した後にのみ、リクエスト解析プロセスに適用されます。

--8<-- "../include/custom-ruleset.md"

## ルールを取得するAPI呼び出し

カスタムルールを取得するには、[Wallarm APIを直接呼び出す](../../api/request-examples.md#get-all-configured-rules)ことができます。