# BOLA保護マニュアル

行動型攻撃、例えば[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola)は、その名の通り脆弱性を悪用します。この脆弱性により、攻撃者がAPIリクエストを介して識別子でオブジェクトにアクセスし、データを読み取ったり変更したりして認証機構を回避することが可能となります。本記事では、[WAAP](../../about-wallarm/waap-overview.md)のトリガー機能で提供されるBOLA対策について説明します。

!!! info "その他のBOLA対策"
    または併用として、[API Discoveryによって検出されたエンドポイントに対する自動BOLA保護](protecting-against-bola.md)の設定も可能です。

## 設定

初期設定では、WallarmはBOLAタイプ（IDORとも呼ばれます）の脆弱性のみを自動検出しますが、その攻撃試行の検出は行いません。以下の例を参考に、BOLA攻撃からの保護設定方法をご確認ください。

例えば、オンラインストア向けのeコマース`wmall-example.com`プラットフォームが、各ショップの情報を`/shops/<PARTICULAR_SHOP>/`以下に保存しているとします。悪意のある攻撃者により、全てのショップ名一覧が取得されるリスクがあるため、この一覧がURL内の`<PARTICULAR_SHOP>`部分を置換するシンプルなスクリプトによって取得される可能性があります。これを防ぐために、ショップホスティングのルートに対して一定時間あたりのリクエスト数を制限し、その上限を超えたIPをブロックする設定が可能です。

1. Wallarm Console → **Triggers**を開き、トリガー作成ウィンドウを表示します。
1. **BOLA**条件を選択します。
1. 同一IPから30秒あたり30リクエストの閾値を設定します。

    なお、これらは例示値です。自身のトラフィックに合わせてトリガーを設定する際は、正当な利用状況を考慮して閾値を定義してください。

1. **URI**フィルターを、以下のようにスクリーンショットに表示されているように設定します。以下を含みます:

    * パス内の`*`は[ワイルドカード](../../user-guides/rules/rules.md#using-wildcards)で「任意の1コンポーネント」を意味します。これにより、`wmall-example.com/shops/<PARTICULAR_SHOP>/financial_info`の全アドレスが対象となります。

        ![BOLA trigger](../../images/user-guides/triggers/trigger-example7-4.8.png)

1. この場合、以下のものは使用しないでください: 

    * **Application**フィルター。ただし、特定のアプリケーションのドメインまたはエンドポイントへのリクエストにのみ反応させるトリガー設定に使用することは可能です。
    * **IP**フィルター。ただし、特定のIPからのリクエストにのみ反応させるトリガー設定に使用することは可能です。

1. **Denylist IP address** - `Block for 4 hour`トリガー反応を選択します。閾値を超えた場合、Wallarmは送信元IPを[denylist](../../user-guides/ip-lists/overview.md)に追加し、その後のリクエストをすべてブロックします。

    なお、手動BOLA保護によりボットのIPがdenylistに追加された場合でも、デフォルトでWallarmはそのIPから発生したブロックされたリクエストの統計を[表示](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

1. **Mark as BOLA**トリガー反応を選択します。閾値超過後に受信したリクエストはBOLA攻撃としてマークされ、Wallarm Consoleの**Attacks**セクションに表示されます。場合により、情報収集のみを目的としてこの反応を単独で使用することも可能です。
1. トリガーを保存し、[Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md)の完了を待ちます（通常は2～4分かかります）。

## テスト

!!! info "ご利用環境でのテスト"
    ご利用環境で**BOLA**トリガーをテストするには、以下のトリガーおよびリクエストで、ドメインを任意のパブリックなもの（例：`example.com`）に置き換えてください。

[設定](#configuring)セクションに記載されたトリガーをテストするには:

1. 保護対象のURIに対して設定された閾値を超えるリクエスト数を送信します。例えば、異なる`{shop_id}`値を用いて、エンドポイント`https://wmall-example.com/shops/{shop_id}/financial_info`に対して50リクエストを送信する場合:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://wmall-example.com/shops/$i/financial_info ; done
    ```
1. トリガー反応が**Denylist IP address**の場合、Wallarm Console → **IP lists** → **Denylist**を開き、送信元IPアドレスがブロックされていることを確認してください。

    トリガー反応が**Graylist IP address**の場合は、Wallarm Consoleの**IP lists** → **Graylist**セクションを確認してください。
1. **Attacks**セクションを開き、リクエストがBOLA攻撃として一覧に表示されていることを確認してください。

    ![BOLA attack in the UI](../../images/user-guides/events/bola-attack.png)

    表示されるリクエスト数は、閾値超過後に送信されたリクエストの数に対応しています（[行動型攻撃検出の詳細](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)参照）。この数が5を超える場合、リクエストのサンプリングが適用され、詳細は最初の5ヒットのみが表示されます（[リクエストサンプリングの詳細](../../user-guides/events/grouping-sampling.md#sampling-of-hits)参照）。

    BOLA攻撃を検索するには、`bola`検索タグを使用してください。すべてのフィルターについては、[検索使用方法](../../user-guides/search-and-filters/use-search.md)の指示をご確認ください。

## 要件と制限

**要件**

BOLA攻撃からリソースを保護するためには、実際のクライアントのIPアドレスが必要です。フィルタリングノードがプロキシサーバーまたはロードバランサーの背後に配置されている場合は、実際のクライアントIPアドレスを表示するように[設定](../using-proxy-or-balancer-en.md)してください。

**制限事項**

BOLA攻撃の兆候を検索する際、Wallarmノードは他の攻撃タイプの兆候を含まないHTTPリクエストのみを解析します。