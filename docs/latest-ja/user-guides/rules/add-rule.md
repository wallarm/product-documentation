[link-request-processing]: request-processing.md
[link-regex]: https://github.com/yandex/pire
[link-filter-mode-rule]: wallarm-mode-rule.md
[link-sensitive-data-rule]: sensitive-data-rule.md
[link-virtual-patch]: vpatch-rule.md
[link-regex-rule]: regex-rule.md

[img-add-rule]: ../../images/user-guides/rules/add-rule.png

# アプリケーションプロファイルへのルールの追加

新しいルールを追加するには、「ルール」タブへ移動します。

ルールは、既存および新規のブランチに追加できます。既存のブランチに基づいて作成するか、ゼロから作成することができます。

既存のブランチにルールを追加するには、「ルールを追加」をクリックします（マウスカーソルをブランチの説明行の上にホバーさせると、右側のポップアップメニューにボタンが表示されます）。この操作は、ブランチのルールページでも実行できます。

必要に応じて、ルールの追加先のブランチを変更することができます。ブランチの説明の条件を変更するには、ルールの追加フォームの「リクエストが」句をクリックします。新しいブランチが作成されると、画面に表示され、アプリケーションの構造ビューが更新されます。

![新規ルールの追加][img-add-rule]


## ブランチの説明

ブランチの説明は、HTTPリクエストが満たさなければならないさまざまなパラメータの条件セットで構成されています。そうでなければ、このブランチに関連付けられたルールは適用されません。ルール追加フォームの「リクエストが」セクションの各行は、3つのフィールドから成る別々の条件を参照します：ポイント、型、比較引数。すべての条件が満たされた場合にのみ、リクエストにブランチに記述されたルールが適用されます。

**URIコンストラクタ**および**詳細編集フォーム**のどちらを使用しても、条件セットを設定することができます。

### URIコンストラクタ

#### URIコンストラクタとの作業

URIコンストラクタは、リクエストメソッドとエンドポイントを1つの文字列で指定することにより、ルール条件を設定することができます。

