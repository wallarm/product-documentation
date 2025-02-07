Starting from the version 3.6, you can fine-tune the `overlimit_res` attack detection using the rule in Wallarm Console.
バージョン3.6から、Wallarm Consoleのルールを使用して`overlimit_res`攻撃検出を微調整できます。

Earlier, the [`wallarm_process_time_limit`][nginx-process-time-limit-docs] and [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX directives have been used. The listed directives are considered to be deprecated with the new rule release and will be deleted in future releases.
以前は、[`wallarm_process_time_limit`][nginx-process-time-limit-docs]と[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]NGINXディレクティブが使用されていました。新しいルールリリースにより、これらのディレクティブは非推奨と見なされ、将来のリリースで削除される予定です。

If the `overlimit_res` attack detection settings are customized via the listed directives, it is recommended to transfer them to the rule as follows:
もしlisted directivesによって`overlimit_res`攻撃検出設定がカスタマイズされている場合は、以下のようにルールへ移行することが推奨されます。

1. Open Wallarm Console → **Rules** and proceed to the [**Limit request processing time**][overlimit-res-rule-docs] rule setup.
   Wallarm Console→**Rules**を開き、[**Limit request processing time**][overlimit-res-rule-docs]ルールの設定に進みます。
1. Configure the rule as done via the NGINX directives:
   NGINXディレクティブで行われたようにルールを設定します:
    * The rule condition should match the NGINX configuration block with the `wallarm_process_time_limit` and `wallarm_process_time_limit_block` directives specified.
      ルール条件は、`wallarm_process_time_limit`と`wallarm_process_time_limit_block`ディレクティブが指定されたNGINX構成ブロックと一致する必要があります。
    * The time limit for the node to process a single request (milliseconds): the value of `wallarm_process_time_limit`.
      ノードが単一のリクエストを処理するための制限時間（ミリ秒）：`wallarm_process_time_limit`の値です。
    
        !!! warning "システムメモリ枯渇のリスク"
            高い制限時間や、制限時間超過後のリクエスト処理の継続は、メモリ枯渇またはタイムアウトによるリクエスト処理につながる可能性があります。
    
    * The node will either block or pass the `overlimit_res` attack depending on the [node filtration mode][waf-mode-instr]:
      ノードは[node filtration mode][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックまたは通過させます:
        
        * In the **monitoring** mode, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.
          **monitoring**モードでは、ノードは元のリクエストをアプリケーションアドレスへ転送します。アプリケーションは、処理済みおよび未処理のリクエスト部分に含まれる攻撃によって悪用されるリスクがあります。
        * In the **safe blocking** mode, the node blocks the request if it is originated from the [graylisted][graylist-docs] IP address. Otherwise, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.
          **safe blocking**モードでは、リクエストが[graylisted][graylist-docs]IPアドレスから発信された場合、ノードはリクエストをブロックします。そうでなければ、ノードは元のリクエストをアプリケーションアドレスへ転送します。アプリケーションは、処理済みおよび未処理のリクエスト部分に含まれる攻撃によって悪用されるリスクがあります。
        * In the **block** mode, the node blocks the request.
          **block**モードでは、ノードはリクエストをブロックします。
1. Delete the `wallarm_process_time_limit` and `wallarm_process_time_limit_block` NGINX directives from the NGINX configuration file.
   NGINX構成ファイルから`wallarm_process_time_limit`と`wallarm_process_time_limit_block`NGINXディレクティブを削除します。

If the `overlimit_res` attack detection is fine-tuned using both the directives and the rule, the node will process requests as the rule sets.
もし`overlimit_res`攻撃検出がディレクティブとルールの両方で微調整されている場合、ノードはルールで設定された通りにリクエストを処理します。