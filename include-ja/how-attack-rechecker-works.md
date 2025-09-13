最初に検出された攻撃に基づいて、**Threat Replay Testing**モジュールは同一のエンドポイントを狙う異なるペイロードの多数の新しいテストリクエストを作成します。この仕組みにより、Wallarmは攻撃中に悪用される可能性のある脆弱性を検出できます。Threat Replay Testingのプロセスは、特定の攻撃ベクトルに対してアプリケーションが脆弱でないことを確認するか、実際のアプリケーションのセキュリティ問題を発見します。

[モジュールで検出できる脆弱性の一覧](../attacks-vulns-list.md)

**Threat Replay Testing**のプロセスは、保護対象のアプリケーションに存在し得るWebおよびAPIのセキュリティ脆弱性を確認するために、次のロジックを使用します。

1. Wallarmフィルタリングノードで検出され、接続先のWallarm Cloudにアップロードされた悪意のあるリクエストの各グループ（各攻撃）について、システムはどのエンドポイント（URL、リクエストストリングパラメータ、JSON属性、XMLフィールドなど）が攻撃され、攻撃者がどの種類の脆弱性（SQLi、RCE、XSSなど）を悪用しようとしていたかを分析します。例えば、次の悪意のあるGETリクエストを示します:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    このリクエストから、システムは次の詳細を把握します:
    
    * 攻撃されたURLは`https://example.com/login`です
    * 使用された攻撃の種類はSQLiです（`UNION SELECT username, password`というペイロードに基づきます）
    * 攻撃対象のクエリストリングパラメータは`user`です
    * 追加情報として、リクエストストリングパラメータ`token=IyEvYmluL3NoCg`が含まれています（アプリケーションがユーザーを認証するために使用している可能性があります）
2. 収集した情報を使用して、**Threat Replay Testing**モジュールは、元のターゲットエンドポイントに対して、同じ攻撃タイプ（例: SQLi）に関する異なる種類の悪意のあるペイロードを用いた約100〜150件のテストリクエストのリストを作成します。例えば:

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

    !!! info "悪意のあるペイロードはお客様のリソースに害を与えません"
        生成されたリクエストの悪意のあるペイロードには実際の悪意のある構文は含まれておらず、攻撃の原理を模倣することのみを意図しています。そのため、お客様のリソースに害を与えることはありません。
3. **Threat Replay Testing**モジュールは、生成したテストリクエストを[allowlist機能][allowlist-scanner-addresses]を使用してWallarmの保護をバイパスしつつアプリケーションに送信し、特定のエンドポイントにあるアプリケーションが特定の攻撃タイプに対して脆弱でないことを検証します。モジュールがアプリケーションに実際のセキュリティ脆弱性があると疑う場合、タイプが[incident](../user-guides/events/check-attack.md#incidents)のイベントを作成します。

    !!! info "リクエスト内の`User-Agent` HTTPSヘッダーの値"
        **Threat Replay Testing**モジュールのリクエストに含まれる`User-Agent` HTTPヘッダーの値は`Wallarm Threat-Verification (v1.x)`です。
4. 検出されたセキュリティインシデントはWallarm Consoleにレポートされ、利用可能なサードパーティの[Integrations](../user-guides/settings/integrations/integrations-intro.md)および[Triggers](../user-guides/triggers/triggers.md)経由でセキュリティチームに送信できます。