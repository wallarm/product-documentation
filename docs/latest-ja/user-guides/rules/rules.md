[link-regex]:                   https://github.com/yandex/pire
[link-request-processing]:      request-processing.md
[img-add-rule]:                 ../../images/user-guides/rules/section-rules-add-rule.png

# ルール

ルールは、リクエストの分析とそれ以降の処理中に、Wallarmの[デフォルト](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection)の挙動を微調整するために使用されます。したがって、ルールを使用することで、システムが悪意のあるリクエストを検出し、そのような悪意のあるリクエストが検出されたときにどのように行動するかを変更することができます。

ルールは、[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)Cloudの**Rules**セクションで設定します。

![Rules section](../../images/user-guides/rules/section-rules.png)

!!! warning "ルール適用の遅延"
    ルールを変更すると、すぐには効果が現れません。変更したルールを[コンパイルし](#ruleset-lifecycle)フィルタリングノードにアップロードするまでに時間がかかります。

## ルールで何ができるか

ルールを使用すると、アプリケーションやAPIに対する複数の保護手段を提供したり、攻撃が検出される方法や、Wallarmノードや一部のWallarmコンポーネントの動作が微調整されることができます:

* [レート制限の設定](../../user-guides/rules/rate-limiting.md)
* [仮想パッチの適用](../../user-guides/rules/vpatch-rule.md)
* [独自の検出ルールの作成](../../user-guides/rules/regex-rule.md)
* [機密データのマスキング](../../user-guides/rules/sensitive-data-rule.md)
* ノード関数の微調整により[リクエスト処理時間の制限](../../user-guides/rules/configure-overlimit-res-detection.md)
* リクエスト処理の微調整により[リクエストパーサーの管理](../../user-guides/rules/request-processing.md#managing-parsers)
* アプリケーションのセキュリティー層を追加して[サーバーレスポンスヘッダーの変更](../../user-guides/rules/add-replace-response-header.md)
* 攻撃の検出を微調整して、[特定の攻撃タイプを無視する](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)設定と、[バイナリーデータ内の特定の攻撃兆候を無視する](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)設定

## ルールのブランチ

ルールは、エンドポイントのURIや他の条件で自動的にネストされたブランチにグループ化されます。これにより、ルールが下方向に継承されるツリー構造が構築されます。原則:

* すべてのブランチは[デフォルト](#default-rules)のルールを継承します。
* ブランチ内では、子エンドポイントは親からルールを継承します。
* 独立したものは継承したものより優先されます。
* 直接指定されたものは、[regex](rules.md#condition-type-regex)よりも優先されます。
* [敏感](rules.md#condition-type-equal)は[不敏感](rules.md#condition-type-iequal-aa)よりも優先されます。

![Rules tab overview](../../images/user-guides/rules/rules-overview.png)

### デフォルトのルール

エンドポイントにリンクされていないが指定されたアクションを持つルールを作成することができます。これらは**デフォルトのルール**と呼ばれ、すべてのエンドポイントに適用されます。

* デフォルトルールを作成するには、[標準的な手順](#configuring)に従いますが、URIを空白にします。新たにエンドポイントにリンクされていないルールが作成されます。
* 作成済みのデフォルトルールのリストを表示するには、**デフォルトルール**ボタンをクリックします。
* デフォルトのルールはすべてのブランチで継承されます。

!!! info "トラフィックフィルタリングモードのデフォルトルール"
    Wallarmは自動的にすべてのクライアント用に`Set filtration mode`のデフォルトルールを作成し、その値を[一般的なフィルタリングモード](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)の設定に基づいて設定します。

### ブランチルールの表示

以下に、ルールのブランチの使用方法の詳細を示します:

* エンドポイントを展開するには、青い円をクリックします。
* 明確なルールを持たないエンドポイントはグレー表示され、クリックできません。
    
    ![Branch of endpoints](../../images/user-guides/rules/rules-branch.png)

* エンドポイントのルールを表示するには、それをクリックします。まず、このエンドポイントのための明確なルールが表示されます。
* 特定のエンドポイントのルールリストを表示しているときに、**Distinct and inherited rules**をクリックして継承したものを表示します。継承したルールは、明確なものとともに表示され、それらは明確なものに比べてグレー表示されます。

    ![Distinct and inherited rules for endpoint](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## 設定

新しいルールを追加するには、[US](https://us1.my.wallarm.com/rules)または[EU](https://my.wallarm.com/rules)のCloudの**ルール**セクションに行きます。ルールは既存の[ブランチ](#rule-branches)にも追加することができますし、新たなブランチに追加して新規ブランチを作成することもできます。

![Adding a new rule][img-add-rule]

ルールは、いくつかの条件が満たされた場合にのみリクエストに適用されることに注意してください。（目的のエンドポイント、方法、あるパラメーターや値の存在など）。また、それはしばしば一部のリクエスト部分のみに適用されます。リクエスト構造とルールとの相互作用をよりよく理解するために、フィルタリングノードがリクエストを[解析する方法](link-request-processing)を学びます。

ルールの条件は次のいずれかを使用して定義することができます:

* [URIコンストラクタ](#uri-constructor) - リクエストメソッドとエンドポイントを1つの文字列で指定して、ルール条件を設定することができます。
* [Advanced Edit Form](#advanced-edit-form) - URIコンストラクタを拡張して、メソッド/エンドポイントと追加のルール条件（アプリケーション、ヘッダー、クエリストリングパラメーターなど）を設定することができます。

### URIコンストラクタ

URIコンストラクタは、リクエストメソッドとエンドポイントを1つの文字列で指定することにより、ルール条件を設定することが可能にします。

#### 一般的な使い方

URIコンストラクタは以下を提供します:

* リクエストメソッドのセレクタ。メソッドが選択されていない場合、ルールは任意のメソッドのリクエストに適用されます。
* 次の値形式を受け入れるリクエストエンドポイントのフィールド:

    | 形式 | 例 |
    | ------ | ------ |
    | 包括的なURIで以下のコンポーネントを含む:<ul><li>スキーム（値は無視され、スキームを明示的に指定するには高度なフォームを使用します）</li><li>ドメインまたはIPアドレス</li><li>ポート</li><li>パス</li><li>クエリストリングパラメータ</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | URIのいくつかのコンポーネントが省略されている | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>`[header, 'HOST']` - 任意の値</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | コンポーネントの`*`で任意の非空の値を意味するURI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - 任意の非空の値（アドバンスエディットフォームでは非表示）</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - 任意の非空の値（アドバンスエディットフォームでは非表示）</li><li>`[action_ext]` - 任意の非空の値（アドバンスエディットフォームでは非表示）</li>値は `example.com/api/create/user.php` に一致し、 `example.com/create/user.php` and `example.com/api/create` には一致しない。</ul>|
    | 含むことを含めて任意の数のコンポーネントを意味する`**`のURI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>値は `example.com/api/create/user` and `example.com/api/user` に一致します。<br>値は `example.com/user`, `example.com/api/user/index.php` and `example.com/api/user/?w=delete` には一致しません。</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - 任意の非空の値 (アドバンスエディットフォームでは非表示)</li><li>`[action_ext]` - 任意の非空の値（アドバンスエディットフォームでは非表示）</li>値は `example.com/api/create/user.php` and `example.com/api/user/create/index.php` に一致します。<br>値は `example.com/api`, `example.com/api/user` and `example.com/api/create/user.php?w=delete` には一致しません。</ul> |
    | 特定のコンポーネント値を一致させる[正規表現](#condition-type-regex)でのURI（正規表現は `{{}}` で囲まれている必要があります） | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>値は `example.com/user/3445` に一致します。<br>値は `example.com/user/3445/888` and `example.com/user/3445/index.php` には一致しません。</ul> |

URIコンストラクタに指定した文字列は、自動的に[条件](#conditions)のセットに解析されます:

* `method`
* `header`. URIコンストラクタはヘッダ`HOST`のみを指定することを許しています。
* `path`, `action_name`, `action_ext`. ルール作成を確認する前に、これらのリクエスト部分の値が以下のように解析されることを確認してください:
    * 特定の`path`番号の明示的な値 + `action_name` + `action_ext`（オプション）
    * `action_name` + `action_ext`（オプション）の明示的な値
    * `action_name`および`action_ext`なしで特定の`path`番号の明示的な値
* `query`

URIコンストラクタで指定した値は、[アドバンスエディットフォーム](#advanced-edit-form)でのみ利用可能な他の条件で補完することができます。

#### ワイルドカードの使用

WallarmのURIコンストラクタでワイルドカードを使用することができますか？その答えは「いいえ」と「はい」です。「いいえ」は、ワイルドカードを[classically](https://en.wikipedia.org/wiki/Wildcard_character)使用することはできません、「はい」という意味では、次のように行動することで同じ結果を達成することができます:

* URI自体のフィールドに`*`または`**`記号を置くことで、一つまたは任意の数のコンポーネントを置き換えます（上のセクションでの例を見てください）。

**詳細**

正規表現の構文は、クラシックなワイルドカードとは異なりますが、同じ結果を達成することができます。例えば、以下のマスクを達成したいと考えています:

* `something-1.example.com/user/create.com` および
* `anything.something-2.example.com/user/create.com`

これは、クラシックなワイルドカードでは次のように取得しようとします:

* `*.example.com/user/create.com`

しかし、Wallarmでは、`something-1.example.com/user/create.com`は次のように解析されます:

![Example of parsing URI into components](../../images/user-guides/rules/something-parsed.png)

ここで `something-1.example.com`は `header`-`HOST` の条件であり、この条件の中ではワイルドカードを使用することはできませんので、代わりに正規表現を使用する必要があります: 条件のタイプをREGEXに設定し、次にWallarmの[特定の構文](#condition-type-regex)を使用します:

1. "任意の数の記号"という意味の`*`を使用しないでください。
1. 実際のドットとして解釈されることにしたい`.`を角括弧の中に置きます:

    `something-1[.]example[.]com`

1. ブラケットなしの`.`を「任意の記号」の代わりに、それを次する`*`を「前述のものの0以上の繰り返し」という量限定子として使用し、そうすると`.*`となります:

    `.*[.]example[.]com`

1. 表現がコンポーネントを終わらせるものであることを説明するために、式の最後に`$`を追加します:
    
    `.*[.]example[.]com$`

    !!! info "より簡単な方法"
        `.*`を省略し、`[.]example[.]com$`だけにすることができます。いずれの場合も、Wallarmは`[.]example[.]com$`の前に任意の文字が任意の回数現れることを仮定します。

    ![Using regular expression in header component](../../images/user-guides/rules/wildcard-regex.png)

### 高度な編集フォーム

高度な編集フォームは、[URIコンストラクタ](#uri-constructor)（メソッドとURI）の可能性を拡大し、これらだけでなく追加のルール条件、例えばアプリケーション、ヘッダー、クエリストリングパラメーターなどの設定を許可します。

#### 条件

条件は、どのリクエストパートにどの値が存在しなければならないかを示します。ルールは、そのすべての条件が満たされた場合にのみ適用されます。条件はルールの**If request is**セクションに記載されています。

現在、以下の条件が対応しています:

* **application**: アプリケーションID
* **proto**: HTTPプロトコルバージョン（1.0、1.1、2.0、...）
* **scheme**: httpまたはhttps
* **uri**: ドメインを除いたリクエストURLの部分（例:リクエスト`http://example.com/blogs/123/index.php?q=aaa`に対しては`/blogs/123/index.php?q=aaa`）
* **path**, **action_name**, **action_ext** はURIコンポーネントシーケンスの階層的なものであり:

    * **path**: `/`記号で区切られたURI部分の配列（最後のURI部分は配列に含まれません）。 URIに部分が1つしかない場合、配列は空になります。
    * **action_name**: `/`記号の後、最初のドット（`.`）までのURIの最後の部分。この部分は常にリクエストに存在しますが、値は空文字列になることもあります。
    * **action_ext**: 最後のドット(`.`）の後のURIの部分です。これはリクエストで欠けている場合があります。
* **query**: クエリストリングパラメータ。
* **header**: リクエストヘッダ。ヘッダ名を入力すると、最も一般的な値がドロップダウンリストに表示されます。例:`HOST`、 `USER-AGENT`、`COOKIE`、`X-FORWARDED-FOR`、`AUTHORIZATION`、`REFERER`、`CONTENT-TYPE`

    !!! info "`HOST`ヘッダーのルールの管理 FQDNとIPアドレス"
        `HOST`ヘッダーがFQDNに設定されている場合、その関連付けられたIPアドレスに対象とするリクエストはルールの影響を受けません。そのようなリクエストにルールを適用するには、ルールの条件で`HOST`ヘッダーの値を特定のIPに設定するか、FQDNとそのIPの両方に別のルールを作成します。

        ロードバランサの後に配置され、`HOST`ヘッダを変更するWallarmノードは、元の値ではなく更新された値に基づいてルールを適用します。例えば、バランサが`HOST`をIPからドメインに切り替えた場合、ノードはそのドメインのルールに従います。

* **method**: リクエストのメソッド。値が明示的に指定されていない場合、ルールは任意のメソッドのリクエストに適用されます。

#### 条件タイプ: EQUAL (`=`)

値は比較引数と厳密に一致しなければなりません。例えば、`example`だけがThe value `example`と一致します。

!!! info "`HOST`ヘッダー値のEQUAL条件タイプ"
    より多くのリクエストにルールを適用できるように、私たちは`HOST`ヘッダーのEQUAL条件タイプを制限しました。EQUALタイプの代わりに、任意のレジスタでパラメータ値を許可するIEQUALタイプの使用をお勧めします。

    EQUALタイプを以前に使用していた場合、それは自動的にIEQUALタイプに置き換えられます。

#### 条件タイプ: IEQUAL (`Aa`)

値は大文字小文字を問わず比較引数と一致しなければなりません。例:`example`, `ExAmple`, `exampLe` は `example`と一致します。

#### 条件タイプ: REGEX (`.*`)

値は正規表現と一致しなければなりません。

**正規表現の構文**

リクエストと正規表現の一致には、PIREライブラリが使用されます。表現の構文はほとんどが標準的ですが、下記と[PIREリポジトリのREADMEファイル](link-regex)で説明されているようにいくつかの特性があります。

??? info "正規表現の構文を表示"
    そのまま使用できる文字:

    * 小文字のラテン文字: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * 大文字のラテン文字: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * 数字: `0 1 3 4 5 6 7 8 9`
    * 特殊文字: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * ホワイトスペース

    `\`でエスケープするのではなく、`[]`の中に置かなければならない文字:

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859に基づいてASCIIに変換しなければならない文字:

    * UTF‑8文字（例：文字`ʃ`はASCIIに変換すると`Ê`となります）

    文字のグループ:

    * 改行以外の任意の文字には`.`
    * 正規表現をグルーピングし、`()`で指定の範囲や順序を決める
    * `[]`内の任意の一文字と一致するための文字列群（大文字/小文字を区別）; 特定のケースでのグループ利用には:
        * 大小文字を無視する（例:`[cC]`）
        * `[a-z]` 小文字のラテン文字のいずれかに一致
        * `[A-Z]` 大文字のラテン文字のいずれかに一致
        * `[0-9]` 任意の数字に一致
        * `[a-zA-Z0-9[.]]` 小文字のラテン文字、あるいは大文字のラテン文字、あるいは数字、あるいはドットのいずれかに一致

    論理記号:

    * `~`はNOTと等価。反転した式と文字は`()`の中に置かれなければいけない（例：`(~(a))`）
    * `|`は ORと等価
    * `&`は ANDと等価

    文字列の境界を示す文字:

    * `^`は文字列の開始
    * `$`は文字列の終了

    量限定子:

    * `*`は、前述の正規表現の0回またはそれ以上の繰り返し
    * `+`は、前述の正規表現の1回またはそれ以上の繰り返し
    * `?` は、前述の正規表現の0回または1回の繰り返し
    * `{m}` は、前述の正規表現の`m`回の繰り返し
    * `{m,n}` は、前述の正規表現の`m`回から`n`回の繰り返し; `n`を省略すると上限無制限となる

    特殊な文字の組み合わせ:

    * `^.*$`は `^.+$` に等しい（空の値は `^.*$` では一致しません）
    * `^.?$`, `^.{0,}$`, `^.{0,n}$`は `^.+$` と等しい

    一時的にサポートされていない:

    * `\W`などの文字クラス：非アルファベット文字、`\w`: アルファベット文字、`\D`: 数字以外の文字、`\d`:任意の小数、`\S`:非空白文字、`\s`:空白文字

    サポートされない構文:

    * 3桁の8進コード `\NNN`, `\oNNN`, `\ONNN`
    * `\c`を使ってコントロール文字を渡す `\cN`（例えば、`\cC`はCTRL+Cを意味します）
    * `\A` は文字列の開始を示します
    * `\z` は文字列の終了を示します
    * `\b` は文字列の端の空白文字の前後に表示されます
    * `??`, `*?`, `+?` 退廃量限定子
    * 条件文

**正規表現のテスト**

正規表現をテストするには、対応するDebianまたはUbuntuで**cpire**ユーティリティを使用することができます:

1. Wallarmリポジトリを追加します:

    === "Debian 10.x (buster)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 22.04 LTS (jammy)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
2. **cpire**ユーティリティをインストールします:

    ```bash
    sudo apt -y install libcpire-utils
    ```
3. **cpire** ユーティリティを実行します:
    ```bash
    cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
    ```
4. 正規表現と一致するかどうかをチェックするための値を入力します。ユーティリティは結果を返します:
    * `0` は、値が正規表現と一致する場合
    * `FAIL` は、値が正規表現と一致しない場合
    * エラーメッセージは、正規表現が無効な場合

    !!! warning "`\`文字の取り扱いの仕様"
        式に`\`が含まれている場合は、それを`[]`と`\`（例：`[\\]`）でエスケープしてください。

**Wallarm Consoleから追加された正規表現の例**

* <code>/.git</code>を含む任意の文字列と一致するために

    ```
    /[.]git
    ```
* <code>.example.com</code>を含む任意の文字列と一致するために

    ```
    [.]example[.]com
    ```
* <code>/.example.*.com</code>という任意の文字列と一致するために、ここで`*`は任意の記号が任意の回数現われることができます。

    ```
    /[.]example[.].*[.]com$
    ```
* すべてのIPアドレスの文字列と一致し、1.2.3.4と5.6.7.8を除くために

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* 任意の文字列が<code>/.example.com.php</code>で終わるために

    ```
    /[.]example[.]com[.]php$
    ```
* <code>sqlmap</code>を含む任意の文字列と一致し、大文字小文字が交互になっている場合: <code>sqLmAp</code>, <code>SqLMap</code>など

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* 以下のいずれかの値を含む文字列と一致するために: <code>admin\\.exe</code>, <code>admin\\.bat</code>, <code>admin\\.sh</code>, <code>cmd\\.exe</code>, <code>cmd\\.bat</code>, <code>cmd\\.sh</code>

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* 下記のいずれかの値を含む任意の文字列と一致するために: <code>onmouse</code> の大文字小文字交互、<code>onload</code>の大文字小文字交互、<code>win\\.ini</code>, <code>prompt</code>

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* 任意の `Mozilla`で始まる文字列と一致し、`1aa875F49III`という文字列を含まないための表現

    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* 次のいずれかの値で始まる任意の文字列に一致する: `python-requests/`, `PostmanRuntime/`, `okhttp/3.14.0`, `node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### 条件タイプ: ABSENT (`∅`)

リクエストは指定された部分を含んではなりません。この場合、比較引数は使用されません。

## ルールセットのライフサイクル

作成されたすべてのルールはカスタムルールセットを形成します。Wallarmノードは、着信リクエストの解析中にカスタムルールセットに依存します。

カスタムルールの変更は即座には効果を発揮しません。変更はカスタムルールセットの**構築**と**フィルタリングノードへのアップロード**が完了した後のみ、リクエスト解析プロセスに適用されます。

### カスタムルールセットの構築

Wallarm Consoleの**Rules**から新規ルールの追加、既存ルールの削除または変更はカスタムルールセットの構築を起動します。構築プロセス中、ルールは最適化され、フィルタリングノードを適用する形式にコンパイルされます。カスタムルールセットの構築プロセスには通常、少数のルールに対しては数秒、複雑なルールツリーに対しては最大1時間ほどかかります。

カスタムルールセットの構築状況と予想完了時間はWallarm Consoleで表示されます。進行中の構築がない場合、インターフェースには最後に完了した構築の日付が表示されます。

![Build status](../../images/user-guides/rules/build-rules-status.png)

### フィルタリングノードへのアップロード

カスタムルールセットのビルドは、フィルタリングノードとWallarm Cloudの同期の間にフィルタリングノードにアップロードされます。デフォルトでは、フィルタリングノードとWallarm Cloudの同期は2〜4分ごとに起動します。[フィルタリングノードとWallarm Cloudの同期構成の詳細→](../../admin-en/configure-cloud-node-synchronization-en.md)

カスタムルールセットのフィルタリングノードへのアップロードステータスは、`/var/log/wallarm/syncnode.log`または`/opt/wallarm/var/log/wallarm/syncnode-out.log` ファイルに記録されます。[ノードのインストール方法により異なる](../../admin-en/configure-logging.md)。

すべてのWallarmノードは、同じWallarmアカウントに接続されており、トラフィックフィルタリングのためのデフォルトとカスタムルールの両方のセットを受け取ります。それでも適切なアプリケーションIDや一意のHTTPリクエストパラメータ（ヘッダ、クエリストリングパラメータなど）を使用して、異なるアプリケーションに異なるルールを適用することができます。

### バックアップおよび復元

誤って設定したルールや削除したルールから自己を保護するために、現在のカスタムルールセットをバックアップできます。

以下のルールのバックアップのオプションがあります:

* [カスタムルールセット構築](#custom-ruleset-building)の後に自動バックアップを作成します。自動バックアップの数は、7つに制限されています:ルールを複数回変更した日ごとに、最後のバックアップだけが保持されます。
* 手動で任意のタイミングでバックアップを作成します。手動バックアップの数はデフォルトで5つに制限されています。それ以上のものが必要な場合は、[Wallarm技術サポート](mailto:support@wallarm.com)チームにご連絡ください。

次の操作が可能です:

* 現在のバックアップにアクセスします： **Rules**セクションで**Backups**をクリックします。
* 新しいバックアップを手動で作成します：**Backups**ウィンドウで**Create backup**をクリックします。
* 手動バックアップに名前と説明を設定し、それらをいつでも編集します。

    !!! info "自動バックアップの命名"
        自動バックアップはシステムによって命名され、名前を変更することはできません。

* 既存のバックアップから読み込みます:必要なバックアップについて**Load**をクリックします。バックアップからの読み込みでは、現在のルール設定が削除され、バックアップからの設定で置き換えられます。
* バックアップを削除します。

    ![Rules - Creating backup](../../images/user-guides/rules/rules-create-backup.png)

!!! warning "ルールの変更制限"
    バックアップの作成またはバックアップからのロードが完了するまで、ルールの作成や変更はできません。

## ルールを取得するためのAPI呼び出し

カスタムルールを取得するために、[Wallarm APIを直接呼び出すことができます](../../api/request-examples.md#get-all-configured-rules).