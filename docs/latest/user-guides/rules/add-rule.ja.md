[link-request-processing]:      request-processing.ja.md
[link-regex]:                   https://github.com/yandex/pire
[link-filter-mode-rule]:        wallarm-mode-rule.ja.md
[link-sensitive-data-rule]:     sensitive-data-rule.ja.md
[link-virtual-patch]:           vpatch-rule.ja.md
[link-regex-rule]:              regex-rule.ja.md

[img-add-rule]:     ../../images/user-guides/rules/add-rule.png

# アプリケーションプロファイルにルールを追加する

新しいルールを追加するには、*ルール*タブに移動します。

ルールは、既存のブランチと新しいブランチの両方に追加できます。既存のブランチを元に作成することも、新規に作成することもできます。

既存のブランチにルールを追加するには、*ルールを追加*をクリックします（ブランチ説明行の上にマウスカーソルを置くと、ボタンが右側のポップアップメニューに表示されます）。また、このブランチのルールページでこの操作を行うこともできます。

必要に応じて、ルールが追加されるブランチを変更することができます。そのためには、ルール追加フォームの*リクエストが*句をクリックし、ブランチ説明条件に変更を加えます。新しいブランチが作成されると、画面に表示され、アプリケーション構造ビューが更新されます。

![!新しいルールを追加する][img-add-rule]


## ブランチの説明

ブランチの説明は、HTTPリクエストが満たす必要がある様々なパラメータの条件のセットで構成されており、それ以外の場合は、このブランチに関連付けられたルールは適用されません。ルール追加フォームの*リクエストが*セクションの各行は、ポイント、タイプ、比較引数の3つのフィールドで構成される個別の条件を参照します。ブランチ内に記述されているルールは、すべての条件が満たされた場合にのみリクエストに適用されます。

条件セットを設定するために、**URIコンストラクタ**と**詳細編集フォーム**の両方が使用できます。

### URIコンストラクタ

#### URIコンストラクタを使用した操作

URIコンストラクタは、リクエスト方法とエンドポイントを1つの文字列で指定することによって、ルール条件を構成できます。

