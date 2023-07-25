# ブルートフォース保護の設定

行動攻撃（ブルートフォース攻撃）は、適切に設定された場合にWallarmによって検出できる攻撃タイプの1つです。これらの手順は、Wallarmノードを設定して、アプリケーションをブルートフォース攻撃から保護する方法を提供します。デフォルトでは、Wallarmノードはブルートフォース攻撃を検出しません。

次のブルートフォース攻撃のクラスがあります。

* [通常のブルートフォース攻撃](../../attacks-vulns-list.ja.md#bruteforce-attack)：パスワードブルートフォーシング、セッション識別子ブルートフォーシング、資格情報の詰め込み。これらの攻撃は、限られた時間枠内で、典型的なURIに送信される強制的なパラメータ値が異なる大量のリクエストによって特徴付けられます。
* [強制ブラウジング](../../attacks-vulns-list.ja.md#forced-browsing)。これらの攻撃は、限られた時間枠内で、異なるURIに対するリクエストに対してレスポンスコード404が多数返されることで特徴付けられます。

    この攻撃の目的は、隠されたリソース（例：アプリケーションコンポーネントの情報が含まれたディレクトリやファイル）を列挙してアクセスすることです。通常、強制ブラウジング攻撃タイプは、攻撃者がアプリケーションに関する情報を収集し、その情報を利用して他の攻撃タイプを実行することができます。

[詳細なブルートフォースの説明 →](../../about-wallarm/protecting-against-attacks.ja.md#behavioral-attacks)

!!! warning "ブルートフォース保護の制限"
    ブルートフォース攻撃の兆候を探す際、Wallarmノードは他の攻撃タイプの兆候を含まないHTTPリクエストのみを分析します。例えば、次のようなケースでは、リクエストはブルートフォース攻撃の一部と見なされません。

    * これらのリクエストには、[入力検証攻撃](../../about-wallarm/protecting-against-attacks.ja.md#input-validation-attacks)の兆候が含まれています。
    * これらのリクエストは、[ルール **正規表現ベースの攻撃指標の作成**](../../user-guides/rules/regex-rule.ja.md#adding-a-new-detection-rule)で指定された正規表現と一致します。

## 設定手順

1. フィルタリングノードがプロキシサーバーやロードバランサーの背後に展開されている場合は、クライアントの実際のIPアドレスの[表示を設定](../using-proxy-or-balancer-en.ja.md)します。
1. トリガー **Brute force** または **Forced browsing** を[設定](#configuring-the-trigger-to-identify-brute-force)します。
1. ブルートフォース保護の[設定をテスト](#testing-the-configuration-of-brute-force-protection)します。Brute Force攻撃の特定のトリガーの設定

!!! info "リクエスト数のトリガー"
    以下は、Brute Force保護の簡易設定の説明です。トリガー条件**リクエスト数**は、異なるブルートフォース攻撃クラス検出の条件に変更されました。また、**強制ブラウジング/ブルートフォース攻撃**のルールの設定はもはや必要ありません。

    **リクエスト数**のトリガーと攻撃のタグ付けルールが設定されている場合、それらは引き続き動作しますが、ルールを更新または再作成することはできません。それにもかかわらず、下記のように現在の設定を簡素化し、古いトリガーを無効にすることをお勧めします。

トリガーはブルートフォース攻撃の検出条件を設定します。検出するブルートフォース攻撃クラスに応じて、以下の条件を設定できます：

* **Brute force**は、同じIPアドレスからのリクエスト数に基づいて通常のブルートフォース攻撃を検出するためです。
* **Forced browsing**は、同じ起源IPリクエストを持つリクエストに返された404応答コードの数に基づいて強制ブラウジング攻撃を検出するためです。

トリガーを設定する手順は以下のとおりです。

1. Wallarm Consoleを開き、**Triggers**セクションでトリガー作成ウィンドウを開きます。
2. 検出するブルートフォース攻撃クラスに応じて条件**Brute force**または**Forced browsing**を選択します。
3. 閾値を設定します：

    * トリガー条件が**Brute force**の場合 - 閾値は、一定期間内に同じIPアドレスから生成されたリクエスト数です。
    * トリガー条件が**Forced browsing**の場合 - 閾値は、同じ起源IPリクエストを持つリクエストに返された404応答コード数です。
4. 必要に応じて**URI**を指定して、特定のエンドポイントに送信されたリクエストだけがトリガーをアクティブにします。例：

    * パスワードブルートフォーシング保護を設定する場合、認証に使用されるURIを指定します。
    * 強制ブラウジング攻撃に対する保護を設定する場合、リソースファイルディレクトリのURIを指定します。
    * URIが指定されていない場合、閾値を超えるリクエスト数のエンドポイントでトリガーがアクティブになります。

    URIは、[URIコンストラクタ](../../user-guides/rules/add-rule.ja.md#uri-constructor)やトリガー作成ウィンドウの[高度な編集フォーム](../../user-guides/rules/add-rule.ja.md#advanced-edit-form)で設定できます。

    !!! warning "ネストしたURIのトリガー"
        同一条件のトリガーでネストしたURIが指定されている場合、下位のネストレベルURIへのリクエストは、下位のネストレベルURIによるフィルタを持つトリガーでのみカウントされます。-404応答コードも同様です。

        条件にURIがないトリガーは、上位のネストレベルと見なされます。

        **例：**

        * **Brute force**条件の最初のトリガーはURIによるフィルタがありません（任意のアプリケーションまたはその部分へのリクエストは、このトリガーによってカウントされます）。
        * **Brute force**条件の2番目のトリガーは、`example.com/api`のURIによるフィルタがあります。

        リクエストは `example.com/api` へフィルタされた `example.com/api` の2番目のトリガーでのみカウントされます。
5. 必要に応じて、他のトリガーフィルタを設定します：

    * リクエストが宛先の**アプリケーション**
    * リクエストが送信される1つ以上の**IP**。
6. トリガーの反応を選択します：

    * トリガー条件が**Brute force**の場合 - 反応は**Mark as brute force**です。閾値を超えた後に受信したリクエストはブルートフォース攻撃としてマークされ、Wallarm Consoleの**Events**セクションに表示されます。
    * トリガー条件が**Forced browsing**の場合 - 反応は**Mark as forced browsing**です。閾値を超えた後に受信したリクエストは強制ブラウジング攻撃としてマークされ、Wallarm Consoleの**Events**セクションに表示されます。
    * **Denylist IPアドレス**とIPアドレスのブロック期間を悪意のあるリクエストソースのIPアドレスを[denylist](../../user-guides/ip-lists/denylist.ja.md)に追加します。閾値を超えた後、Wallarmノードはdenylisted IPからのすべてのリクエストをブロックします。
    * 悪意のあるリクエストソースのIPアドレスを[graylist](../../user-guides/ip-lists/graylist.ja.md)に登録する**Graylist IPアドレス**の期間を設定します。Wallarmノードは、リクエストが[入力検証](../../about-wallarm/protecting-against-attacks.ja.md#input-validation-attacks)、[`vpatch`](../../user-guides/rules/vpatch-rule.ja.md)または[カスタム](../../user-guides/rules/regex-rule.ja.md)攻撃の兆候を含む場合にのみ、graylisted IPからのリクエストをブロックします。Graylisted IPからのブルートフォース攻撃はブロックされません。
6. トリガーを保存し、[クラウドとノードの同期が完了する](../configure-cloud-node-synchronization-en.ja.md)のを待ちます(通常、2〜4分かかります)。

[`https://example.com/api/v1/login`](https://example.com/api/v1/login)に対して通常のブルートフォース攻撃をブロックする**Brute force**トリガーの例：

![!Brute forceトリガーの例](../../images/user-guides/triggers/trigger-example6.png)

提供された例の説明およびブルートフォース保護のための他のトリガー例は、この[リンク](../../user-guides/triggers/trigger-examples.ja.md#mark-requests-as-a-bruteforce-attack-if-31-or-more-requests-are-sent-to-the-protected-resource)を参照してください。

ブルートフォース保護のために複数のトリガーを設定できます。## ブルートフォース保護の設定をテストする

1. 設定されたしきい値を超えるリクエスト数を保護されたURIに送信します。たとえば、`example.com/api/v1/login`に50件のリクエストを送信します。

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/api/v1/login ; done
    ```
2. トリガーの反応が **Denylist IP アドレス** の場合、Wallarm Console → **IP リスト** → **Denylist** を開いて、送信元 IP アドレスがブロックされていることを確認します。

    トリガーの反応が **Graylist IP アドレス** の場合、Wallarm Console の **IP リスト** → **Graylist** セクションを確認してください。
3. **イベント** セクションを開き、リクエストがブルートフォース攻撃または強制ブラウジング攻撃としてリストに表示されていることを確認します。

    ![!強制ブラウジング攻撃のインターフェイス](../../images/user-guides/events/dirbust-attack.png)

    表示されるリクエストの数は、トリガーのしきい値を超えた後に送信されたリクエストの数に対応しています（[行動攻撃の検出に関する詳細](../../about-wallarm/protecting-against-attacks.ja.md#behavioral-attacks)）。この数が5を超える場合、リクエストのサンプリングが適用され、詳細は最初の5件のヒットに対してのみ表示されます（[リクエストのサンプリングに関する詳細](../../user-guides/events/analyze-attack.ja.md#sampling-of-hits)）。

    攻撃を検索するには、フィルタを使用できます。たとえば、強制ブラウジング攻撃には `dirbust`、ブルートフォース攻撃には `brute`。すべてのフィルタは、[検索の使用方法に関する説明書](../../user-guides/search-and-filters/use-search.ja.md)で説明されています。