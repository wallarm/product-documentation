バージョン3.6から、`overlimit_res`攻撃検出の設定をWallarm Consoleでルールを使用して微調整することができます。

以前は、以下のオプションが使用されていました：

* NGINXのディレクティブ [`wallarm_process_time_limit`][nginx-process-time-limit-docs] と [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] 
* Envoyのパラメーター [`process_time_limit`][envoy-process-time-limit-docs] と [`process_time_limit_block`][envoy-process-time-limit-block-docs]

これらのディレクティブとパラメータは、新しいルールリリースで非推奨とされ、将来のリリースで削除される予定です。

もし`overlimit_res`攻撃検出の設定が上記のパラメータでカスタマイズされている場合、以下のようにルールに移行することを推奨します：

1. Wallarm Consoleを開き、**Rules**に進んで[**Fine-tune the overlimit_res attack detection**][overlimit-res-rule-docs] ルールの設定を行います。
1. マウントされた設定ファイルで行われているようにルールを設定します：

    * ルール条件は、`wallarm_process_time_limit`と`wallarm_process_time_limit_block`のディレクティブまたは`process_time_limit`と`process_time_limit_block`のパラメーターが指定されているNGINXまたはEnvoyの設定ブロックと一致する必要があります。
    * ノードが単一のリクエストを処理するための時間制限（ミリ秒）： `wallarm_process_time_limit`または`process_time_limit`の値。
    * リクエスト処理 ：**Stop processing**オプションが推奨されます。
    
       !!! warning "後述システムメモリの枯渇リスク"
            許容制限時間が長すぎるおよび/または制限を超えた後のリクエスト処理の継続は、メモリ枯渇やタイムアウトによるリクエスト処理のリスクを引き起こす可能性があります。

    * overlimit_res攻撃登録：**Register and display in the events**オプションが推奨されます。

      `wallarm_process_time_limit_block`または`process_time_limit_block`の値が`off`の場合、**攻撃イベントを作成しない**オプションを選択してください。

    * ルールには`wallarm_process_time_limit_block`(`process_time_limit_block` in Envoy)ディレクティブの明確な同等オプションはありません。ルールが**Register and display in the events**を設定すると、ノードは[node filtration mode][waf-mode-instr]に応じて`overlimit_res`攻撃をブロックまたは許可します：

        * **監視**モードでは、ノードはオリジナルのリクエストをアプリケーションのアドレスに転送します。 processed および unprocessed のリクエストパートの両方に含まれる攻撃によってアプリケーションが悪用されるリスクがあります。
        * **safe blocking**モードでは、ノードはリクエストが[graylisted][graylist-docs] IPアドレスから生成された場合、リクエストをブロックします。それ以外の場合は、ノードが元のリクエストをアプリケーションのアドレスに転送します。 processed および unprocessed のリクエストパートの両方に含まれる攻撃によってアプリケーションが悪用されるリスクがあります。
        * **ブロック**モードでは、ノードはリクエストをブロックします。
1. `wallarm_process_time_limit`、`wallarm_process_time_limit_block`のNGINXディレクティブおよび`process_time_limit`、`process_time_limit_block`のEnvoyパラメータをマウントされた設定ファイルから削除します。

    もし`overlimit_res`攻撃検出がパラメータとルールの両方を使用して詳細調整されている場合、ノードはルールの設定に従ってリクエストを行います。