* リクエスト方法については、URIコンストラクタが特定のセレクタを提供しています。メソッドが選択されていない場合、ルールは任意の方法でリクエストに適用されます。
* リクエストエンドポイントについては、URIコンストラクタが以下の値形式を受け付ける特定のフィールドを提供しています：

    | 形式 | 例やリクエストポイントの値 |
    | ------ | ------ |
    | スキーム(詳細フォームを使って明示的にスキームを指定できます。値は無視されます。)、ドメイン、ポート、パス、クエリ文字列パラメータを含む完全なURI | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | いくつかのコンポーネントが省略されたURI | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>``[header, 'HOST']` - 任意の値</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | コンポーネントの任意の非空値を意味する`*`があるURI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - 任意の非空値（詳細編集フォームでは非表示）</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - 任意の非空値（詳細編集フォームでは非表示）</li><li>`[action_ext]` - 任意の非空値（詳細編集フォームでは非表示）</li>値は `example.com/api/create/user.php` に一致し、`example.com/create/user.php` および `example.com/api/create` には一致しません。</ul>|
    | その存在を含む任意の数のコンポーネントを意味する`**`があるURI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>値は `example.com/api/create/user` および `example.com/api/user` に一致します。<br>値は `example.com/user`、`example.com/api/user/index.php`、および `example.com/api/user/?w=delete` に一致しません。</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - 任意の非空値（詳細編集フォームでは非表示）</li><li>`[action_ext]` - 任意の非空値（詳細編集フォームでは非表示）</li>値は `example.com/api/create/user.php` および `example.com/api/user/create/index.php` に一致し、`example.com/api`、`example.com/api/user`、および `example.com/api/create/user.php?w=delete` には一致しません。</ul> |
    | 特定のコンポーネント値に一致する[正規表現](#condition-type-regexp)を持つURI（正規表現は `{{}}` でラップする必要があります） | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>値は `example.com/user/3445` に一致し、`example.com/user/3445/888` や `example.com/user/3445/index.php` には一致しません。</ul> |

URIコンストラクタで指定された文字列は、以下の[リクエストポイント](#points)の条件セットに自動的にパースされます。

* `method`
* `header`。URIコンストラクタは、`HOST`ヘッダーのみを指定できます。
* `path`、`action_name`、`action_ext`。ルール作成を確定する前に、これらのリクエストポイントの値が次のいずれかの方法でパースされていることを確認してください:
    * 特定の`path`番号の明示的な値 + `action_name` + `action_ext`（オプション）
    * `action_name` + `action_ext`（オプション）の明示的な値
    * `action_name`および`action_ext`なしで特定の`path`番号の明示的な値
* `query`

URIコンストラクタで指定された値は、[詳細編集フォーム](#advanced-edit-form)でのみ使用可能な他のリクエストポイントで補完できます。#### ワイルドカードの使用

WallarmのURIコンストラクタでワイルドカードを使用できますか？ いいえ、そしてはい。 "いいえ"は、[クラシカル](https://en.wikipedia.org/wiki/Wildcard_character)な方法でそれらを使用できないことを意味します。 "はい"は、以下のようにして同じ結果を得ることができることを意味します。

* URIのパースされたコンポーネント内では、ワイルドカードの代わりに正規表現を使用します。
* URIフィールド自体に`*`または`**`記号を配置して、1つまたは複数のコンポーネントを置き換えます（[上記](#working-with-uri-constructor)のセクションでの例を参照）。

**いくつかの詳細**

正規表現の構文はクラシカルなワイルドカードと異なりますが、同じ結果が得られます。例えば、以下に対応するマスクを取得したい場合：

* `something-1.example.com/user/create.com` および
* `anything.something-2.example.com/user/create.com`

...クラシカルなワイルドカードでは、次のように入力することで取得しようとします。

* `*.example.com/user/create.com`

しかし、Wallarmでは、`something-1.example.com/user/create.com`が次のように解析されます。

![!URIをコンポーネントに解析する例](../../images/user-guides/rules/something-parsed.png)

...ここで`something-1.example.com`は`header`-`HOST`ポイントです。ポイント内でワイルドカードを使用できないことを述べました。そのため、代わりに正規表現を使用する必要があります。条件タイプをREGEXに設定し、Wallarm [固有の構文](#condition-type-regex)を使用します。

1. 任意の数の記号を意味する `*` を使わない。
1. 実際のドットとして解釈される `.` を角かっこで囲む。

    `something-1[.]example[.]com`

1. 任意の記号を置き換えるために `.` を使い、それに前の "0回またはそれ以上の繰り返し" という意味の `*` を続けて使う：

    `.*[.]example[.]com`

1. 作成したものがコンポーネントを終了することを示すために、式の最後に `$` を追加する：

    `.*[.]example[.]com$`

    !!! info "より簡単な方法"
        `.*`を省略して、`[.]example[.]com$`だけにすることができます。どちらの場合も、Wallarmは、`[.]example[.]com$`の前に任意の文字が任意の回数表示されることを想定しています。

    ![!ヘッダーコンポーネントでの正規表現の使用](../../images/user-guides/rules/wildcard-regex.png)

### 応用編集フォーム

#### ポイント

*ポイント*フィールドは、リクエストから比較のために抽出されるべきパラメータ値を示します。現時点では、フィルタノードで解析できるすべてのポイントがサポートされているわけではありません。

現在、次のポイントがサポートされています。

* **application**: アプリケーションID。
* **proto**: HTTPプロトコルバージョン（1.0、1.1、2.0、...）。
* **scheme**: httpまたはhttps。
* **uri**: ドメインを除いたリクエストURLの一部（たとえば、`http://example.com/blogs/123/index.php?q=aaa`に送信されたリクエストの場合、`/blogs/123/index.php?q=aaa`）。
* **path**、**action_name**、**action_ext** は階層的なURIコンポーネントシーケンスで、次のようになります。

    * **path**: `/`記号で区切られたURI部分の配列（最後のURI部分は配列に含まれません）。URIに1つの部分しかない場合、配列は空になります。
    * **action_name**: 最後の `/` 記号の後と最初のピリオド（ `.` ）の前にあるURIの一部。このURIの部分は、値が空文字列であってもリクエストに常に表示されます。
    * **action_ext**: 最後のピリオド（ `.` ）の後にあるURIの部分。リクエストに含まれていない場合があります。
