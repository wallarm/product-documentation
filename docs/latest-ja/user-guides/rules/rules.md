```markdown
[link-regex]:                   https://github.com/yandex/pire
[link-request-processing]:      request-processing.md
[img-add-rule]:                 ../../images/user-guides/rules/section-rules-add-rule.png

# ルール

ルールはリクエストの解析およびその後の処理中に[デフォルト](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection)なWallarmの挙動を細かく調整するために使用します。これにより、ルールを使用して悪意のあるリクエストの検出方法および検出時の動作を変更可能です。

ルールは[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)Cloudの**ルール**セクションで設定できます。

![ルールセクション](../../images/user-guides/rules/section-rules.png)

!!! warning "ルール適用の遅延"
    ルールに変更を加えても、ルールの[ビルドライフサイクル](#ruleset-lifecycle)が完了し、フィルタリングノードにアップロードされるまで即時には反映されません。

## ルールを使用してできること

ルールを使用して、WallarmがアプリケーションやAPIに対する攻撃をどのように軽減するかの制御、攻撃検出の微調整、リクエスト／レスポンスの変更を行うことができます：

* 攻撃緩和の制御:

    * [高度なレート制限](../../user-guides/rules/rate-limiting.md)
    * [GraphQL API保護](../../api-protection/graphql-rule.md)
    * [バーチャルパッチ](../../user-guides/rules/vpatch-rule.md)
    * [カスタム攻撃検出器](../../user-guides/rules/regex-rule.md)

* 攻撃検出の微調整:

    * 特定のドメイン／エンドポイントに対して[フィルトレーションモードの上書き](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
    * [特定の攻撃を無視](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)
    * 特定のドメイン／エンドポイントまたはリクエスト部分に対して[カスタム攻撃検出器を無効](../../user-guides/rules/regex-rule.md#partial-disabling)に設定
    * [バイナリデータ処理の設定](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)
    * [パーサーの設定](../../user-guides/rules/request-processing.md#managing-parsers)によりリクエスト処理を微調整
    * 特定のドメイン／エンドポイントおよびリクエストに対して[API Abuse Preventionを無効](../../api-abuse-prevention/exceptions.md#exceptions-for-target-urls-and-specific-requests)に設定
    * [リクエスト処理時間の制限](../../user-guides/rules/configure-overlimit-res-detection.md)によりノード動作を微調整

* リクエスト／レスポンスの変更:

    * [機密データのマスク](../../user-guides/rules/sensitive-data-rule.md)
    * [レスポンスヘッダーの変更](../../user-guides/rules/add-replace-response-header.md)によりアプリケーションセキュリティの追加層を設定

## ルールブランチ

ルールは、エンドポイントURIやその他の条件によって自動的にネストされたブランチにグループ化されます。これにより、ルールが下位に継承されるツリー状の構造が構築されます。原則は次の通りです：

* すべてのブランチは[デフォルト](#default-rules)ルールを継承します。
* ブランチ内では、子エンドポイントが親からルールを継承します。
* 個別設定が継承より優先されます。
* 直接指定が[正規表現](rules.md#condition-type-regex)より優先されます。
* 大文字と小文字を区別する[EQUAL](rules.md#condition-type-equal)が、大文字小文字を区別しない[IEQUAL](rules.md#condition-type-iequal-aa)より優先されます。

![ルールタブの概要](../../images/user-guides/rules/rules-overview.png)

### デフォルトルール

エンドポイントにリンクされていない指定のアクションを持つルールを作成できます。これらは**デフォルトルール**と呼ばれ、すべてのエンドポイントに適用されます。

* デフォルトルールを作成するには、[標準手順](#configuring)に従い、URIを空欄にしてください。エンドポイントにリンクされていない新しいルールが作成されます。
* 作成済みのデフォルトルールの一覧を見るには、**Default rules**ボタンをクリックしてください。
* デフォルトルールはすべてのブランチに継承されます。

!!! info "トラフィックフィルトレーションモードのデフォルトルール"
    Wallarmは自動的にすべてのクライアント向けに`Set filtration mode`デフォルトルールを作成し、[一般フィルトレーションモード](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)の設定に基づいてその値を設定します。

### ブランチルールの閲覧

ルールブランチの操作方法の詳細は以下の通りです：

* エンドポイントを展開するには、青い円をクリックしてください。
* 個別のルールを持たないエンドポイントはグレー表示となり、クリックできません。
    
    ![エンドポイントのブランチ](../../images/user-guides/rules/rules-branch.png)

* エンドポイントのルールを表示するには、そのエンドポイントをクリックしてください。まず、このエンドポイントの個別ルールが表示されます。
* 特定のエンドポイントのルール一覧を表示している場合、**Distinct and inherited rules**をクリックすると、継承ルールが表示されます。継承ルールは個別ルールとともに表示され、個別ルールに比べグレー表示となります。

    ![エンドポイントの個別および継承ルール](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## 設定

新規ルールを追加するには、[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)Cloudの**ルール**セクションに移動してください。ルールは既存の[ブランチ](#rule-branches)に追加することも、新規に追加してブランチを作成することもできます（ブランチが存在しない場合）。

![新規ルールの追加][img-add-rule]

なお、ルールは特定の条件（ターゲットエンドポイント、メソッド、特定のパラメータまたは値の存在など）が満たされた場合にのみリクエストに対して適用されます。また、リクエストの一部にのみ適用されることがよくあります。リクエスト構造とルールの相互作用をより理解するために、フィルタリングノードが[リクエストをどのように解析するか][link-request-processing]を確認されることを推奨します。

ルールの条件は以下の方法で定義できます：

* [URIコンストラクタ](#uri-constructor) - １つの文字列でリクエストメソッドとエンドポイントを指定することでルール条件を設定できます。
* [高度な編集フォーム](#advanced-edit-form) - URIコンストラクタを拡張し、メソッド／エンドポイントに加え、アプリケーション、ヘッダー、クエリ文字列パラメータなどの追加ルール条件を設定できます。

### URIコンストラクタ

URIコンストラクタは、１つの文字列でリクエストメソッドとエンドポイントを指定することにより、ルール条件を設定することを可能にします。

#### 一般的な使い方

URIコンストラクタは以下の機能を提供します：

* リクエストメソッドのセレクター。メソッドが選択されていない場合、ルールは任意のメソッドのリクエストに適用されます。
* リクエストエンドポイントのフィールド。次の形式の値を受け付けます：

    | 形式 | 例 |
    | ------ | ------ |
    | 次のコンポーネントを含む完全なURI：<ul><li>スキーム（値は無視され、詳細な設定は高度なフォームで明示的に指定可能）</li><li>ドメインまたはIPアドレス</li><li>ポート</li><li>パス</li><li>クエリ文字列パラメータ</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul> |
    | 一部のコンポーネントが省略されたURI | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>`[header, 'HOST']` - 任意の値</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul> |
    | コンポーネントの任意の非空値を意味する`*`を含むURI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - 任意の非空値（高度な編集フォームでは隠されています）</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - 任意の非空値（高度な編集フォームでは隠されています）</li><li>`[action_ext]` - 任意の非空値（高度な編集フォームでは隠されています）</li>この値は`example.com/api/create/user.php`にマッチし、`example.com/create/user.php`や`example.com/api/create`にはマッチしません。</ul> |
    | コンポーネントの数の任意性（存在しない場合も含む）を意味する`**`を含むURI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>この値は`example.com/api/create/user`や`example.com/api/user`にマッチし、`example.com/user`、`example.com/api/user/index.php`、`example.com/api/user/?w=delete`にはマッチしません。</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - 任意の非空値（高度な編集フォームでは隠されています）</li><li>`[action_ext]` - 任意の非空値（高度な編集フォームでは隠されています）</li>この値は`example.com/api/create/user.php`や`example.com/api/user/create/index.php`にマッチし、`example.com/api`、`example.com/api/user`、`example.com/api/create/user.php?w=delete`にはマッチしません。</ul> |
    | 特定のコンポーネント値にマッチするために[正規表現](#condition-type-regex)を使用するURI（正規表現は`{{}}`で囲む必要があります） | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>この値は`example.com/user/3445`にマッチし、`example.com/user/3445/888`や`example.com/user/3445/index.php`にはマッチしません。</ul> |

URIコンストラクタで指定された文字列は、自動的に以下の[条件](#conditions)のセットに解析されます：

* `method`
* `header`。URIコンストラクタでは`HOST`ヘッダーのみ指定可能です。
* `path`、`action_name`、`action_ext`。ルール作成の確定前に、これらのリクエスト部分の値が以下のいずれかの方法で解析されていることを確認してください：
    * 特定の`path`番号＋`action_name`＋（任意の）`action_ext`の明示的な値
    * `action_name`＋（任意の）`action_ext`の明示的な値
    * `action_name`および`action_ext`なしの特定の`path`番号の明示的な値
* `query`

URIコンストラクタで指定された値は、[高度な編集フォーム](#advanced-edit-form)でのみ利用可能な他の条件により補完できます。

#### ワイルドカードの使用

WallarmのURIコンストラクタでワイルドカードを使用できますか？　答えは「いいえ」と「はい」です。「いいえ」は従来の使い方[クラシックな](https://en.wikipedia.org/wiki/Wildcard_character)ワイルドカードは使用できないという意味であり、「はい」は次のような動作で同じ結果を得られるという意味です：

* URIの解析されたコンポーネント内では、ワイルドカードの代わりに正規表現を使用してください。
* URIフィールド自体に`*`または`**`記号を配置して、1つまたは任意の数のコンポーネントの代替としてください（上記の例を参照）。

**いくつかの詳細**

正規表現の構文は従来のワイルドカードとは異なりますが、同じ結果を得ることが可能です。例えば、次の2つに該当するマスクを取得したい場合：

* `something-1.example.com/user/create.com`
* `anything.something-2.example.com/user/create.com`

…クラシックなワイルドカードでは以下のように入力するかもしれません：

* `*.example.com/user/create.com`

しかし、Wallarmでは`something-1.example.com/user/create.com`は次のように解析されます：

![URIのコンポーネントへの解析例](../../images/user-guides/rules/something-parsed.png)

ここで、`something-1.example.com`は`header`-`HOST`条件として解析されます。ワイルドカードは条件内で使用できないため、代わりに正規表現を使用する必要があります。条件タイプをREGEXに設定し、Wallarm固有の正規表現[構文](#condition-type-regex)を使用してください：

1. 「任意の数のシンボル」を意味する`*`は使用しないでください。
1. 実際のドットとして解釈してほしいすべての`.`は角括弧に入れてください：

    `something-1[.]example[.]com`

1. 任意のシンボルの置換えとして角括弧なしの`.`およびその後に数量子`*`を使用して「前の項目が0回以上繰り返される」という意味にし、つまり`.*`とします。つまり：
    
    `.*[.]example[.]com`

1. 式の末尾に`$`を追加し、作成した文字列でコンポーネントが終了することを明示します：
    
    `.*[.]example[.]com$`

    !!! info "より簡単な方法"
        `.*`を省略して`[.]example[.]com$`だけにしても構いません。どちらの場合も、Wallarmは`[.]example[.]com$`の前に任意の文字が何回でも出現してよいと仮定します。

    ![ヘッダーコンポーネントで正規表現を使用する例](../../images/user-guides/rules/wildcard-regex.png)

### 高度な編集フォーム

高度な編集フォームは、[URIコンストラクタ](#uri-constructor)（メソッドとURI）の可能性を拡張し、これらに加えてアプリケーション、ヘッダー、クエリ文字列パラメータなどの追加ルール条件を設定できるようにします。

#### 条件

条件は、どのリクエスト部分にどの値が存在すべきかを示します。すべての条件が満たされた場合にルールが適用されます。条件はルールの**If request is**セクションにリストされます。

現在サポートされている条件は次の通りです：

* **application**: アプリケーションID。
* **proto**: HTTPプロトコルバージョン（1.0、1.1、2.0、…）。
* **scheme**: httpまたはhttps。
* **uri**: ドメインを除くリクエストURLの部分（例：`http://example.com/blogs/123/index.php?q=aaa`へのリクエストの場合は`/blogs/123/index.php?q=aaa`）。
* **path**、**action_name**、**action_ext**は階層的なURIコンポーネントの連なりで、以下の通りです： 

    * **path**: `/`記号で区切られたURIパーツの配列（最後のパーツは含まれません）。URIが1パーツのみの場合、配列は空となります。
    * **action_name**: `/`の後、最初のドット(`.`)の前のURIの最後の部分。この部分は、値が空文字でも常にリクエストに含まれます。
    * **action_ext**: 最後のドット(`.`)以降のURI部分。リクエストに存在しない場合もあります。
