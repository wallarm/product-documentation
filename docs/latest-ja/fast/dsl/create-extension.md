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

[anchor-meta-info]:     #structure-of-the-meta-info-section

# FAST拡張機能の作成

!!! info "リクエスト要素記述の構文"
    FAST拡張機能を作成する際は、ポイントを使用して操作する必要があるリクエスト要素を正しく記述できるよう、アプリケーションに送信されるHTTPリクエストおよびアプリケーションから受信するHTTPレスポンスの構造を把握しておく必要があります。 

    詳細については、この[リンク][link-points]をご覧ください。

FAST拡張機能は、動作に必要なすべてのセクションを対応するYAMLファイル内で記述することで作成します。拡張機能の種類によって使用するセクションのセットが異なります（拡張機能の種類の詳細は[こちら][link-ext-logic]をご覧ください）。

## 使用するセクション

### 変更型拡張機能

この種類の拡張機能では次のセクションを使用します。
* 必須セクション:
    * `meta-info`—拡張機能が検出する脆弱性に関する情報を含みます。このセクションの構造は[以下][anchor-meta-info]をご覧ください。
    * `detect`—必須のDetectフェーズの説明を含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-detect]をご覧ください。
* 任意セクション（省略可）:
    * `collect`—任意のCollectフェーズの説明を含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-collect]をご覧ください。
    * `match`—任意のMatchフェーズの説明を含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-match]をご覧ください。
    * `modify`—任意のModifyフェーズの説明を含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-modify]をご覧ください。
    * `generate`—任意のGenerateフェーズの説明を含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-generate]をご覧ください。


### 非変更型拡張機能

この種類の拡張機能では、次のセクションが必須です。
* `meta-info`—拡張機能が検出する脆弱性に関する情報を含みます。このセクションの構造は[以下][anchor-meta-info]をご覧ください。
* `send`—ベースラインリクエストに記載されたホストに送信するための、あらかじめ定義されたテストリクエストを含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-send]をご覧ください。
* `detect`—必須のDetectフェーズの説明を含みます。このフェーズおよび対応するセクション構造の詳細については、この[リンク][link-detect]をご覧ください。


## `meta-info`セクションの構造

情報用の`meta-info`セクションは次の構造です。

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — 脆弱性を説明する任意のタイトル文字列です。指定した値はWallarmのWebインターフェースの検出済み脆弱性一覧の「Title」列に表示されます。脆弱性そのもの、またはその脆弱性を検出した特定の拡張機能の識別に使用できます。

    ??? info "例"
        `title: "Example vulnerability"`

* `type` — 拡張機能が悪用を試みる脆弱性の種類を表す必須パラメータです。指定した値はWallarmのWebインターフェースの検出済み脆弱性一覧の「Type」列に表示されます。取り得る値は[こちら][link-vuln-list]で説明されているいずれかです。
   
    ??? info "例"
        `type: sqli`    

* `threat` — 脆弱性の脅威レベルを定義する任意パラメータです。指定した値はWallarmのWebインターフェースの検出済み脆弱性一覧で「Risk」列にグラフィカルに表示されます。値は1から100の範囲の整数を設定できます。値が大きいほど脅威レベルが高くなります。 

    ??? info "例"
        `threat: 20`
    
    ![検出された脆弱性の一覧][img-vulns]

* `description` — 拡張機能が検出する脆弱性の説明を含む任意の文字列パラメータです。この情報は脆弱性の詳細に表示されます。
    
    ??? info "例"
        `description: "A demonstrational vulnerability"`    
    
    ![WallarmのWebインターフェースにおける脆弱性の詳細表示][img-vuln-details]

!!! info "FAST拡張機能の組み込み"
    拡張機能をFASTに組み込むには、拡張機能のYAMLファイルを含むディレクトリをFASTノードのDockerコンテナにマウントする必要があります。マウント手順の詳細については、この[リンク][link-extensions]をご覧ください。