* **query**: クエリ文字列パラメータ。
* **header**: リクエストヘッダー。ヘッダー名を入力すると、最も一般的な値がドロップダウンリストに表示されます。例：`HOST`、`USER-AGENT`、`COOKIE`、`X-FORWARDED-FOR`、`AUTHORIZATION`、`REFERER`、`CONTENT-TYPE`。
* **method**: リクエスト方法。値が明示的に指定されていない場合、ルールは任意の方法でのリクエストに適用されます。

#### 条件タイプ: EQUAL (`=`)

ポイント値は、比較引数と正確に一致する必要があります。例えば、`example`はポイント値`example`と一致します。

!!! info "HOSTヘッダー値のEQUAL条件タイプ"
    より多くのリクエストにルールを適用するために、HOSTヘッダーのEQUAL条件タイプを制限しました。EQUALタイプの代わりに、任意のレジスタでのパラメータ値を許可するIEQUALタイプを使用することをお勧めします。

    以前にEQUALタイプを使用していた場合、それは自動的にIEQUALタイプに置き換えられます。

#### 条件タイプ: IEQUAL (`Aa`)

ポイント値は、比較引数に対してどのようなケースでも一致しなければなりません。例：`example`、`ExAmple`、`exampLe`は、`example`のポイント値と一致します。#### 条件タイプ: REGEX（`.*`）

ポイントの値は、正規表現と一致しなければなりません。

**正規表現の構文**

リクエストと正規表現を照合するために、PIREライブラリが使用されます。主に、式の構文は標準的ですが、以下で説明するように、いくつかの特定の事象があります。[PIREリポジトリ][link-regex]のREADMEファイル。

