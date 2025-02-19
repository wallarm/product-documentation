# 強制ブラウジング攻撃に対する保護

強制ブラウジング攻撃は、Wallarmが初期状態で検知しない攻撃の一種であり、本ガイドに記載されているように適切な設定を行う必要があります。

[強制ブラウジング](../../attacks-vulns-list.md#forced-browsing)攻撃は、限られた時間内に様々なURIへのリクエストに対し大量の404レスポンスコードが返されることが特徴です。 

本攻撃は、隠しリソース（例：アプリケーションコンポーネントに関する情報を含むディレクトリやファイル）の列挙およびアクセスを目的としています。強制ブラウジング攻撃は、攻撃者がアプリケーションに関する情報を収集し、この情報を悪用して他の攻撃を実行することを許す場合があります。

なお、強制ブラウジング攻撃からの保護に加え、[ブルートフォース攻撃](protecting-against-bruteforce.md)に対する保護も同様に設定できます。

## 設定

以下の例を参考にし、強制ブラウジング攻撃からの保護の設定方法について学んでください。

例えば、オンラインアプリケーション`book-sale`を所有しているとします。悪意のある攻撃者が`book-sale-example.com`ドメイン内の隠しディレクトリやファイルの名称を試す（強制ブラウジング攻撃）ことを防ぎたい場合、この保護を提供するために、対象ドメインに対して一定期間内に返される404レスポンスの数を制限し、その閾値を超えたIPをブロックするよう設定できます:

この保護を提供するには:

1. Wallarm Consoleを開き，**Triggers**に移動し，トリガー作成ウィンドウを表示します。
1. **強制ブラウジング**条件を選択します。
1. 同一のオリジンIPからのリクエストに対して返される404レスポンスコードの閾値を，30秒ごとに30件に設定します。

    これらは例としての値です。自身のトラフィックに対してトリガーを設定する際は，正当な利用統計を考慮して閾値を定義してください。

1. スクリーンショットに表示されるように，**URI**フィルタを設定し，以下を含めます:

    * パス内の `**` は「任意の個数のコンポーネント」を意味する[ワイルドカード](../../user-guides/rules/rules.md#using-wildcards)です。これにより，`book-sale-example.com`以下のすべてのアドレスがカバーされます。

        ![Forced browsing trigger example](../../images/user-guides/triggers/trigger-example5-4.8.png)

    * この例で必要なパターンを設定するほかに，特定のURI（例として，リソースファイルディレクトリのURI）を入力するか，URIを指定しないことで任意のエンドポイント上でトリガーを動作させることができます。
    * ネストされたURIを使用する場合は，[トリガー処理の優先順位](../../user-guides/triggers/triggers.md#trigger-processing-priorities)を考慮してください。

1. このケースでは以下を使用しないでください:

    * **Application**フィルタは使用しないでください。ただし、選択したアプリケーションの特定のドメインやエンドポイントを対象とするリクエストにのみ反応させるために使用できる点にご留意ください。
    * **IP**フィルタは使用しないでください。ただし、特定のIPからのリクエストにのみ反応させるために使用できる点にご留意ください。

1. **Denylist IP address** - `Block for 4 hour`トリガーリアクションを選択します。閾値を超えた後、WallarmはオリジンIPを[denylist](../../user-guides/ip-lists/overview.md)に登録し、そのIPからの全てのリクエストをブロックします。

    強制ブラウジング攻撃保護によりbot IPがdenylistに登録された場合でも、デフォルト設定ではWallarmはそのIPからのブロックされたリクエストに関する統計情報を収集し、[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

1. **Mark as forced browsing**トリガーリアクションを選択します。閾値超過後に受信されたリクエストは強制ブラウジング攻撃としてマークされ，Wallarm Consoleの**Attacks**セクションに表示されます。場合によっては、このリアクション単体で攻撃に関する情報を得るだけで，実際に何もブロックしない設定とすることも可能です。
1. トリガーを保存し，[Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md)を待ちます（通常は2～4分かかります）。

強制ブラウジング攻撃からの保護には複数のトリガーを設定できます。

## テスト

!!! info "ご利用環境でのテスト"
    お使いの環境で**強制ブラウジング**トリガーをテストするには，下記のトリガーおよびリクエストでドメインを任意の公開ドメイン（例：`example.com`）に置き換えてください.

[Configuring](#configuring)セクションで説明されているトリガーをテストするには:

1. 設定された閾値を超える数のリクエストを保護対象のURIに送信します。例えば，`https://book-sale-example.com/config.json`へ50件のリクエスト（`https://book-sale-example.com/**.**`に一致）を送信します:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://book-sale-example.com/config.json ; done
    ```
2. トリガーリアクションが**Denylist IP address**の場合，Wallarm Consoleの**IP lists**→**Denylist**を開いて，送信元IPアドレスがブロックされていることを確認します。

    トリガーリアクションが**Graylist IP address**の場合，Wallarm Consoleの**IP lists**→**Graylist**セクションを確認します.
3. **Attacks**セクションを開き，リクエストが強制ブラウジング攻撃としてリストに表示されていることを確認します.

    ![Forced browsing attack in the interface](../../images/user-guides/events/forced-browsing-attack.png)

    表示されるリクエストの数は，トリガー閾値超過後に送信されたリクエストの数に対応します（[動作検知攻撃の詳細](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)を参照）。この数が5を超える場合，リクエストサンプリングが適用され，リクエストの詳細は最初の5ヒットのみ表示されます（[リクエストサンプリングの詳細](../../user-guides/events/grouping-sampling.md#sampling-of-hits)を参照）。

    強制ブラウジング攻撃を検索するには，`dirbust`フィルターを使用できます。すべてのフィルターは，[検索使用方法の手順](../../user-guides/search-and-filters/use-search.md)に記載されています.

## 要件と制限

**要件**

強制ブラウジング攻撃からリソースを保護するためには，実際のクライアントのIPアドレスが必要です。もしフィルタリングノードがプロキシサーバまたはロードバランサの背後に配置されている場合，実際のクライアントのIPアドレスを表示するように[設定](../using-proxy-or-balancer-en.md)してください.

**制限事項**

強制ブラウジング攻撃の兆候を検索する際，Wallarmノードは他の攻撃タイプの兆候を含まないHTTPリクエストのみを解析します.