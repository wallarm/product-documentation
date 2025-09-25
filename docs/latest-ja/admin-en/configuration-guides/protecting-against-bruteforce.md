# ブルートフォース保護

ブルートフォース攻撃は、Wallarmが標準では検知しない攻撃タイプの1つです。本ガイドの説明に従って検知を適切に構成する必要があります。

[一般的なブルートフォース攻撃](../../attacks-vulns-list.md#brute-force-attack)には、パスワードの総当たり、セッション識別子の総当たり、クレデンシャルスタッフィングが含まれます。これらの攻撃は、限られた時間内に典型的なURIへ、強制的に変更したパラメータ値を用いた多数のリクエストが送信されることを特徴とします。

## 構成方法

ご利用のサブスクリプションプランに応じて、以下のいずれかのブルートフォース保護の構成方法が利用できます。

* 緩和コントロール（[Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）
* Triggers（[Cloud Native WAAP](../../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）

## 緩和コントロールに基づく保護 <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

WallarmのAdvanced API Security[サブスクリプション](../../about-wallarm/subscription-plans.md#core-subscription-plans)は、ブルートフォース攻撃からの保護を含む高度な[列挙攻撃保護](../../api-protection/enumeration-attack-protection.md)を提供します。

## トリガーに基づく保護

本セクションで説明するブルートフォース保護は、Wallarmが提供する基本的な負荷制御方法の1つです。代替手段として、[レート制限](../../user-guides/rules/rate-limiting.md)を適用できます。レート制限は受信トラフィックを減速させるために使用し、ブルートフォース保護は攻撃者を完全に遮断するために使用します。

基本的なブルートフォース保護に加えて、同様の手順で[強制ブラウジング対策](protecting-against-forcedbrowsing.md)も基本的に構成できます。

### 構成 {#configuring}

以下の例を参考に、トリガーでブルートフォース保護を構成する方法を確認します。

たとえば、認証エンドポイントを通じて`rent-car`アプリケーションへの認可済みアクセスを得るためにさまざまなパスワードを試行する悪意のある行為（ブルートフォース攻撃）を防ぎたいとします。この保護を提供するために、認証エンドポイントに対して時間当たりのリクエスト数を制限し、この制限を超えたIPをブロックするよう設定できます。

1. Wallarm Console→**Triggers**を開き、トリガー作成のウィンドウを開きます。
1. **Brute force**条件を選択します。
1. 同一IPから30秒あたり30リクエストのしきい値を設定します。

    これらはあくまで例の値です。ご自身のトラフィック向けにトリガーを構成する際は、正当な利用状況の統計を考慮してしきい値を決めてください。
    
    !!! info "許可されるしきい値の時間間隔"
        しきい値の時間間隔を調整する場合、選択した単位に応じて値は30秒または10分の倍数である必要があります。

1. **Application**フィルターを`rent-car`に設定します（アプリケーションはWallarmに[登録済み](../../user-guides/settings/applications.md)である必要があります）。
1. スクリーンショットのとおりに**URI**フィルターを設定します。以下を含みます。

    * パス内の`**`[ワイルドカード](../../user-guides/rules/rules.md#using-wildcards)は「任意個のコンポーネント」を意味します
    * リクエスト部分の`.*login*`[正規表現](../../user-guides/rules/rules.md#condition-type-regex)は「エンドポイントに`login`を含む」を意味します

        これらを組み合わせると、例えば次のようなURLに対応します。
        `https://rent-car-example.com/users/login`
        `https://rentappc-example.com/usrs/us/p-login/sq`
        （トリガー全体が機能するためには、ドメインが選択したアプリケーションに[関連付けられている](../../user-guides/settings/applications.md#automatic-application-identification)必要がある点に注意してください）

        ![ブルートフォーストリガーの例](../../images/user-guides/triggers/trigger-example6-4.8.png)
    
    * この例で必要なパターンを構成する以外に、特定のURIを入力することも、URIを指定せずにトリガーを任意のエンドポイントで機能させることもできます。
    * 入れ子のURIを使用する場合は、[トリガー処理の優先順位](../../user-guides/triggers/triggers.md#trigger-processing-priorities)を考慮します。

1. このケースでは**IP**フィルターは使用しませんが、特定のIPからのリクエストにのみ反応するようにトリガーを設定する目的で使用できることに留意してください。
1. トリガーの反応として**Denylist IP address** - `Block for 1 hour`を選択します。しきい値を超えると、Wallarmは発信元IPを[denylist](../../user-guides/ip-lists/overview.md)に入れ、以後のすべてのリクエストをブロックします。

    なお、ブルートフォース保護によってボットのIPがdenylistに入れられた場合でも、デフォルトでは、WallarmはそのIPから発生したブロック済みリクエストに関する統計を収集し、[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

1. トリガーの反応として**Mark as brute force**を選択します。しきい値超過後に受信したリクエストはブルートフォース攻撃としてマークされ、Wallarm Consoleの**Attacks**セクションに表示されます。場合によっては、この反応のみを使用して攻撃に関する情報を取得し、何もブロックしない運用も可能です。
1. トリガーを保存し、[Cloudとノードの同期完了](../configure-cloud-node-synchronization-en.md)を待ちます（通常は2〜4分かかります）。

ブルートフォース保護用に複数のトリガーを構成できます。

### テスト

!!! info "ご利用環境でのテスト"
    ご利用環境で**Brute force**トリガーをテストするには、以下のトリガー設定およびリクエスト内のドメインを任意のパブリックドメイン（例：`example.com`）に置き換えます。ご自身の[アプリケーション](../../user-guides/settings/applications.md)を設定し、そのドメインをアプリケーションにリンクします。

[構成](#configuring)セクションで説明したトリガーをテストするには、次を実行します。

1. `rent-car-example.com`ドメインが、Wallarmに登録済みの`rent-car`アプリケーションの一部として[識別](../../user-guides/settings/applications.md#automatic-application-identification)されていることを確認します。
1. このドメインの保護対象エンドポイントに、設定したしきい値を超える数のリクエストを送信します。例えば、`rent-car-example.com/users/login`に50回リクエストを送ります。

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://rent-car-example.com/users/login ; done
    ```
1. Wallarm Console→**IP lists**→**Denylist**を開き、送信元IPアドレスがブロックされていることを確認します。
1. **Attacks**セクションを開き、リクエストがブルートフォース攻撃として一覧に表示されていることを確認します。

    ![インターフェースでのブルートフォース攻撃](../../images/user-guides/events/brute-force-attack.png)

    表示されるリクエスト数は、トリガーのしきい値超過後に送信されたリクエスト数に対応します（[行動ベース攻撃の検知の詳細](../../attacks-vulns-list.md#attack-types)）。この数が5を超える場合はリクエストのサンプリングが適用され、最初の5件のhitsに対してのみリクエスト詳細が表示されます（[リクエストのサンプリングの詳細](../../user-guides/events/grouping-sampling.md#sampling-of-hits)）。

    ブルートフォース攻撃を検索するには、`brute`フィルターを使用できます。すべてのフィルターは[検索の使用方法の手順](../../user-guides/search-and-filters/use-search.md)で説明しています。

### 要件と制限

**要件**

リソースをブルートフォース攻撃から保護するには、実クライアントのIPアドレスが必要です。フィルタリングノードがプロキシサーバーやロードバランサーの背後に配置されている場合は、実クライアントのIPアドレスを表示するように[構成](../using-proxy-or-balancer-en.md)します。

**制限事項**

ブルートフォース攻撃の兆候を検出する際、Wallarmノードは、他の攻撃タイプの兆候を含まないHTTPリクエストのみを解析します。