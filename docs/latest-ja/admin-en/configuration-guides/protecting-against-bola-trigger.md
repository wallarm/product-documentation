# 手動によるBOLA保護

[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola)のような振る舞いベースの攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストで識別子によってオブジェクトにアクセスし、認可メカニズムを回避してそのデータを読み取ったり変更したりできます。

## 設定方法

ご利用のサブスクリプションプランに応じて、BOLA攻撃からの保護には次のいずれかの設定方法が利用できます:

* 緩和コントロール（[Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）
* Triggers（[Cloud Native WAAP](../../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）

## 緩和コントロールベースの保護 <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

WallarmのAdvanced API Security[サブスクリプション](../../about-wallarm/subscription-plans.md#core-subscription-plans)は、高度な[列挙攻撃保護](../../api-protection/enumeration-attack-protection.md)を提供し、その中にBOLA攻撃からの保護も含まれます。

## トリガーベースの保護

### 設定 {#configuring}

デフォルトでは、WallarmはBOLAタイプ（IDORとも呼ばれます）の脆弱性のみを自動検出しますが、その悪用試行は検出しません。以下の例を参考に、BOLA攻撃からの保護の設定方法を確認してください。

たとえば、オンラインストア（ショップ）向けのeコマースプラットフォーム`wmall-example.com`が、ホストしている各ショップの情報を`/shops/<PARTICULAR_SHOP>/`配下に保存しているとします。ホスト済みの全ショップ名の一覧を悪意ある実行者に取得されないようにしたいです。この一覧は、URL内の`<PARTICULAR_SHOP>`を置き換えながら名前を操作する簡単なスクリプトで取得できます。これを防ぐために、ショップをホストするルートに対して一定時間あたりのリクエスト数を制限し、この上限を超えたIPをブロックするように設定できます:

1. Wallarm Console → **Triggers**を開き、トリガー作成ウィンドウを表示します。
1. 条件として**BOLA**を選択します。
1. 閾値を「同一IPから30秒間に30リクエスト」に設定します。

    これらは例の値です。ご自身のトラフィック向けにトリガーを設定する際は、正当な利用の統計を考慮して閾値を定義してください。

1. スクリーンショットのとおりに**URI**フィルターを設定します。次を含みます:

    * パス中の`*`[ワイルドカード](../../user-guides/rules/rules.md#using-wildcards)。これは「任意の1コンポーネント」を意味します。これにより、`wmall-example.com/shops/<PARTICULAR_SHOP>/financial_info`のすべてのアドレスが対象になります。

        ![BOLAトリガー](../../images/user-guides/triggers/trigger-example7-4.8.png)

1. このケースでは次は使用しません: 

    * **Application**フィルター。ただし、選択したアプリケーションのドメインや特定のエンドポイントを対象とするリクエストにのみ反応するようにトリガーを設定する目的で使用できます。
    * **IP**フィルター。ただし、特定の送信元IPにのみ反応するようにトリガーを設定する目的で使用できます。

1. **Denylist IP address** - `Block for 4 hour`のトリガーリアクションを選択します。閾値を超えた後、Wallarmは送信元IPを[Denylist](../../user-guides/ip-lists/overview.md)に追加し、以降のすべてのリクエストをブロックします。

    手動BOLA保護によってボットのIPがdenylistに入れられた場合でも、デフォルトでWallarmはそのIPからのブロックされたリクエストに関する統計を収集して[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

1. **Mark as BOLA**のトリガーリアクションを選択します。閾値超過後に受信したリクエストはBOLA攻撃としてマークされ、Wallarm Consoleの**Attacks**セクションに表示されます。場合によっては、このリアクションのみを使用して攻撃の情報を得ることもできますが、何もブロックはしません。
1. トリガーを保存し、[Cloudとノードの同期の完了](../configure-cloud-node-synchronization-en.md)を待ちます（通常は2〜4分です）。

### テスト

!!! info "ご利用環境でのテスト"
    ご利用環境で**BOLA**トリガーをテストするには、以下のトリガー設定とリクエストで、ドメインを任意のパブリックドメイン（例: `example.com`）に置き換えます。

[設定](#configuring)セクションで説明したトリガーをテストするには:

1. 保護対象のURIに、設定した閾値を超える数のリクエストを送信します。例えば、`https://wmall-example.com/shops/{shop_id}/financial_info`エンドポイントに`{shop_id}`の値を変えた50件のリクエストを送ります:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://wmall-example.com/shops/$i/financial_info ; done
    ```
1. トリガーのリアクションが**Denylist IP address**の場合は、Wallarm Console → **IP lists** → **Denylist**を開き、送信元IPアドレスがブロックされていることを確認します。

    トリガーのリアクションが**Graylist IP address**の場合は、Wallarm Consoleの**IP lists** → **Graylist**セクションを確認します。
1. **Attacks**セクションを開き、リクエストがBOLA攻撃として一覧に表示されていることを確認します。

    ![UIでのBOLA攻撃](../../images/user-guides/events/bola-attack.png)

    表示されるリクエスト数は、トリガーの閾値超過後に送信されたリクエスト数に対応します（[振る舞いベースの攻撃検出の詳細](../../attacks-vulns-list.md#attack-types)）。この数が5を超える場合はリクエストのサンプリングが適用され、最初の5件のHitに対してのみ詳細が表示されます（[リクエストサンプリングの詳細](../../user-guides/events/grouping-sampling.md#sampling-of-hits)）。

    BOLA攻撃を検索するには、検索タグ`bola`を使用できます。すべてのフィルターは[検索の使い方](../../user-guides/search-and-filters/use-search.md)で説明しています。

### 要件と制限

**要件**

BOLA攻撃からリソースを保護するには、実クライアントのIPアドレスが必要です。フィルタリングノードがプロキシサーバーやロードバランサーの背後にある場合は、実クライアントのIPアドレスを表示するように[設定](../using-proxy-or-balancer-en.md)します。

**制限**

BOLA攻撃の兆候を探索する際、Wallarmノードは他の攻撃タイプの兆候を含まないHTTPリクエストのみを解析します。

## 自動保護  <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

他のBOLA保護手段の代替または追加として、[API Discoveryで検出されたエンドポイント向けの自動BOLA保護](protecting-against-bola.md)を設定できます。