* **query**: クエリ文字列パラメータ。
* **header**: リクエストヘッダー。ヘッダー名を入力すると、一般的な値がドロップダウンリストに表示されます。例：`HOST`、`USER-AGENT`、`COOKIE`、`X-FORWARDED-FOR`、`AUTHORIZATION`、`REFERER`、`CONTENT-TYPE`。

    !!! info "FQDNおよびIPアドレスのための`HOST`ヘッダー規則の管理"
        `HOST`ヘッダーがFQDNに設定されている場合、その関連するIPアドレスをターゲットとするリクエストにはルールが適用されません。そのようなリクエストにルールを適用するには、ルール条件に`HOST`ヘッダーの値を特定のIPに設定するか、FQDNとそのIPの両方に対して個別のルールを作成してください。

        ロードバランサーの後に`HOST`ヘッダーが変更される場合、Wallarmノードは元の値ではなく更新後の値に基づいてルールを適用します。たとえば、バランサーが`HOST`をIPからドメインに切り替えた場合、ノードはそのドメイン向けのルールに従います。

* **method**: リクエストメソッド。値が明示的に指定されていない場合、ルールは任意のメソッドのリクエストに適用されます。

#### 条件タイプ： EQUAL (`=`)
 
値は比較対象と正確に一致する必要があります。たとえば、値`example`には`example`のみが一致します。