??? info "正規表現の構文を表示"
    そのまま使用できる文字：

    * 小文字のラテン文字： `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * 大文字のラテン文字： `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * 数字： `0 1 3 4 5 6 7 8 9`
    * 特殊文字：<code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * 空白文字

    `\`でエスケープするのではなく、角括弧 `[]`に入れる必要がある文字：

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859によってASCIIに変換する必要がある文字：

    * UTF‑8文字（例えば、ASCIIに変換された文字`ʃ`は`Ê`）

    文字グループ：

    * 改行以外の任意の文字には`.` 
    * 正規表現をグルーピングし、`()`内の記号を検索するか、優先順位を確立するための`()` 
    * `[]`内に存在する単一の文字（大文字と小文字を区別）；グループは、特定のケースで使用できます：
        * 大文字と小文字を区別しない場合（例：`[cC]`）
        * `[a-z]` は小文字のラテン文字のいずれかと一致します
        * `[A-Z]` は大文字のラテン文字のいずれかと一致します
        * `[0-9]` は数字のいずれかと一致します
        * `[a-zA-Z0-9[.]]` は小文字または大文字のラテン文字、数字、またはドットのいずれかと一致します

    論理文字：

    * `~` はNOTに等しい。反転した式と文字は `()` 内に配置する必要があります<br>例：`(~(a))`
    * `|` はORに等しい
    * `&` はANDに等しい

    文字列の境界を指定する文字：

    * 文字列の開始には `^`
    * 文字列の終わりには `$`

    量詞：

    * 右前の正規表現を0回以上繰り返す場合は `*`
    * 右前の正規表現を1回以上繰り返す場合は `+`
    * 右前の正規表現を0回または1回繰り返す場合は `?`
    * 右前の正規表現を`m`回繰り返す場合は `{m}`
    * 右前の正規表現を`m`から`n`回繰り返す場合は `{m,n}`；`n`を省略すると上限が無限になります

    特定の条件で動作する文字の組み合わせ：

    * `^.*$` は `^.+$` に等しい（空の値は `^.*$` には一致しません）
    * `^.?$`, `^.{0,}$`, `^.{0,n}$` は `^.+$` に等しい

    一時的にサポートされていない：

    * 文字クラスのようなもの `\W` は非アルファベット、`\w` はアルファベット、`\D` は任意の非数字、`\d` は任意の10進数、`\S` は非空白、`\s` は空白文字

    サポートされていない構文：

    * 3桁の8進数コード `\NNN`, `\oNNN`, `\ONNN`
    * `\cN` を使ってコントロール文字を渡す `\c` （例：CTRL+Cの場合は`\cC`）
    * 文字列の開始には `\A`
    * 文字列の終わりには `\z`
    *          文字列の最後の空白文字の前後には `\b`
    * `??`, `*?`, `+?` 遅い量子
    * 条件式

**正規表現のテスト**

正規表現をテストするには、対応するDebianまたはUbuntuで **cpire** ユーティリティを使用できます。

1. Wallarmリポジトリを追加します：

    === "Debian 10.x (buster)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update
        sudo apt -y install dirmngr
        curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 22.04 LTS (jammy)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
2. **cpire** ユーティリティをインストールします：

    ```bash
    sudo apt -y install libcpire-utils
    ```
3. **cpire** ユーティリティを実行します：
    ```bash
    cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
    ```
4. 正規表現と照合するかどうかを確認する値を入力します。ユーティリティは、次の結果を返します。
    * 値が正規表現と一致する場合は `0`
    * 値が正規表現と一致しない場合は `FAIL`
    * 正規表現が無効な場合はエラーメッセージ

    !!! warning "`\`文字の処理に関する具体例"
        式に`\`が含まれている場合、`[]`および`\`（例えば、`[\\]`）でエスケープしてください。

**Wallarmコンソールを介して追加された正規表現の例**

* <code>/.git</code> を含む任意の文字列に一致する場合

    ```
    /[.]git
    ```
* <code>.example.com</code> を含む任意の文字列に一致する場合

    ```
    [.]example[.]com
    ```
* `*` が任意の記号で任意の回数繰り返された場合に、<code>/.example.*.com</code> で終わる任意の文字列に一致する場合

    ```
    /[.]example[.].*[.]com$
    ```
* IPアドレスがすべて一致し、1.2.3.4および5.6.7.8を除外する場合

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* 文字列が<code>/.example.com.php</code>で終わる場合に一致します。

    ```
    /[.]example[.]com[.]php$
    ```
* <code>sqlmap</code> が大文字小文字を含む文字列に一致する場合： <code>sqLmAp</code>, <code>SqLMap</code> など

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* <code>admin\\.exe</code>、<code>admin\\.bat</code>、<code>admin\\.sh</code>、<code>cmd\\.exe</code>、<code>cmd\\.bat</code>、<code>cmd\\.sh</code> など、1つまたは複数の値を含む文字列に一致する場合

    ```
    (admin|cmd)[\].(exe|bat|sh)
    ```
* いずれかの値が含まれる文字列に一致する場合：<code>onmouse</code> を大文字と小文字で、<code>onload</code> を大文字と小文字で、<code>win\\.ini</code>、<code>prompt</code>

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\].ini|prompt
    ```
* 文字列が `Mozilla` で始まり、文字列 `1aa875F49III` を含まない場合に一致します。

    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* 文字列がいずれかの値を持っている場合に一致します：`python-requests/`、`PostmanRuntime/`、`okhttp/3.14.0`、`node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### 条件タイプ: ABSENT（`∅`）

リクエストには、指定したポイントが含まれていない必要があります。この場合、比較引数は使用されません。## ルール

追加されたリクエスト処理ルールは、*Then*セクションで説明されています。

以下のルールがサポートされています：

* [パーサを無効/有効にする](disable-request-parsers.ja.md)
* [サーバー応答ヘッダーを変更する](add-replace-response-header.ja.md)
* [フィルタリングモードを設定する][link-filter-mode-rule]
* [機密データをマスクする][link-sensitive-data-rule]
* [アクティブな脅威検証のモードを設定する](change-request-for-active-verification.ja.md#disabling-enabling-the-active-threat-verification-module)
* [アクティブ検証前にアタックを書き換える](change-request-for-active-verification.ja.md#rewriting-the-request-before-attack-replaying)
* [仮想パッチを適用する][link-virtual-patch]
* [ユーザー定義の検出ルール][link-regex-rule]
* [特定のアタックタイプを無視する](ignore-attack-types.ja.md)
* [バイナリデータ内の特定の攻撃サインを無視する](ignore-attacks-in-binary-data.ja.md)
* [overlimit_resアタック検出を微調整する](configure-overlimit-res-detection.ja.md)