* リクエストメソッドについては、URIコンストラクタが特定のセレクタを提供します。メソッドが選択されていない場合、ルールは任意のメソッドを持つリクエストに適用されます。
* リクエストのエンドポイントについては、URIコンストラクタが次の値の形式を受け入れる特定のフィールドを提供します。

    | 形式 | 例とリクエストポイントの値 |
    | ------ | ------ |
    | 次のコンポーネントを含む完全なURI：<ul><li>スキーム（値は無視され、詳細フォームを使用してスキームを明示的に指定することができます）</li><li>ドメイン</li><li>ポート</li><li>パス</li><li>クエリ文字列パラメータ</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | 一部のコンポーネントが省略されたURI | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>``[header, 'HOST']` - 任意の値</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | コンポーネントの任意の非空の値を意味する `*` を含むURI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - 任意の非空の値（詳細編集フォームでは非表示）</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - 任意の非空の値（詳細編集フォームでは非表示）</li><li>`[action_ext]` - 任意の非空の値（詳細編集フォームでは非表示）</li>値が `example.com/api/create/user.php` に一致<br>そして `example.com/create/user.php` および `example.com/api/create` には一致しません。</ul>|
    | コンポーネントの任意の数、またはその欠如を意味する `**` を含むURI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>値が `example.com/api/create/user` および `example.com/api/user` に一致します。<br>値が `example.com/user`、`example.com/api/user/index.php`、`example.com/api/user/?w=delete` には一致しません。</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - 任意の非空の値（詳細編集フォームでは非表示）</li><li>`[action_ext]` - 任意の非空の値（詳細編集フォームでは非表示）</li>値が `example.com/api/create/user.php` および `example.com/api/user/create/index.php` に一致<br>そして、 `example.com/api`、`example.com/api/user`および`example.com/api/create/user.php?w=delete` には一致しません。</ul> |
    | 特定のコンポーネントの値と一致する[正規表現](#condition-type-regexp)を含むURI（正規表現は `{{}}` で囲む必要があります） | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>値が `example.com/user/3445` に一致<br>そして、 `example.com/user/3445/888` と `example.com/user/3445/index.php` には一致しません。</ul> |

URIコンストラクタで指定された文字列は、以下の[リクエストポイント](#points)のための条件セットに自動的に解析されます。

* `method`
* `header`. URIコンストラクタは、ヘッダー`HOST`のみを指定することを許可します。
* `path`, `action_name`, `action_ext`. ルール作成を確認する前に、これらのリクエストポイントの値が以下のいずれかの方法で解析されていることを確認してください:
    * 特定の`path`番号の明確な値 + `action_name` + `action_ext`（オプション）
    * `action_name` + `action_ext`の明確な値（オプション）
    * `action_name`と`action_ext`がない特定の`path`番号の明確な値
* `query`

URIコンストラクタで指定された値は、[詳細編集フォーム](#advanced-edit-form)でのみ利用可能な他のリクエストポイントで補完できます。

#### ワイルドカードの使用

WallarmのURIコンストラクタでワイルドカードを使用できますか？　「いいえ」と「はい」の両方の答えがあります。「いいえ」は[古典的な](https://en.wikipedia.org/wiki/Wildcard_character)ワイルドカードを使用できないことを意味し、「はい」は次のように行動することで同じ結果を得られることを意味します：

* URIの解析されたコンポーネント内にワイルドカードの代わりに正規表現を使用します。
* フィールド自体に `*` や `**` シンボルを置くと、コンポーネントの一つまたは任意の数を置き換えます（上のセクションの[例](#working-with-uri-constructor)を参照してください）。

**詳細情報**

正規表現の構文は古典的なワイルドカードとは異なりますが、同じ結果を得ることができます。例えば、次のマスクに対応するものを取得したいとします：

* `something-1.example.com/user/create.com` と
* `anything.something-2.example.com/user/create.com`

...これを古典的なワイルドカードでは次のように試すでしょう：

* `*.example.com/user/create.com`

しかし、Wallarmでは、`something-1.example.com/user/create.com` は次のように解析されます：

![URIのコンポーネントへの解析の例](../../images/user-guides/rules/something-parsed.png)

...ここで `something-1.example.com` は `header`-`HOST` ポイントです。ワイルドカードをポイント内で使用できないことに注意してください。代わりに、正規表現を使用する必要があります: 条件タイプはREGEXに設定し、次に、Wallarmの正規表現[特定の構文](#condition-type-regex)を使用します：

1. "任意の数のシンボル"という意味で `*` を使用しないでください。
1. "実際のドット"として解釈されるべき `.` を角括弧で囲ってください：

    `something-1[.]example[.]com`

1. "任意のシンボル"の代わりに `[` なしの `.` を使用し、それを先行する "0回以上繰り返す"という数量詞 `*` と共に使用します。したがって `.*` と入力します。
    
    `.*[.]example[.]com`

1. 表現の終端に `$` を追加して、自分たちが作成したものがコンポーネントの終端であることを指示します：
    
    `.*[.]example[.]com$`

    !!! info "より簡単な方法"
        `[.]example[.]com$` の前の `.*` を省略することも可能です。どちらの場合も、 `[.]example[.]com$` の前に任意の文字が任意の回数出現できるとWallarmは想定します。

    ![ヘッダーコンポーネントでの正規表現の使用](../../images/user-guides/rules/wildcard-regex.png)

### 詳細編集フォーム

#### ポイント

*ポイント* フィールドは、比較のためにリクエストから抽出するべきパラメーター値を示します。現在、フィルターノードが分析できるすべてのポイントがサポートされているわけではありません。

現在サポートされているポイントは次のとおりです：

* **application**: アプリケーションID。
* **proto**: HTTPプロトコルのバージョン（1.0、1.1、2.0など）。
* **scheme**: httpまたはhttps。
* **uri**: リクエストURLのドメインを除いた部分（たとえば、リクエストが `http://example.com/blogs/123/index.php?q=aaa` に送信されると、 `/blogs/123/index.php?q=aaa` が該当します）。
* **path**、**action_name**、**action_ext** は階層的なURIコンポーネントのシーケンスで、次のようになります：

    * **path**: `/` 記号で区切られたURIパーツの配列（最後のURIパーツは配列に含まれません）。URIに部分が1つしかない場合、配列は空になります。
    * **action_name**: `/` 記号の後、最初のピリオド (`.`) の前のURIの最後の部分。この部分のURIは常にリクエストに存在しますが、その値は空文字列になることがあります。
    * **action_ext**: 最後のピリオド (`.`) の後のURIの部分。リクエストに存在しないことがあります。
* **query**: クエリ文字列のパラメータ。
* **header**: リクエストヘッダー。ヘッダ名を入力すると、最も一般的な値がドロップダウンリストに表示されます。例：`HOST`、`USER-AGENT`、`COOKIE`、`X-FORWARDED-FOR`、`AUTHORIZATION`、`REFERER`、`CONTENT-TYPE`。
* **method**: リクエストメソッド。値が明示的に指定されていない場合、ルールは任意のメソッドを持つリクエストに適用されます。

#### 条件タイプ: EQUAL (`=`)

ポイントの値は、比較引数と厳密に一致しなければなりません。たとえば、`example` のポイント値は `example` のみと一致します。

!!! info "HOSTヘッダー値のEQUAL条件タイプ"
    より多くのリクエストにルールを適用できるように、HOSTヘッダーに対するEQUAL条件タイプを制限しています。EQUALタイプの代わりに、任意の登録を許可するタイプのIEQUALを使用することをお勧めします。
    
    以前にEQUALタイプを使用していた場合、IEQUALタイプに自動的に置き換えられます。

#### 条件タイプ: IEQUAL (`Aa`)

ポイントの値は、比較引数と任意のケースで一致しなければなりません。たとえば：`example`、`ExAmple`、`exampLe` は `example` のポイント値と一致します。

#### 条件タイプ: REGEX (`.*`)

ポイントの値は、定期的な表現と一致しなければなりません。

**正規表現の構文**

リクエストと正規表現を一致させるために、PIREライブラリが使用されます。表現の構文は概ね標準的ですが、以下および[PIREリポジトリ][link-regex]のREADMEファイルに説明されているように、いくつかの特性があります。

??? info "正規表現の構文を表示"
    そのまま使用できる文字：

    * 小文字のラテン文字：`a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * 大文字のラテン文字：`A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * 数字：`0 1 3 4 5 6 7 8 9`
    * 特殊文字：<code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * スペース

    `\` でエスケープするのではなく、 `[]` の中に置く必要がある文字：

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859に従ってASCIIに変換する必要がある文字：

    * UTF‑8文字（たとえば、ASCIIに変換された文字 `ʃ` は `Ê`）

    文字グループ：

    * `.` 改行以外の任意の文字
    * `()` 正規表現のグルーピング、 `()` 内の存在するシンボルの検索または優先順位の確立のため
    * `[]` `[]` 内に存在する単一の文字に一致する（大文字小文字を区別）；グループは以下の特殊なケースで使用できる：
        * 大文字小文字を無視する場合（たとえば、 `[cC]`）
        * `[a-z]` 小文字のラテン文字の1つに一致
        * `[A-Z]` 大文字のラテン文字の1つに一致
        * `[0-9]` 数字の1つに一致
        * `[a-zA-Z0-9[.]]` 小文字、もしくは大文字のラテン文字、もしくは数字、もしくはドットのいずれかに一致する

    論理文字：

    * `~` は NOT と等しい。逆行表現と文字は `()` に置く必要があります。<br>例えば：`(~(a))`
    * `|` は OR と等しい
    * `&` は AND と等しい

    文字列の境界を指定する文字：

    * `^` 文字列の始めを意味します
    * `$` 文字列の終わりを意味します

    量化子：

    * `*` 直前の正規表現の0回以上の繰り返し
    * `+` 直前の正規表現の1回以上の繰り返し
    * `?` 直前の正規表現の0回または1回の繰り返し
    * `{m}` 直前の正規表現の `m` 回の繰り返し
    * `{m,n}` 直前の正規表現の `m` 回から `n` 回の繰り返し； `n` を省略すると上限が無限になる

    特定の操作で動作する文字の組み合わせ：

    * `^.*$` は `^.+$` と等しい（空の値は `^.*$` とは一致しません）
    * `^.?$`, `^.{0,}$`, `^.{0,n}$` は `^.+$` と等しい

    一時的にサポートされていない：

    * 文字クラス（`\W` 非文字、「\w」文字、「\D」数字以外の任意、`\d` あらゆる十進数、「\S」非空白、「\s」空白）。

    サポートされていない構文：

    * 3桁の8進数コード `\NNN`、`\oNNN`、`\ONNN`
    * `\cN` を通じてコントロール文字を渡すための `\c` （たとえば、`\cC` はCTRL+C）
    * `\A` 文字列の始まり
    * `\z` 文字列の終わり
    * `\b` 文字列の終わりの空白文字の前または後
    * `??`, `*?`, `+?` レイジー量指定子
    * 条件句

**正規表現のテスト**

正規表現をテストするには、サポートされるDebianまたはUbuntuで **cpire** ユーティリティを使用できます：

1. Wallarmリポジトリを追加します：

    === "Debian 10.x (buster)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 22.04 LTS (jammy)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
2. **cpire** ユーティリティをインストールします：

    ```bash
    sudo apt -y install libcpire-utils
    ```
3. **cpire** ユーティリティを実行します：
    ```bash
    cpire-runner -R '<YOUR_REGULAR_EXPRESSION>'
    ```
4. 正規表現と一致するかどうかを確認する値を入力します。ユーティリティは結果を返します：
    * バリューが正規表現と一致する場合は `0`
    * 値が正規表現と一致しない場合は `FAIL`
    * 正規表現が無効な場合はエラーメッセージ

    !!! warning "\\ 文字の処理の特性"
        エクスプレッションに `\` が含まれている場合は、 `[]` と `\` （つまり、 `[\\]`）でエスケープする必要があります。

**経路情報のルールの正規表現の例**

*  `/.git` を含む任意の文字列に一致する

    ```
    /[.]git
    ```
*  `.example.com` を含む任意の文字列に一致する

    ```
    [.]example[.]com
    ```
* `/.example.*.com` で終わる任意の文字列に一致する、ここで `*` は任意のシンボルが任意の回数繰り返されることを意味します

    ```
    /[.]example[.].*[.]com$
    ```
* `1.2.3.4` と `5.6.7.8` を除くすべての IP アドレスに一致

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* `/.example.com.php` で終わる任意の文字列に一致する

    ```
    /[.]example[.]com[.]php$
    ```
* `sqlmap` を含む任意の文字列に一致する、文字は大文字小文字を区別しない：`sqLmAp`、`SqLMap`など

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* 以下の値のうち一つ以上を含む任意の文字列に一致する：`admin\\.exe`、`admin\\.bat`、`admin\\.sh`、`cmd\\.exe`、`cmd\\.bat`、`cmd\\.sh`

    ```
    (admin|cmd)[\].(exe|bat|sh)
    ```
* 以下の値のうち一つ以上を含む任意の文字列に一致する：大文字小文字を区別しない `onmouse`、大文字小文字を区別しない `onload`、`win\\.ini`、`prompt`

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\].ini|prompt
    ```
* `Mozilla` で始まる任意の文字列に一致する、ただし `1aa875F49III` という文字列を含まない
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* 以下の値のうちいずれか開始する任意の文字列と一致 : `python-requests/`、`PostmanRuntime/`、`okhttp/3.14.0`、`node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### 条件タイプ: ABSENT (`∅`)

リクエストには指定したポイントが含まれていないはずです。この場合、比較引数は使用されません。

## ルール

追加されたリクエスト処理ルールは、「Then」セクションで説明されます。

以下のルールがサポートされています：

* [パーサーの無効化／有効化](disable-request-parsers.md)
* [サーバー応答ヘッダーの変更](add-replace-response-header.md)
* [フィルタリングモードの設定][link-filter-mode-rule]
* [機密データのマスキング][link-sensitive-data-rule]
* [アクティブな脅威検証のモードの設定](../../vulnerability-detection/active-threat-verification/enable-disable-active-threat-verification.md)
* [アクティブな検証の前の攻撃の書き換え](../../vulnerability-detection/active-threat-verification/modify-requests-before-replay.md)
* [仮想パッチの適用][link-virtual-patch]
* [ユーザー定義の検出ルール][link-regex-rule]
* [特定の攻撃タイプの無視](ignore-attack-types.md)
* [バイナリデータ中の特定の攻撃記号の無視](ignore-attacks-in-binary-data.md)
* [overlimit_res攻撃検出の調整](configure-overlimit-res-detection.md)