!!! info "HOSTヘッダー値に対するEQUAL条件タイプ"
    より多くのリクエストにルールを適用できるよう、HOSTヘッダーに対してはEQUAL条件タイプが制限されています。EQUALタイプの代わりに、大文字小文字を区別しないIEQUALタイプの使用を推奨します。
    
    以前にEQUALタイプを使用されていた場合、自動的にIEQUALタイプに置き換えられます。

#### 条件タイプ： IEQUAL (`Aa`)

値は大文字小文字を区別せずに比較対象と一致する必要があります。たとえば、`example`、`ExAmple`、`exampLe`は値`example`に一致します。

#### 条件タイプ： REGEX (`.*`)

値は正規表現に一致する必要があります。

**正規表現の構文**

正規表現によるリクエストのマッチングにはPIREライブラリが使用されます。基本的な構文は標準的ですが、以下および[PIREリポジトリのREADMEファイル][link-regex]に記載の特有の点があります。

??? info "正規表現構文の詳細"
    そのまま使用可能な文字：

    * 小文字のラテン文字：`a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * 大文字のラテン文字：`A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * 数字：`0 1 3 4 5 6 7 8 9`
    * 特殊文字：<code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * 空白文字

    エスケープの代わりに角括弧`[]`に入れる必要がある文字：

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859に従ってASCIIに変換される必要がある文字：

    * UTF‑8文字（例：文字`ʃ`はASCIIでは`Ê`に変換されます）

    文字グループ：

    * 改行以外の任意の文字にマッチする`.` 
    * 正規表現をグループ化するための`()`, グループ内のシンボルの検索または優先順位の決定に使用
    * `[]`：`[]`内にある単一文字にマッチ（大文字小文字を区別）；特定のケースでは以下のように使用：
        * 大文字小文字を区別しないように（例：`[cC]`）
        * `[a-z]` 小文字のラテン文字のいずれかにマッチ
        * `[A-Z]` 大文字のラテン文字のいずれかにマッチ
        * `[0-9]` 数字のいずれかにマッチ
        * `[a-zA-Z0-9[.]]` 小文字、大文字、数字またはドットのいずれかにマッチ

    論理文字：

    * `~` はNOTを意味します。否定式と対象文字は`()`に入れてください。<br>例：`(~(a))`
    * `|` はORを意味
    * `&` はANDを意味

    文字列の境界を指定する文字：

    * `^` は文字列の開始
    * `$` は文字列の終了

    量指定子：

    * `*` は前の正規表現が0回以上繰り返されることを意味
    * `+` は1回以上の繰り返しを意味
    * `?` は0回または1回の繰り返しを意味
    * `{m}` は前の正規表現が`m`回繰り返されることを意味
    * `{m,n}` は前の正規表現が`m`から`n`回繰り返されることを意味；`n`を省略すると上限は無限になります

    特有の動作と組み合わせ可能な文字列：

    * `^.*$` は `^.+$` と同じ（空の値は`^.*$`にはマッチしません）
    * `^.?$`、`^.{0,}$`、`^.{0,n}$` は `^.+$` と同じ

    一時的にサポートされていないもの：

    * `\W`（非アルファベット）や`\w`（アルファベット）、`\D`（数字以外）、`\d`（数字）、`\S`（空白以外）、`\s`（空白）のような文字クラス

    サポートされていない構文：

    * 3桁の8進数コード `\NNN`、`\oNNN`、`\ONNN`
    * `\cN` による制御文字の指定（例：`\cC`はCTRL+C）
    * 文字列の開始を意味する `\A`
    * 文字列の終了を意味する `\z`
    * 文字列末尾の空白文字の前後に出現する `\b`
    * 遅延量指定子の`??`、`*?`、`+?`
    * 条件付き

