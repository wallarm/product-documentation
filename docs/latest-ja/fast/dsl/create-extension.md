[link-points]:          points/intro.md
[link-detect]:          detect/phase-detect.md
[link-collect]:         phase-collect.md
[link-match]:           phase-match.md
[link-modify]:          phase-modify.md
[link-send]:            phase-send.md
[link-generate]:        phase-generate.md
[link-extensions]:      using-extension.md
[link-ext-logic]:       logic.md
[link-vuln-list]:       ../vuln-list.md

[img-vulns]:            ../../images/fast/dsl/en/create-extension/vulnerabilities.png
[img-vuln-details]:     ../../images/fast/dsl/en/create-extension/vuln_details.png

[anchor-meta-info]:     #meta-infoセクションの構造

# FAST拡張の作成

!!! info "リクエスト要素説明シンタックス"
    FASTの拡張を作成する際、アプリケーションに送信されたHTTPリクエストの構造と、アプリケーションから受信したHTTPレスポンスの構造を理解する必要があります。これにより、pointsを使用して作業する必要があるリクエスト要素を正確に説明することができます。

    詳細な情報については、この[リンク][link-points]を参照してください。

FAST拡張は、拡張が操作に必要なすべてのセクションを対応するYAMLファイルに記述して作成されます。違うタイプの拡張はそれぞれのセクションセットを使用します（拡張タイプに関する詳細情報は[こちら][link-ext-logic]をご覧ください）。

##  使用されるセクション

### 修改拡張

このタイプの拡張は以下のセクションを使用します：
* 必須のセクション：
    * `meta-info`—拡張によって発見されるべき脆弱性に関する情報を含みます。このセクションの構造は[こちら][anchor-meta-info]で説明されています。
    * `detect`—必須のDetectフェーズの説明を含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-detect]のリンク先を参照してください。
* オプションのセクション（欠落していても構いません）：
    * `collect`—オプションのCollectフェーズの説明を含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-collect]のリンク先を参照してください。
    * `match`—オプションのMatchフェーズの説明を含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-match]のリンク先を参照してください。
    * `modify`—オプションのModifyフェーズの説明を含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-modify]のリンク先を参照してください。
    * `generate`—オプションのGenerateフェーズの説明を含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-generate]のリンク先を参照してください。


### 非修改拡張

このタイプの拡張は以下の必須セクションを使用します：
* `meta-info`—拡張によって発見されるべき脆弱性に関する情報を含みます。このセクションの構造は[こちら][anchor-meta-info]で説明されています。
* `send`—ベースラインリクエストでリストされているホストに送信する予定のテストリクエストを含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-send]のリンク先を参照してください。
* `detect`—必須のDetectフェーズの説明を含みます。このフェーズと対応するセクションの構造についての詳細な情報については、[こちら][link-detect]のリンク先を参照してください。


##  `meta-info`セクションの構造

情報的`meta-info`セクションは次の構造を持っています：

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — 脆弱性を説明するオプショナルのタイトル文字列です。指定された値は、Wallarmウェブインターフェースの検出された脆弱性のリストの「タイトル」列に表示されます。これは脆弱性または脆弱性を検出した特定のエクステンションを識別するために使用できます。

    ??? info "例"
        `title: "例の脆弱性"`

* `type` — 拡張が試みている脆弱性のタイプを説明する必須パラメータです。指定された値は、Wallarmウェブインターフェースの検出された脆弱性のリストの「タイプ」列に表示されます。パラメータには[こちら][link-vuln-list]に記述されている値のいずれかを指定できます。

    ??? info "例"
        `type: sqli`    

* `threat` — 脆弱性の脅威レベルを定義するオプショナルパラメータです。指定された値は、Wallarmウェブインターフェースの検出された脆弱性のリストの「リスク」列でグラフィカルに表示されます。パラメータには1から100までの整数値を指定できます。値が大きければ大きいほど、脆弱性の脅威レベルが高くなります。

    ??? info "例"
        `threat: 20`
    
    ![見つかった脆弱性のリスト][img-vulns]

* `description` — 拡張が検出する脆弱性の説明を含むオプショナルな文字列パラメータです。この情報は脆弱性の詳細説明に表示されます。

    ??? info "例"
        `description: "実証的な脆弱性"`
    
    ![Wallarmウェブインターフェース上の脆弱性の詳細説明][img-vuln-details]

!!! info "FAST拡張のプラギング"
    FASTに拡張をプラグするためには、拡張のYAMLファイルが含まれているディレクトリをFASTノードDockerコンテナにマウントする必要があります。マウント手順の詳細な情報については、[こちら][link-extensions]のリンク先を参照してください。