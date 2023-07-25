最初に検出された攻撃に基づいて、**アクティブ脅威検証**モジュールは、同じエンドポイントへの攻撃を異なるペイロードで行う多くの新しいテストリクエストを作成します。この仕組みにより、Wallarmは攻撃中に潜在的に悪用される可能性のある脆弱性を検出することができます。アクティブ脅威検証プロセスでは、特定の攻撃ベクタに対してアプリケーションが脆弱でないことを確認するか、実際のアプリケーションセキュリティ問題を見つけます。

[モジュールが検出できる脆弱性のリスト](../attacks-vulns-list.ja.md)

**アクティブ脅威検証**プロセスは、WebおよびAPIセキュリティの脆弱性を持つ可能性のある保護されたアプリケーションを確認するために、以下のロジックを使用しています:

1. Wallarmフィルタリングノードによって検出され、接続されたWallarm Cloudにアップロードされた悪意のあるリクエストのグループ(すべての攻撃)ごとに、システムはどの特定のエンドポイント(URL、リクエスト文字列パラメータ、JSON属性、XMLフィールドなど)が攻撃されたか、攻撃者がどのようなタイプの脆弱性(SQLi、RCE、XSSなど)を悪用しようとしていたかを分析します。例として以下の悪意のあるGETリクエストを見てみましょう。

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    リクエストからシステムは以下の詳細を学びます。
    
    * 攻撃されたURLは`https://example.com/login`
    * 使用された攻撃のタイプはSQLi(`UNION SELECT username, password`ペイロードによる)
    * 攻撃されたクエリ文字列パラメータは`user`
    * リクエストに含まれる追加情報は、リクエスト文字列パラメータ`token=IyEvYmluL3NoCg` (おそらくアプリケーションがユーザーを認証するために使用されています)
2. 収集された情報を使用して、**アクティブ脅威検証**モジュールは、同じタイプの攻撃(SQLiなど)に対する異なるタイプの悪意のあるペイロードで、最初にターゲットにされたエンドポイントに対して約100〜150のテストリクエストのリストを作成します。例えば:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```

    !!! info "悪意のあるペイロードはリソースを損傷させません"
        生成されたリクエストの悪意のあるペイロードは、実際の悪意のある構文は含まれておらず、攻撃原理を模倣することを目的としています。その結果、リソースには損傷を与えません。
3. **アクティブ脅威検証**モジュールは、Wallarm保護を迂回してアプリケーションに生成されたテストリクエストを送信し([allowlisting feature][allowlist-scanner-addresses]を使用して)、特定のエンドポイントでアプリケーションが特定の攻撃タイプに対して脆弱でないことを確認します。モジュールがアプリケーションに実際のセキュリティ脆弱性があると疑われる場合、[incident](../user-guides/events/check-attack.ja.md#incidents)タイプのイベントを作成します。

    !!! info "リクエストの`User-Agent` HTTPSヘッダ値"
        **アクティブ脅威検証**モジュールのリクエストにおける`User-Agent`HTTPヘッダは、`Wallarm Threat-Verification (v1.x)`という値になります。
4. 検出されたセキュリティインシデントはWallarm Consoleで報告され、利用可能なサードパーティの[Integrations](../user-guides/settings/integrations/integrations-intro.ja.md)および[Triggers](../user-guides/triggers/triggers.ja.md)を介してセキュリティチームに通知することができます。