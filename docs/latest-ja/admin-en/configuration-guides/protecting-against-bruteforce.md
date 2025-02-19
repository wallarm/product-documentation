# ブルートフォース保護

ブルートフォース攻撃はWallarmが標準搭載していない攻撃タイプの1つであり，本ガイドに記載するように検出の適切な設定が必要です。

[通常のブルートフォース攻撃](../../attacks-vulns-list.md#brute-force-attack)にはパスワードブルートフォース，セッション識別子のブルートフォース，およびクレデンシャルスタッフィングが含まれます。これらの攻撃は，短期間に典型的なURIに対して複数の異なるパラメータ値を強制送信する多数のリクエストによって特徴付けられます。

注意:

* 本記事で説明するブルートフォース保護は，Wallarmが提供する負荷制御の1つの方法です。あるいは，[rate limiting](../../user-guides/rules/rate-limiting.md)を適用することもできます。rate limitingは着信トラフィックの速度を遅くするためのものであり，ブルートフォース保護は攻撃者を完全にブロックするためのものです。
* ブルートフォース保護に加えて，類似の方法で[forced browsing](protecting-against-forcedbrowsing.md)に対する保護を設定することも可能です。

## 設定

以下の例を確認して，ブルートフォース保護の設定方法を学びます。

たとえば不正な利用者がさまざまなパスワードを試みて`rent-car`アプリケーションへの認証エンドポイントを経由して正規のアクセスを取得する試み（ブルートフォース攻撃）を防止したいとします。この保護を提供するため，認証エンドポイントに対して一定時間内のリクエスト数を制限し，その制限を超えたIPをブロックすることができます:

1. Wallarm Console→**Triggers**を開き，トリガ作成のウィンドウを表示します。
1. 「**Brute force**」条件を選択します。
1. 同一IPから30秒間に30リクエストという閾値を設定します。

    これらは一例の値です。自身のトラフィックに合わせてトリガを設定する際は，正当な利用統計を考慮して閾値を定義してください。

1. **Application**フィルターを`rent-car`に設定します（アプリケーションはWallarmに[登録](../../user-guides/settings/applications.md)されている必要があります）。
1. 下記のスクリーンショットに示すように**URI**フィルターを設定します。設定内容は以下のとおりです:

    * パスの`**`は，「任意の数のコンポーネント」を意味する[ワイルドカード](../../user-guides/rules/rules.md#using-wildcards)
    * リクエスト部分の`.*login*`は，エンドポイントに`login`が含まれることを意味する[正規表現](../../user-guides/rules/rules.md#condition-type-regex)

        これらを組み合わせることで，例えば以下の場合をカバーします:
        `https://rent-car-example.com/users/login`
        `https://rentappc-example.com/usrs/us/p-login/sq`
        （トリガ全体が機能するためには，ドメインが選択したアプリケーションに[連携](../../user-guides/settings/applications.md#automatic-application-identification)されている必要があります）

        ![ブルートフォーストリガ例](../../images/user-guides/triggers/trigger-example6-4.8.png)
    
    * 本例で必要なパターンの設定に加えて，特定のURIを入力するか，URIを指定せず任意のエンドポイントでトリガを動作させることも可能です。
    * ネストされたURIを使用する場合は，[trigger processing priorities](../../user-guides/triggers/triggers.md#trigger-processing-priorities)を考慮してください。

1. この場合，**IP**フィルターは使用しませんが，特定のIPからのリクエストにのみ反応させるトリガ設定に使用できることに留意してください。
1. **Denylist IP address** - `Block for 1 hour`トリガ反応を選択します。Wallarmは閾値を超えた後，送信元のIPを[denylist](../../user-guides/ip-lists/overview.md)に追加し，以降のすべてのリクエストをブロックします。

    ボットのIPがブルートフォース保護によりdenylistに配置された場合でも，デフォルトではWallarmは当該IPからのブロックされたリクエストの統計情報を[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

1. **Mark as brute force**トリガ反応を選択します。閾値を超えた後に受信したリクエストはブルートフォース攻撃としてマークされ，Wallarm Consoleの**Attacks**セクションに表示されます。場合によっては，本反応のみで攻撃に関する情報を取得でき，ブロックは行いません。
1. トリガを保存し，[Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md)を待ちます（通常，2～4分かかります）。

複数のブルートフォース保護用トリガを設定することができます。

## テスト

!!! info "環境でのテスト"
    環境で**Brute force**トリガをテストするには，以下のトリガとリクエスト中のドメインを任意の公開ドメイン（例：`example.com`）に置き換えてください。ご自身の[application](../../user-guides/settings/applications.md)を設定し，そのドメインを連携してください。

[設定](#設定)セクションで説明したトリガをテストするには:

1. `rent-car-example.com`ドメインが，Wallarmに登録された`rent-car`アプリケーションの一部として[識別](../../user-guides/settings/applications.md#automatic-application-identification)されていることを確認してください。
1. 保護対象のドメインのエンドポイントに対して，設定した閾値を超えるリクエストを送信します。たとえば，`rent-car-example.com/users/login`へ50リクエスト送信します:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://rent-car-example.com/users/login ; done
    ```
1. Wallarm Console→**IP lists**→**Denylist**を開き，送信元IPアドレスがブロックされていることを確認してください。
1. **Attacks**セクションを開き，リクエストがブルートフォース攻撃としてリストに表示されていることを確認してください。

    ![インターフェイス内のブルートフォース攻撃](../../images/user-guides/events/brute-force-attack.png)

    表示されるリクエスト数は，トリガ閾値を超えた後に送信されたリクエスト数に対応します（[behavioral attacksの詳細](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)）。この数が5を超える場合，リクエストサンプリングが適用され，最初の5ヒットのみ詳細が表示されます（[requests samplingの詳細](../../user-guides/events/grouping-sampling.md#sampling-of-hits)）。

    ブルートフォース攻撃を検索するには，`brute`フィルターを使用してください。すべてのフィルターの詳細については，[use searchの説明](../../user-guides/search-and-filters/use-search.md)を参照してください。

## 要件と制限

**要件**

ブルートフォース攻撃からリソースを保護するには，実際のクライアントのIPアドレスが必要です。フィルタリングノードがプロキシサーバまたはロードバランサの背後に配置されている場合は，実際のクライアントIPアドレスを表示するように[設定](../using-proxy-or-balancer-en.md)してください。

**制限**

ブルートフォース攻撃の兆候を検索する際，Wallarmノードは他の攻撃タイプの兆候が含まれていないHTTPリクエストのみを分析します。