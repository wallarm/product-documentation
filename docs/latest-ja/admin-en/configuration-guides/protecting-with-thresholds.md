# マルチアタック加害者からの保護

Wallarmが[blocking mode](../../admin-en/configure-wallarm-mode.md)の場合、悪意のあるペイロードを持つすべてのリクエストを自動的にブロックし、正当なリクエストのみを通過させます。同一IPからの異なる悪意のあるペイロード（一般に**multi-attack perpetrator**と呼ばれる）の数が指定した閾値を超えた場合のWallarmのリアクションを設定することで、アプリケーションやAPIに対する追加の保護を構成できます。

このような加害者は自動的に[denylist](../../user-guides/ip-lists/overview.md)に登録され、過去に大量の悪意のあるリクエストを送信していたという理由だけで、解析に時間をかけずに**彼らからのすべてのリクエスト**をブロックします。

## 設定方法

以下の例を参照し、マルチアタック加害者からの保護を設定する方法を確認します。

例えば、1時間あたりに同一IPから3件以上の悪意のあるペイロードが送信された場合は、そのIPを完全にブロックする理由になると判断するとします。その場合、対応する閾値を設定し、システムに対して発信元IPを1時間ブロックするよう指示します。

1. Wallarm Consoleを開き、**Triggers**を選択してトリガー作成ウィンドウを開きます。
1. **Number of malicious payloads**条件を選択します。
1. 閾値として `more than 3 malicious requests from the same IP per hour` を設定します。

    !!! info "カウントされないもの"
        実験的なペイロード（[custom regular expressions](../../user-guides/rules/regex-rule.md)に基づくもの）はカウントされません。
        
1. フィルターは設定しません。ただし、別々または組み合わせて使用できる以下の条件があることに留意します：

    * **Type** はリクエストから検出された攻撃の[type](../../attacks-vulns-list.md)またはリクエストが対象とする脆弱性の種類です。
    * **Application** はリクエストを受信する[application](../../user-guides/settings/applications.md)です。
    * **IP** はリクエストが送信されるIPアドレスです。フィルターは単一のIPのみを想定しており、サブネット、ロケーション、及びソースタイプは許可されません。
    * **Domain** はリクエストを受信するドメインです。
    * **Response status** はリクエストに返されるレスポンスコードです。

1. **Denylist IP address** - `Block for 1 hour` のトリガーリアクションを選択します。閾値を超えた後、Wallarmは発信元IPを[denylist](../../user-guides/ip-lists/overview.md)に登録し、そのIPからのすべてのリクエストをブロックします。

    なお、bot IPがmulti-attack保護によりdenylistに登録された場合でも、デフォルトではWallarmはそのIPからのブロックされたリクエストに関する統計情報を収集し、[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

    ![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)
        
1. トリガーを保存し、[Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md)の完了を待ちます（通常は2～4分かかります）。

## 事前設定されたトリガー

新規の会社アカウントには、1時間以内に3件以上の異なる[malicious payloads](../../glossary-en.md#malicious-payload)を生成した場合に、そのIPを1時間graylistする事前設定（デフォルト）の**Number of malicious payloads**トリガーが用意されています。

[Graylist](../../user-guides/ip-lists/overview.md)は、ノードが処理する疑わしいIPアドレスのリストであり、graylistに登録されたIPから悪意のあるリクエストが発信された場合、ノードはそれらをブロックしつつ正当なリクエストは許可します。それに対して、[denylist](../../user-guides/ip-lists/overview.md)はアプリケーションへのアクセスが完全に禁止されるIPアドレスを示し、denylistに登録されたソースからの正当なトラフィックであってもノードはブロックします。IPのgraylistingは、[false positives](../../about-wallarm/protecting-against-attacks.md#false-positives)の削減を目的としたオプションの1つです。

このトリガーはすべてのノードフィルトレーションモードで有効なため、ノードモードに依存せずIPをgraylistします。

ただし、ノードはgraylistの解析を**safe blocking**モードでのみ行います。graylistに登録されたIPからの悪意のあるリクエストをブロックするには、まずその機能を確認した上で、ノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)をsafe blockingに切り替えます。

Brute force、Forced browsing、Resource overlimit、Data bomb、Virtual patchの攻撃タイプによるヒットは、このトリガーでは考慮されません。

デフォルトのトリガーは一時的に無効化、変更、または削除できます。

## テスト

以下は[事前設定されたトリガー](#pre-configured-trigger)のテスト例です。必要に応じて、トリガービューに合わせて調整できます。

1. 保護されたリソースに対して以下のリクエストを送信します:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    これらのリクエストには、[SQLi](../../attacks-vulns-list.md#sql-injection)、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)、および[Path Traversal](../../attacks-vulns-list.md#path-traversal)タイプの悪意のあるペイロードが4件含まれています。
1. Wallarm Consoleを開き、**IP lists** → **Graylist**を選択し、リクエストの発信元IPアドレスが1時間graylistされていることを確認します。
1. **Attacks**セクションを開き、攻撃がリストに表示されていることを確認します:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するには、`multiple_payloads` [search tag](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)を使用できます。