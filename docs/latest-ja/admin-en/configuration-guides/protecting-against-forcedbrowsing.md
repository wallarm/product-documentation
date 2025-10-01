# 強制ブラウジングからの保護

強制ブラウジング攻撃はWallarmが標準では検知しない攻撃タイプの1つであり、本ガイドのとおりに検知を適切に設定する必要があります。

[強制ブラウジング](../../attacks-vulns-list.md#forced-browsing)攻撃は、限られた時間内に異なるURIへのリクエストに対して多数の404レスポンスコードが返されることが特徴です。
    
この攻撃の目的は、隠されたリソース（例：アプリケーションコンポーネントに関する情報を含むディレクトリやファイル）を列挙してアクセスすることです。強制ブラウジング攻撃により、攻撃者はアプリケーションに関する情報を収集し、その情報を悪用して他の攻撃タイプを実行できる場合があります。

## 設定方法

ご利用のサブスクリプションプランに応じて、以下のいずれかの総当たり対策の設定方法が利用できます。

* 緩和コントロール（[Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）
* Triggers（[Cloud Native WAAP](../../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）

## 緩和コントロールに基づく保護 <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

WallarmのAdvanced API Security[サブスクリプション](../../about-wallarm/subscription-plans.md#core-subscription-plans)は、強制ブラウジング攻撃からの保護を含む高度な[列挙攻撃対策](../../api-protection/enumeration-attack-protection.md)を提供します。

## トリガーに基づく保護

### 設定

以下の例を参考に、強制ブラウジング対策の設定方法を確認します。

あなたがオンラインアプリケーション`book-sale`の所有者だとします。`book-sale-example.com`ドメイン配下で隠しディレクトリやファイル名を試す（強制ブラウジング）悪意のある行為者を防ぎたいとします。この保護を提供するため、あなたのドメインについて、一定時間内の404レスポンス数に上限を設け、この上限を超えたIPをブロックするように設定できます。

この保護を提供するには:

1. Wallarm Console → **Triggers**を開き、トリガー作成のウィンドウを開きます。
1. **Forced browsing**条件を選択します。
1. 同一の送信元IPからのリクエストに対して返される404レスポンスコードの件数のしきい値を、30秒あたり30に設定します。

    これらは例の値です。自身のトラフィックに合わせてトリガーを設定する際は、正当な利用状況の統計を考慮してしきい値を決めてください。
    
    !!! info "設定可能なしきい値の時間間隔"
        しきい値の時間間隔を調整する場合、選択した単位に応じて、値は30秒または10分の倍数である必要があります。

1. スクリーンショットのとおりに**URI**フィルターを設定します。内容は以下のとおりです。

    * パスに「任意の数のコンポーネント」を意味する`**`[ワイルドカード](../../user-guides/rules/rules.md#using-wildcards)を使用します。これにより`book-sale-example.com`配下のすべてのアドレスを対象にできます。

        ![強制ブラウジング用トリガーの例](../../images/user-guides/triggers/trigger-example5-4.8.png)

    * この例で必要なパターンの設定に加えて、特定のURI（たとえばリソースファイルのディレクトリのURI）を入力することもできます。あるいはURIを指定しないことで、任意のエンドポイントでトリガーを動作させることもできます。
    * ネストしたURIを使用する場合は、[トリガーの処理優先順位](../../user-guides/triggers/triggers.md#trigger-processing-priorities)を考慮してください。

1. このケースでは次の項目は使用しません:

    * **Application**フィルター。ただし、選択したアプリケーションのドメインや特定のエンドポイントを対象とするリクエストにのみ反応するトリガーを設定するために使用できます。
    * **IP**フィルター。ただし、特定のIPから発生するリクエストにのみ反応するトリガーを設定するために使用できます。

1. トリガーの反応として**Denylist IP address** - `Block for 4 hour`を選択します。しきい値を超えると、Wallarmは送信元IPを[denylist](../../user-guides/ip-lists/overview.md)に追加し、それ以降のリクエストをすべてブロックします。

    なお、強制ブラウジング対策によってボットのIPがdenylistに入れられた場合でも、デフォルトで、Wallarmは当該IPから発生したブロック済みリクエストに関する統計を収集し、[表示します](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)。

1. トリガーの反応として**Mark as forced browsing**を選択します。しきい値超過後に受信したリクエストは強制ブラウジング攻撃としてマークされ、Wallarm Consoleの**Attacks**セクションに表示されます。ブロックは行わず攻撃の情報だけを得たい場合、この反応のみを利用することもできます。
1. トリガーを保存し、[Cloudとノードの同期の完了](../configure-cloud-node-synchronization-en.md)を待ちます（通常2〜4分かかります）。

強制ブラウジング対策のために複数のトリガーを設定できます。

### テスト

!!! info "ご利用の環境でのテスト"
    ご自身の環境で**Forced browsing**トリガーをテストするには、以下のトリガー設定およびリクエスト中のドメインを、任意のパブリックドメイン（例：`example.com`）に置き換えてください。

[設定](#configuring)セクションで説明したトリガーをテストするには:

1. 保護対象のURIに対して、設定したしきい値を超える数のリクエストを送信します。たとえば、`https://book-sale-example.com/config.json`へ50件のリクエストを送信します（`https://book-sale-example.com/**.**`に一致します）。

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://book-sale-example.com/config.json ; done
    ```
2. トリガーの反応が**Denylist IP address**の場合、Wallarm Console → **IP lists** → **Denylist**を開き、送信元IPアドレスがブロックされていることを確認します。

    トリガーの反応が**Graylist IP address**の場合、Wallarm Consoleの**IP lists** → **Graylist**を確認します。
3. **Attacks**セクションを開き、リクエストが強制ブラウジング攻撃として一覧に表示されていることを確認します。

    ![インターフェース上の強制ブラウジング攻撃](../../images/user-guides/events/forced-browsing-attack.png)

    表示されるリクエスト数は、トリガーのしきい値超過後に送信されたリクエスト数に対応します（[行動的攻撃の検知の詳細](../../attacks-vulns-list.md#attack-types)）。この数が5を超える場合、リクエストのサンプリングが適用され、リクエストの詳細は最初の5hitsに対してのみ表示されます（[リクエストのサンプリングの詳細](../../user-guides/events/grouping-sampling.md#sampling-of-hits)）。

    強制ブラウジング攻撃を検索するには、`dirbust`フィルターを使用できます。すべてのフィルターは[検索の使用方法](../../user-guides/search-and-filters/use-search.md)に記載しています。

### 要件と制限

**要件**

強制ブラウジング攻撃からリソースを保護するには、実際のクライアントIPアドレスが必要です。フィルタリングノードがプロキシサーバーまたはロードバランサーの背後にデプロイされている場合は、実際のクライアントIPアドレスが表示されるように[設定](../using-proxy-or-balancer-en.md)してください。

**制限**

強制ブラウジング攻撃の兆候を探索する際、Wallarmノードは他の攻撃タイプの兆候を含まないHTTPリクエストのみを分析します。