**正規表現のテスト**

正規表現のテストには、Wallarmの**cpire**ユーティリティを使用してください。LinuxベースOSでは[Wallarm all-in-one installer](../../installation/nginx/all-in-one.md)を通じてインストールするか、[Wallarm NGINXベースDockerイメージ](../../admin-en/installation-docker-en.md)から次のように実行してください：

=== "All-in-one installer"
    1. Wallarm all-in-one installerが未ダウンロードの場合、ダウンロードしてください：

        ```
        curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
        ```
    1. Wallarmモジュールが未インストールの場合、インストールしてください：
        
        ```
        sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch --token <API_TOKEN>
        ```
    1. **cpire**ユーティリティを実行してください：
        
        ```bash
        /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    1. 正規表現にマッチするかどうかを確認するための値を入力してください。
=== "NGINX-based Docker image"
    1. Wallarm Dockerイメージから**cpire**ユーティリティを実行してください：
    
        ```
        docker run --rm -it wallarm/node:5.3.0 /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    1. 正規表現にマッチするかを確認するための値を入力してください。

ユーティリティは次の結果を返します：

* 値が正規表現に一致する場合は`0`
* 一致しない場合は`FAIL`
* 正規表現が無効な場合はエラーメッセージ

!!! warning "「\」文字の取り扱いの特記事項"
    式に`\`が含まれる場合は、必ず`[]`と`\`でエスケープしてください（例：`[\\]`）。

**Wallarm Console経由で追加された正規表現の例**

* `/.git`を含む任意の文字列にマッチ

    ```
    /[.]git
    ```
* `.example.com`を含む任意の文字列にマッチ

    ```
    [.]example[.]com
    ```
* 任意の文字が0回以上繰り返される`/.example.*.com`で終わる文字列にマッチ（`*`は任意の文字の繰り返し）

    ```
    /[.]example[.].*[.]com$
    ```
* 1.2.3.4および5.6.7.8を除くすべてのIPアドレスにマッチ

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* `/.example.com.php`で終わる任意の文字列にマッチ

    ```
    /[.]example[.]com[.]php$
    ```
* 小文字大文字が混在していても`sqlmap`を含む任意の文字列にマッチ：例：`sqLmAp`、`SqLMap`など

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* `admin\.exe`、`admin\.bat`、`admin\.sh`、`cmd\.exe`、`cmd\.bat`、`cmd\.sh`のいずれかを含む任意の文字列にマッチ

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* 小文字大文字が混在した`onmouse`、`onload`、`win\.ini`、`prompt`のいずれかを含む任意の文字列にマッチ

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* `Mozilla`で始まるが、`1aa875F49III`を含まない任意の文字列にマッチ
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* `python-requests/`、`PostmanRuntime/`、`okhttp/3.14.0`、`node-fetch/1.0`のいずれかを含む任意の文字列にマッチ

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### 条件タイプ： ABSENT (`∅`)

指定された部分がリクエストに存在してはならないことを意味します。この場合、比較対象の引数は使用されません。

## ルールセットのライフサイクル

作成されたすべてのルールはカスタムルールセットを形成します。Wallarmノードはリクエスト解析時にこのカスタムルールセットに依存します。

カスタムルールの変更は即時に反映されません。カスタムルールセットの**ビルド**および**フィルタリングノードへのアップロード**が完了して初めて変更がリクエスト解析プロセスに適用されます。

### カスタムルールセットのビルド

Wallarm Consoleの**ルール**で新規ルールの追加、既存ルールの削除または変更を行うと、カスタムルールセットのビルドが開始されます。ビルドプロセスでは、ルールが最適化され、フィルタリングノードに適した形式にコンパイルされます。カスタムルールセットのビルドには、ルール数が少なければ数秒、複雑なルールツリーの場合は1時間に及ぶことがあります。

### フィルタリングノードへのアップロード

カスタムルールセットのビルドは、フィルタリングノードとWallarm Cloudの同期時にフィルタリングノードへアップロードされます。デフォルトでは、フィルタリングノードとWallarm Cloudの同期は2～4分ごとに実行されます。[フィルタリングノードとWallarm Cloud同期設定の詳細はこちら →](../../admin-en/configure-cloud-node-synchronization-en.md)

カスタムルールセットのフィルタリングノードへのアップロード状況は、`/opt/wallarm/var/log/wallarm/wcli-out.log`ファイルに記録されます。

同一のWallarmアカウントに接続されているすべてのWallarmノードは、トラフィックフィルタリング用に同一のデフォルトおよびカスタムルールを受信します。しかし、アプリケーションIDや固有のHTTPリクエストパラメータ（ヘッダー、クエリ文字列パラメータなど）を使用することで、異なるアプリケーションに対して異なるルールを適用することも可能です。

### バックアップとリストア

誤ってルールを誤設定または削除してしまった場合に備え、現在のカスタムルールセットをバックアップできます。

ルールバックアップのオプションは以下の通りです： 

* 各[カスタムルールセットビルド](#custom-ruleset-building)後の自動バックアップ作成。自動バックアップの数は7に制限され、1日にルールが複数回変更された場合は最後のバックアップのみが保持されます。
* 任意のタイミングでの手動バックアップ作成。手動バックアップの数はデフォルトで5に制限されています。より多く必要な場合は[Wallarmテクニカルサポート](mailto:support@wallarm.com)チームにお問い合わせください。

可能な操作：

* 現在のバックアップにアクセス：**ルール**セクションで**Backups**をクリック。
* 手動で新たなバックアップを作成：**Backups**ウィンドウで**Create backup**をクリック。
* 手動バックアップの名前と説明を設定、または後から編集可能。

    !!! info "自動バックアップの命名について"
        自動バックアップはシステムによって命名され、名前の変更はできません。

* 既存バックアップからロード：対象バックアップの**Load**をクリック。バックアップからロードすると、現在のルール設定は削除され、バックアップの設定で上書きされます。
* バックアップの削除。

    ![ルール - バックアップの作成](../../images/user-guides/rules/rules-create-backup.png)

!!! warning "ルール修正の制限事項"
    バックアップの作成またはバックアップからのロードが完了するまで、ルールの作成や変更はできません。

## ルール取得のためのAPI呼び出し

カスタムルールを取得するには、[Wallarm APIを直接呼び出す](../../api/request-examples.md#get-all-configured-rules)ことが可能です。
```