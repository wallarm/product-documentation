# 手動によるBOLA保護

[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola)のような振る舞い攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストを介してオブジェクトにその識別子でアクセスし、認証メカニズムをバイパスしてデータを読み取ったり変更したりできます。この記事では、[WAAP](../../about-wallarm/waap-overview.md)のトリガーによって提供されるBOLA保護措置について説明します。

!!! info "その他のBOLA保護措置"
    代わりに、または追加で、[API Discoveryによって見つかったエンドポイントの自動BOLA保護を設定](protecting-against-bola.md)することができます。

## 設定

デフォルトでは、WallarmはBOLAタイプ（IDORとも呼ばれます）の脆弱性のみを自動的に発見しますが、その悪用試みを検出しません。

WallarmノードがBOLA攻撃を識別するためには：

1. Wallarmコンソール → **トリガー** へ進み、**BOLA**トリガーの設定を行います。
1. BOLA攻撃としてリクエストを定義する条件を設定します：

    * 特定の期間に同じIPからの**リクエスト数**です。
    * BOLA攻撃から保護する**URI**および指定された数のリクエストを受信します。この値はオブジェクトをその識別子で指しているAPIエンドポイントであるべきです。このエンドポイントタイプはBOLA攻撃に対して潜在的に脆弱です。

        オブジェクトを識別するPATHパラメーターを指定するには、`*`記号を使用します。例えば：

        ```bash
        example.com/shops/*/financial_info
        ```

        URIは、トリガー作成ウィンドウ内の[URIコンストラクタ](../../user-guides/rules/rules.md#uri-constructor)または[高度な編集フォーム](../../user-guides/rules/rules.md#advanced-edit-form)を介して設定できます。

    * （オプション）[**アプリケーション**](../../user-guides/settings/applications.md)は、指定された数のリクエストを受け取り、BOLA攻撃から保護されます。

        複数のドメインに同じ名前を使用する場合、このフィルターは**URI**フィルターに割り当てられているドメインのアプリケーションを指すことをお勧めします。

    * （オプション）リクエストを生成する1つ以上の**IP**です。
1. トリガー反応を選択します：

    * **BOLAとしてマーク**。しきい値を超えるリクエストはBOLA攻撃としてマークされ、Wallarmコンソールの**攻撃**セクションに表示されます。Wallarmノードは、これらの悪意のあるリクエストをブロックしません。
    * 悪意のあるリクエストを発信した[**IPアドレスをブラックリストに登録**](../../user-guides/ip-lists/overview.md)し、ブロック期間を設定します。
    
        Wallarmノードは、ブラックリストに登録されたIPから発信された合法的なリクエストと悪意のあるリクエスト（BOLA攻撃を含む）の両方をブロックします。
    
    * 悪意のあるリクエストを発信した[**IPアドレスをグレーリストに登録**](../../user-guides/ip-lists/overview.md)し、ブロック期間を設定します。
    
        Wallarmノードは、グレーリストに登録されたIPからのリクエストをブロックしますが、リクエストが[入力検証](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[`vpatch`](../../user-guides/rules/vpatch-rule.md)、または[カスタム](../../user-guides/rules/regex-rule.md)攻撃の兆候を含む場合に限ります。
        
        !!! info "グレーリストに登録されたIPからのBOLA攻撃"
            グレーリストに登録されたIPからのBOLA攻撃はブロックされません。

        ![BOLAトリガー](../../images/user-guides/triggers/trigger-example7.png)

1. トリガーを保存し、[クラウドとノードの同期完了](../configure-cloud-node-synchronization-en.md)を待ちます（通常2～4分かかります）。

## テスト

1. 設定されたしきい値を超えるリクエスト数を保護されたURIに送信します。例えば、エンドポイント`https://example.com/shops/{shop_id}/financial_info`に異なる`{shop_id}`の値で50リクエスト：

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/shops/$i/financial_info ; done
    ```
1. トリガー反応が**IPアドレスをブラックリストに登録**の場合は、Wallarmコンソール → **IPリスト** → **ブラックリスト**を開き、ソースIPアドレスがブロックされていることを確認します。

    トリガー反応が**IPアドレスをグレーリストに登録**の場合は、Wallarmコンソールのセクション**IPリスト** → **グレーリスト**をチェックします。
1. **攻撃**セクションを開き、リクエストがBOLA攻撃としてリストに表示されていることを確認します。

    ![UI内のBOLA攻撃](../../images/user-guides/events/bola-attack.png)

    表示されるリクエスト数は、トリガーしきい値を超えた後に送信されたリクエスト数に対応します（[振る舞い攻撃の検出に関する詳細](../../attacks-vulns-list.md#behavioral-attacks)）。この数が5より多い場合は、リクエストのサンプリングが適用され、最初の5ヒットのリクエストの詳細のみが表示されます（[リクエストのサンプリングに関する詳細](../../user-guides/events/analyze-attack.md#sampling-of-hits)）。

    BOLA攻撃を検索するには、`bola`検索タグを使用できます。すべてのフィルターは、[検索の使用方法の指示](../../user-guides/search-and-filters/use-search.md)で説明されています。

## トリガー処理の優先順位
            
--8<-- "../include/trigger-processing-priorities.md"

## 要件と制限

**要件**

BOLA攻撃からリソースを保護するには、実際のクライアントのIPアドレスが必要です。フィルタリングノードがプロキシサーバーまたはロードバランサーの背後に配置されている場合は、実際のクライアントのIPアドレスを表示するように[設定](../using-proxy-or-balancer-en.md)します。

**制限**

他の攻撃タイプの兆候を含まないHTTPリクエストのみを分析して、BOLA攻撃の兆候を検索します。