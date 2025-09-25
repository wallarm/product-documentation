[img-remove-point]:         ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:           ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:           ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:          ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:          ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:   ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]:    ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]:           ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:           ../../dsl/points/parsers.md

# ポイント処理ルールの設定

ポイントは、Wallarmアカウントのpolicy editor内の**Insertion Points**セクションで設定します。このセクションは次の2つのブロックに分かれています:

* **Where in the request to include** 処理が許可されているポイント用
* **Where in the request to exclude** 処理が許可されていないポイント用

作成したポイントの一覧を追加するには、該当のブロックで**Add insertion point**ボタンを使用します。

ポイントを削除するには、その隣の«—»記号を使用します:

![ポイントの削除][img-remove-point]

!!! info "基本的なポイント"
    ポリシーを作成する際、一般的なポイントが**Where in the request to include**セクションに自動的に追加されます:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: URIの[パス][link-path-point]の任意の部分
    * `ACTION_NAME`: [アクション][link-action-name-point]
    * `ACTION_EXT`: [拡張子][link-action-ext-point]
    * `GET_.*`: 任意の[GETパラメータ][link-get-point]
    * `POST_.*`: 任意の[POSTパラメータ][link-post-point]
    
    デフォルトでは、**Where in the request to exclude**セクションのポイント一覧は空です。

    同じポイント一覧がデフォルトポリシーにも設定されています。このポリシーは変更できません。

 
!!! info "ポイントのリファレンス"
    ポイントを作成または編集する際は、**How to use**リンクをクリックすると、ポイントに関する追加の詳細情報を確認できます。

    ![ポイントのリファレンス][img-point-help]

    FASTが処理可能なポイントの全一覧は[リンク][doc-point-list]で参照できます。