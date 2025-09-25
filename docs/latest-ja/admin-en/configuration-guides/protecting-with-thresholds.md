# 複数の攻撃を行う発信元からの保護

Wallarmが[blocking mode](../../admin-en/configure-wallarm-mode.md)のときは、悪意のあるペイロードを含むすべてのリクエストを自動的にブロックし、正当なリクエストのみを通過させます。同一IPからの異なる悪意のあるペイロードの数（一般に「複数攻撃実行者」と呼びます）が指定したしきい値を超えた場合のWallarmの動作を設定することで、アプリケーションやAPIに対する追加の保護を構成できます。

そのような実行者は自動的にdenylistに追加でき、以後その発信元からのすべてのリクエストをブロックします。過去に多数の悪意のあるリクエストを送っているという事実にもとづき、個々のリクエストが悪性かどうかの解析に時間をかけずに遮断します。

## 設定

以下の例を参考に、複数種類の攻撃を行う発信元からの保護の設定方法を確認します。

たとえば、あるIPから1時間に3件を超える悪意のあるペイロードが検出されたら、そのIPを完全にブロックするとします。そのために、対応するしきい値を設定し、発信元IPを1時間ブロックするようにシステムに指示します。

この保護を有効にするには:

1. Wallarm Console → **Triggers**を開き、トリガー作成のウィンドウを開きます。
1. 条件として**Number of malicious payloads**を選択します。
1. しきい値を`同一IPからの悪意のあるリクエストが1時間に3件を超える`に設定します。

    !!! info "カウントされないもの"
        [カスタム正規表現](../../user-guides/rules/regex-rule.md)に基づく実験的なペイロード。
        
1. フィルターは設定しませんが、他のケースでは次を単独または組み合わせて使用できます。

    * **Type**は、リクエストで検出された攻撃の[タイプ](../../attacks-vulns-list.md)またはリクエストが向けられた脆弱性のタイプです。
    * **Application**は、リクエストを受け取る[アプリケーション](../../user-guides/settings/applications.md)です。
    * **IP**は、リクエストの送信元となるIPアドレスです。フィルターは単一のIPのみを受け付け、サブネット、ロケーション、送信元タイプは許可しません。
    * **Domain**は、リクエストを受け取るドメインです。
    * **Response status**は、リクエストに対して返されるレスポンスコードです。

1. **Denylist IP address** - `Block for 1 hour`のトリガーリアクションを選択します。しきい値を超えると、Wallarmは発信元IPを[denylist](../../user-guides/ip-lists/overview.md)に追加し、その後のすべてのリクエストをブロックします。

    なお、複数攻撃実行者に対する保護によってボットIPがdenylistに入れられた場合でも、デフォルトでは、当該発信元からのブロックされたリクエストに関する統計をWallarmが収集し、[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

    ![デフォルトのトリガー](../../images/user-guides/triggers/trigger-example-default.png)
        
1. トリガーを保存し、[Cloudとノードの同期が完了する](../configure-cloud-node-synchronization-en.md)のを待ちます（通常は2〜4分です）。

## Pre-configured trigger

新規の会社アカウントには、事前構成済み（デフォルト）の**Number of malicious payloads**トリガーが用意されており、1時間以内に3種類を超える[悪意のあるペイロード](../../glossary-en.md#malicious-payload)を送信した場合に、IPを1時間Graylistに入れます。

[Graylist](../../user-guides/ip-lists/overview.md)は疑わしいIPアドレスの一覧で、ノードは次のように処理します。GraylistにあるIPが悪意のあるリクエストを送ると、ノードはそれらをブロックし、正当なリクエストは許可します。これに対し、[denylist](../../user-guides/ip-lists/overview.md)はアプリケーションへの到達が一切許可されないIPアドレスを示し、denylistにある送信元からのトラフィックは正当なものであってもノードがブロックします。IPのGraylistingは、[false positives](../../about-wallarm/protecting-against-attacks.md#false-positives)の低減を目的としたオプションの1つです。

このトリガーはノードのどのフィルタリングモードでも有効になるため、ノードのモードに関係なくIPをGraylistに入れます。

ただし、ノードがGraylistを分析するのは**safe blocking**モードのときだけです。GraylistにあるIPからの悪意のあるリクエストをブロックするには、まずその特徴を理解したうえで、ノードの[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)をsafe blockingに切り替えてください。

Brute force、Forced browsing、Resource overlimit、Data bomb、Virtual patchの攻撃タイプのhitsは、このトリガーでは対象外です。

デフォルトのトリガーは一時的に無効化、変更、削除できます。

## テスト

以下は[事前構成済みのトリガー](#pre-configured-trigger)向けのテスト例です。ご利用のトリガーに合わせて調整できます。

1. 保護対象のリソースに次のリクエストを送信します。

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    ここには、[SQLi](../../attacks-vulns-list.md#sql-injection)、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)、[Path Traversal](../../attacks-vulns-list.md#path-traversal)タイプの悪意のあるペイロードが4つ含まれています。
1. Wallarm Console → **IP lists** → **Graylist**を開き、リクエストの送信元IPアドレスが1時間Graylistに入っていることを確認します。
1. **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。

    ![UI上の3つの悪意のあるペイロード](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するには、`multiple_payloads`の[search tag](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)を使用できます。