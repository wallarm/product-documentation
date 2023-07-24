[variability-in-endpoints-docs]:       ../../about-wallarm/api-discovery.md#variability-in-endpoints
[changes-in-api-docs]:       ../../user-guides/api-discovery.md#tracking-changes-in-api
[bola-protection-for-endpoints-docs]:  ../../about-wallarm/api-discovery.md#automatic-bola-protection

# BOLA（IDOR）保護の設定

[壊れたオブジェクトレベル認証 (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) のような動作攻撃は、同じ名前の脆弱性を悪用します。この脆弱性により、攻撃者は API リクエストを介してオブジェクトに識別子でアクセスし、承認メカニズムをバイパスしてそのデータを読み取ったり変更したりすることができます。この記事では、BOLA 攻撃に対するアプリケーションの保護方法について説明します。

デフォルトでは、Wallarm は BOLA タイプの脆弱性（IDOR とも呼ばれる）だけを自動的に検出しますが、その悪用試行は検出しません。

Wallarm で BOLA 攻撃を検出し、ブロックするためのオプションは次のとおりです。

* [**BOLA** トリガーの手動作成](#manual-creation-of-bola-trigger)
* [Wallarm Console UI を介して有効化される自動 BOLA 保護を備えた API Discovery モジュールの使用](#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)

!!! warning "BOLA 保護の制限"
    BOLA 攻撃検出は、Wallarm ノード 4.2 以降でのみサポートされています。

    Wallarm ノード 4.2 以降は、以下のリクエストのみを BOLA 攻撃の兆候について分析します。
    
    * HTTP プロトコルを介して送信されたリクエスト。
    * 他の攻撃タイプの兆候を含まないリクエスト。例えば、次のリクエストは BOLA 攻撃とは見なされません。

        * これらのリクエストには、[入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) の兆候が含まれています。
        * これらのリクエストは、[ルール **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)で指定された正規表現と一致します。

## 前提条件

BOLA 攻撃からリソースを保護するためには、環境が次の要件を満たしていることを確認してください。

* Wallarm ノード 4.2 またはそれ以降があります。
* フィルタリングノードがプロキシサーバーまたはロードバランサーの背後に展開されている場合は、実際のクライアントの IP アドレスを表示するように[設定](../using-proxy-or-balancer-en.md)します。

## BOLA トリガーの手動作成

Wallarm ノードが BOLA 攻撃を識別するには：

1. Wallarm Console → **Triggers** を開き、**BOLA** トリガー設定に進みます。
1. BOLA 攻撃としてリクエストを定義する条件を設定します。

    * 一定期間に **同じ IP からのリクエスト** 数。
    * BOLA 攻撃から保護された **URI** および指定された数のリクエストを受信します。値は、識別子によってオブジェクトを指す API エンドポイントである必要があります。このタイプのエンドポイントは、BOLA 攻撃に潜在的に脆弱です。
    
        オブジェクトを識別する PATH パラメータを指定するには、シンボル `*` を使用します。例えば：

        ```bash
        example.com/shops/*/financial_info
        ```

        URI は、トリガ作成ウィンドウの [URI コンストラクタ](../../user-guides/rules/add-rule.md#uri-constructor) または [高度な編集フォーム](../../user-guides/rules/add-rule.md#advanced-edit-form) を経由して設定できます。

    * （オプション）BOLA 攻撃から保護された [**アプリケーション**](../../user-guides/settings/applications.md) および指定された数のリクエストを受信します。

        複数のドメインに同じ名前を使用している場合、このフィルタは **URI** フィルタのドメインが割り当てられたアプリケーションを指し示すように設定することをお勧めします。

    * （オプション）リクエストを発生させる 1 つ以上の **IP**。
1. トリガーの反応を選択します。

    * **Mark as BOLA**。しきい値を超えるリクエストは BOLA 攻撃としてマークされ、Wallarm Console の **Events** セクションに表示されます。Wallarm ノードはこれらの悪意のあるリクエストをブロックしません。
    * 悪意のあるリクエストを発生させる[**IP アドレスを拒否リストに登録**](../../user-guides/ip-lists/denylist.md)およびブロック期間。
    
        Wallarm ノードは、拒否リストに登録された IP からの正当なリクエストと悪意のあるリクエスト（BOLA 攻撃を含む）を両方ブロックします。
    
    * 悪意のあるリクエストを発生させる[**IP アドレスをグレーリストに登録**](../../user-guides/ip-lists/graylist.md)およびブロック期間。
    
        Wallarm ノードは、グレーリストに登録された IP からのリクエストを、リクエストに[入力検証](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[`vpatch`](../../user-guides/rules/vpatch-rule.md)、または[カスタム](../../user-guides/rules/regex-rule.md)の攻撃兆候が含まれている場合にのみブロックします。
        
        !!! info "グレーリストに登録された IP からの BOLA 攻撃"
            グレーリストに登録された IP からの BOLA 攻撃はブロックされません。
1. トリガーを保存し、[クラウドとノードの同期が完了する](../configure-cloud-node-synchronization-en.md)のを待ちます（通常は 2〜4 分かかります）。

ショップの財務データ（API エンドポイントは `https://example.com/shops/{shop_id}/financial_info`）を狙った BOLA 攻撃を検出しブロックするトリガーの例：

![!BOLA トリガー](../../images/user-guides/triggers/trigger-example7.png)

BOLA 保護のために、異なるフィルタを持つ複数のトリガを設定できます。## API Discoveryによって発見されたエンドポイントの自動BOLA保護<a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

自動BOLA保護は、**[API Discovery](../../about-wallarm/api-discovery.md)**モジュールを使用している場合に利用できます。

自動保護を有効にするには、Wallarm Console → **BOLA保護**に移動し、スイッチを有効状態に切り替えます：

![!BOLAトリガー](../../images/user-guides/bola-protection/trigger-enabled-state.png)

--8<-- "../include-ja/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

**BOLA保護**セクションのUIでは、[BOLA自動検出テンプレートの編集](../../user-guides/bola-protection.md)により、デフォルトのWallarm動作（BOLA攻撃のブロックを含む）を微調整できます。

## BOLA保護の設定をテストする

1. 設定された閾値を超える数のリクエストを保護されたURIに送信します。例えば、`https://example.com/shops/{shop_id}/financial_info` エンドポイントに `{shop_id}` の異なる値を持つ50件のリクエスト：

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/shops/$i/financial_info ; done
    ```
1. トリガー反応が **Denylist IPアドレス** の場合、Wallarm Console → **IPリスト** → **Denylist**を開いて、送信元のIPアドレスがブロックされていることを確認します。

    トリガー反応が **Graylist IPアドレス** の場合、Wallarm Consoleの **IPリスト** → **Graylist** セクションを確認してください。
1. **イベント**セクションを開き、リクエストがBOLA攻撃としてリストに表示されていることを確認します。

    ![!BOLA攻撃 in the UI](../../images/user-guides/events/bola-attack.png)

    表示されるリクエストの数は、トリガーの閾値を超えた後に送信されたリクエストの数に対応しています（[行動攻撃の検出についての詳細](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)）。この数が5より大きい場合は、リクエストサンプリングが適用され、最初の5件のヒットのみリクエストの詳細が表示されます（[リクエストのサンプリングについての詳細](../../user-guides/events/analyze-attack.md#sampling-of-hits)）。

    BOLA攻撃を検索するには、`bola`検索タグを使用できます。すべてのフィルターは、[検索の使用方法に関する指示](../../user-guides/search-and-filters/use-search.md)に記載されています。