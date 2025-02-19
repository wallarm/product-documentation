Based on the initial detected attacks, the **Threat Replay Testing** module creates a lot of new test requests with different payloads attacking the same endpoint. This mechanism allows Wallarm to detect vulnerabilities that could be potentially exploited during attacks. The process of Threat Replay Testing will either confirm that the application is not vulnerable to the specific attack vectors or find actual application security issues.
初期に検出された攻撃に基づいて、**Threat Replay Testing**モジュールは同一のエンドポイントに対して異なるペイロードを用いた多数の新しいテストリクエストを作成します。この仕組みにより、Wallarmは攻撃時に悪用される可能性のある脆弱性を検出できます。Threat Replay Testingのプロセスは、アプリケーションが特定の攻撃ベクトルに対して脆弱でないことを確認するか、実際のアプリケーションセキュリティ上の問題を発見します。

[List of vulnerabilities that can be detected by the module](../attacks-vulns-list.md)
[モジュールで検出可能な脆弱性の一覧](../attacks-vulns-list.md)

The **Threat Replay Testing** process uses the following logic to check the protected application for possible Web and API security vulnerabilities:
**Threat Replay Testing**プロセスは、保護されたアプリケーションにおけるWebおよびAPIのセキュリティ脆弱性の可能性を検証するため、以下のロジックを使用します：

1. For every group of malicious request (every attack) detected by a Wallarm filtering node and uploaded to the connected Wallarm Cloud, the system analyzes which specific endpoint (URL, request string parameter, JSON attribute, XML field, etc) was attacked and which specific kind of vulnerability (SQLi, RCE, XSS, etc) the attacker was trying to exploit. For example, let's take a look at the following malicious GET request:
   Wallarmフィルタリングノードで検出され、接続されたWallarm Cloudにアップロードされた悪意あるリクエストの各グループ（各攻撃）について、システムはどの特定のエンドポイント（URL、リクエスト文字列パラメータ、JSON属性、XMLフィールドなど）が攻撃されたか、また攻撃者がどの特定の種類の脆弱性（SQLi、RCE、XSSなど）を悪用しようとしたかを解析します。例えば、以下の悪意あるGETリクエストを見てみましょう：

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    From the request the system will learn the following details:
    リクエストからシステムは次の詳細を把握します：
    
    * The attacked URL is `https://example.com/login`
      攻撃されたURLは`https://example.com/login`です
    * The type of used attack is SQLi (according to the `UNION SELECT username, password` payload)
      使用された攻撃の種類はSQLiです（`UNION SELECT username, password`ペイロードに基づきます）
    * The attacked query string parameter is `user`
      攻撃されたクエリ文字列パラメータは`user`です
    * Additional piece of information provided in the request is the request string parameter `token=IyEvYmluL3NoCg` (it is probably used by the application to authenticate the user)
      リクエストで提供された追加情報はリクエスト文字列パラメータ`token=IyEvYmluL3NoCg`であり、アプリケーションがユーザーの認証に使用している可能性があります

2. Using the collected information the **Threat Replay Testing** module will create a list of about 100-150 test requests to the originally targeted endpoint but with different types of malicious payloads for the same type of attack (like SQLi). For example:
   収集した情報を利用して、**Threat Replay Testing**モジュールは元の攻撃対象エンドポイントに対し、同一種類の攻撃（たとえばSQLi）に対する異なる種類の悪意あるペイロードを用いた約100～150件のテストリクエストのリストを作成します。例えば：

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

    !!! info "Malicious payloads do not harm your resources"
        Generated requestsの悪意あるペイロードは実際の悪意ある構文を含まず、攻撃の原理を模倣するためのものです。その結果、リソースに害を及ぼすことはありません。

3. The **Threat Replay Testing** module will send generated test requests to the application bypassing the Wallarm protection (using the [allowlisting feature][allowlist-scanner-addresses]) and verify that the application at the specific endpoint is not vulnerable to the specific attack type. If the module suspects that the application has an actual security vulnerability, it will create an event with type [incident](../user-guides/events/check-attack.md#incidents).
   **Threat Replay Testing**モジュールは、[allowlisting feature][allowlist-scanner-addresses]を使用してWallarmの保護を回避し、生成されたテストリクエストをアプリケーションに送信します。そして、特定のエンドポイントにあるアプリケーションがその特定の攻撃タイプに対して脆弱でないことを検証します。もしモジュールがアプリケーションに実際のセキュリティ脆弱性が存在すると疑われた場合は、[incident](../user-guides/events/check-attack.md#incidents)タイプのイベントを作成します。

    !!! info "`User-Agent` HTTPS header value in the requests"
        **Threat Replay Testing**モジュールのリクエストに含まれる`User-Agent` HTTPヘッダーは、値`Wallarm Threat-Verification (v1.x)`となります。

4. Detected security incidents are reported in Wallarm Console and are able to be dispatched to your security team via available third-party [Integrations](../user-guides/settings/integrations/integrations-intro.md) and [Triggers](../user-guides/triggers/triggers.md).
   検出されたセキュリティインシデントはWallarm Consoleで報告され、利用可能なサードパーティーの[Integrations](../user-guides/settings/integrations/integrations-intro.md)および[Triggers](../user-guides/triggers/triggers.md)を通じて、セキュリティチームに連携できます。