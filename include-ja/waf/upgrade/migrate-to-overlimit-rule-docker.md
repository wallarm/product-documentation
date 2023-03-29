バージョン3.6から、Wallarmコンソール内のルールを使用して `overlimit_res` 攻撃検出の微調整を行うことができます。

以前は、以下のオプションが使用されていました：

* [`wallarm_process_time_limit`][nginx-process-time-limit-docs] および [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] のNGINXディレクティブ
* [`process_time_limit`][envoy-process-time-limit-docs] および [`process_time_limit_block`][envoy-process-time-limit-block-docs] のEnvoyパラメーター

上記のディレクティブとパラメーターは、新しいルールリリースとともに非推奨とされ、今後のリリースで削除される予定です。

`overlimit_res` 攻撃検出設定が上記のパラメーターを使用してカスタマイズされている場合、以下のようにルールに移行することが推奨されます：

1. Wallarmコンソール → **ルール** を開き、[**overlimit_res攻撃検出の微調整**][overlimit-res-rule-docs]ルール設定に進みます。
1. マウントされた設定ファイルで行われたように、ルールを設定します：

    * ルール条件は、`wallarm_process_time_limit` および `wallarm_process_time_limit_block` ディレクティブまたは `process_time_limit` および `process_time_limit_block` パラメーターが指定されたNGINXまたはEnvoy設定ブロックと一致する必要があります。
    * ノードが1つのリクエストを処理するための時間制限（ミリ秒）：`wallarm_process_time_limit` または `process_time_limit` の値。
    * リクエスト処理：**処理を停止**オプションが推奨されます。
    
        !!! warning "システムメモリが不足するリスク"
            時間制限が高い場合や、制限を超えた後にリクエストの処理が続く場合、メモリの消耗や時間外のリクエスト処理が発生する可能性があります。

    * overlimit_res攻撃を登録：**イベントに登録して表示** オプションが推奨されます。

        `wallarm_process_time_limit_block` または `process_time_limit_block` の値が `off` の場合は、**攻撃イベントを作成しない** オプションを選択してください。

    * ルールには、`wallarm_process_time_limit_block` ディレクティブ（Envoyの場合は `process_time_limit_block` ）と明示的に同等のオプションがありません。ルールが **イベントに登録して表示** を設定する場合、ノードは [ノードのフィルタリングモード][waf-mode-instr] に応じて `overlimit_res` 攻撃をブロックまたは通過させます：

        * **監視**モードでは、ノードは元のリクエストをアプリケーションのアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **安全ブロック**モードでは、ノードはリクエストが[グレーリスト][graylist-docs]されたIPアドレスから発信された場合にリクエストをブロックします。それ以外の場合、ノードは元のリクエストをアプリケーションのアドレスに転送します。アプリケーションは、処理されたリクエスト部分と未処理のリクエスト部分の両方に含まれる攻撃によって悪用されるリスクがあります。
        * **ブロック**モードでは、ノードはリクエストをブロックします。
1. マウントされた設定ファイルから、`wallarm_process_time_limit` 、`wallarm_process_time_limit_block` のNGINXディレクティブ、そして `process_time_limit` 、`process_time_limit_block` のEnvoyパラメーターを削除します。

    `overlimit_res` 攻撃検出がパラメーターとルールの両方で微調整されている場合、ノードはルールに従ってリクエストを処理します。