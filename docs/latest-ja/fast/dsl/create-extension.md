```markdown
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

!!! info "リクエスト要素記述構文"
    FAST拡張機能を作成する際には、対象アプリケーションに送信されるHTTPリクエストと、対象アプリケーションから受信されるHTTPレスポンスの構造を把握し、ポイントを使用して作業する必要のあるリクエスト要素を正しく記述する必要があります。

    詳細な情報については、この[link][link-points]へ進んでください。

FAST拡張機能は、拡張機能が正しく動作するために必要なすべてのセクションを、対応するYAMLファイル内に記述することによって作成します。異なるタイプの拡張機能は、それぞれ独自のセクションセットを使用します（[拡張機能タイプの詳細情報][link-ext-logic]）。

## 使用されるセクション

### 変更拡張機能

このタイプの拡張機能は、次のセクションを使用します:
* 必須セクション:
    * `meta-info`—検出される脆弱性に関する情報を含みます。このセクションの構造は[以下][anchor-meta-info]に記述されています。
    * `detect`—必須のDetectフェーズの説明を含みます。詳細な情報および対応するセクションの構造については、この[link][link-detect]へ進んでください。
* オプションセクション（存在しない場合もあります）:
    * `collect`—オプションのCollectフェーズの説明を含みます。詳細な情報および対応するセクションの構造については、この[link][link-collect]へ進んでください。
    * `match`—オプションのMatchフェーズの説明を含みます。詳細な情報および対応するセクションの構造については、この[link][link-match]へ進んでください。
    * `modify`—オプションのModifyフェーズの説明を含みます。詳細な情報および対応するセクションの構造については、この[link][link-modify]へ進んでください。
    * `generate`—オプションのGenerateフェーズの説明を含みます。詳細な情報および対応するセクションの構造については、この[link][link-generate]へ進んでください。

### 非変更拡張機能

このタイプの拡張機能は、以下の必須セクションを使用します:
* `meta-info`—検出される脆弱性に関する情報を含みます。このセクションの構造は[以下][anchor-meta-info]に記述されています。
* `send`—ベースラインリクエストに記載されたホストに送信される事前定義されたテストリクエストを含みます。詳細な情報および対応するセクションの構造については、この[link][link-send]へ進んでください。
* `detect`—必須のDetectフェーズの説明を含みます。詳細な情報および対応するセクションの構造については、この[link][link-detect]へ進んでください。

## `meta-info` セクションの構造

情報用の `meta-info` セクションは、次の構造になっています:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — 脆弱性を記述する任意のタイトル文字列です。指定された値は、Wallarm web interfaceの検出された脆弱性リストの「Title」列に表示されます。脆弱性またはその脆弱性を検出した特定の拡張機能を識別するために使用できます。

    ??? info "例"
        `title: "例の脆弱性"`

* `type` — 拡張機能が悪用しようとする脆弱性の種類を記述する必須のパラメータです。指定された値は、Wallarm web interfaceの検出された脆弱性リストの「Type」列に表示されます。このパラメータには、[こちら][link-vuln-list]に記述された値のいずれかを設定できます。
   
    ??? info "例"
        `type: sqli`

* `threat` — 脆弱性の脅威レベルを定義する任意のパラメータです。指定された値は、Wallarm web interfaceの検出された脆弱性リストの「Risk」列にグラフィカルに表示されます。このパラメータには、1から100までの整数値を割り当てることができます。値が大きいほど、脆弱性の脅威レベルは高くなります。

    ??? info "例"
        `threat: 20`
    
    ![検出された脆弱性のリスト][img-vulns]

* `description` — 脆弱性の説明を含む任意の文字列パラメータです。この情報は、脆弱性の詳細な説明に表示されます。
    
    ??? info "例"
        `description: "サンプルの脆弱性"`
    
    ![Wallarm web interface上の脆弱性の詳細な説明][img-vuln-details]

!!! info "FAST拡張機能の接続方法"
    FAST拡張機能をFASTに接続するには、拡張機能のYAMLファイルが含まれるディレクトリをFASTノードのDockerコンテナにマウントする必要があります。マウント手順の詳細については、この[link][link-extensions]へ進んでください.
```