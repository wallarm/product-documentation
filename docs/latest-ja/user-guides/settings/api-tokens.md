[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# APIトークン

Wallarm Console → **Settings** → **API tokens**では、[APIリクエストの認証](../../api/overview.md)や[フィルタリングノードのデプロイ](../../installation/supported-deployment-options.md)のためのトークンを管理できます。

WallarmのAPIトークンは柔軟な管理オプションを提供します。トークンの種類（パーソナルまたは共有）の選択、有効期限の設定、権限の指定ができます。

![Wallarm APIトークン][img-api-tokens-edit]

## パーソナルトークンと共有トークン

パーソナルまたは共有のAPIトークンを生成できます:

* パーソナルトークンは、割り当てられた権限に従い個人による使用を目的としています。パーソナルトークンを作成・使用できるのは[Administrators and Analysts](users.md#user-roles)のみです。

    パーソナルトークンの値は所有者のみがコピーして使用できます。ただし、Administratorsは会社アカウント内のユーザートークン一覧を閲覧できます。
* 共有トークンは複数のユーザーやシステムでの利用を想定しています。個々のパーソナルアカウントに紐づけることなく、共同でリソースや機能にアクセスできます。

    これらのトークンを生成できるのはAdministratorsとGlobal Administratorsのみで、使用できるのも会社内の他のAdministratorsのみです。

## トークンの使用範囲

選択した使用範囲によって、トークンをどのように、どこで使用できるかが制限されます:

* Node deployment - [自己ホスト型Wallarm Nodeのデプロイ](../../installation/supported-deployment-options.md)またはアップグレード時にノードを認証するためのAPIトークンを生成する場合に使用します。
* Wallarm API - このオプションを選ぶと、Wallarm APIへの認証付きリクエストにトークンを使用します。
* Schema-Based Testing agent - [必須](../../vulnerability-detection/schema-based-testing/)で、[Schema-Based Testing](../../vulnerability-detection/schema-based-testing/setup.md#prerequisites-token)の動作に必要です。

## トークンの有効期限

各トークンに有効期限を設定できます。設定すると、指定日を過ぎた時点でトークンは無効化されます。

有効期限日の3日前にメール通知を送信します。期限が3日未満の短期トークンには通知は送信されません。

パーソナルトークンの場合は所有者に直接、共有トークンの場合はすべてのAdministratorsに通知が送られます。

## トークンの権限

各トークンには、ユーザーロールに紐づく権限の範囲を超えない範囲で権限を設定できます。

トークン権限は、定義済みのユーザーロールに基づいて割り当てるか、カスタマイズできます:

* Administrator、Analyst、API Developer、Read Onlyおよび同等のGlobalロール - これらのロールのいずれかを割り当てたトークンは、[ユーザーロール体系](users.md#user-roles)に記載の権限を継承します。
* Deploy - このロールを持つAPIトークンは、[Wallarmノードをデプロイ](../../installation/supported-deployment-options.md)するために使用します。
* Custom permissions - 手動で権限を選択するモードに切り替えます。

パーソナルトークンの所有者の権限が縮小された場合、その所有者のトークンの権限もそれに応じて調整されます。

## トークンの無効化と再有効化

トークンは手動で無効化や有効化ができます。無効化すると、トークンは直ちに機能を停止します。

無効化されたトークンは、無効化から1週間後に自動的に削除されます。

以前に無効化したトークンを再有効化するには、新しい有効期限を設定してください。

トークンの所有者が[無効化される](../../user-guides/settings/users.md#disabling-and-deleting-users)と、その所有者のトークンも自動的に無効化されます。

## 後方互換トークン

以前はリクエストの認証にUUIDとシークレットキーを使用していましたが、現在はトークンに置き換えられています。ご使用のUUIDとシークレットキーは自動的に**後方互換**トークンへと変換されます。このトークンを使用すると、UUIDとシークレットキーで認証されたリクエストは引き続き動作します。

!!! warning "トークンの更新またはSSOの有効化"
    後方互換トークンの値を更新するか、このトークンの所有者に対して[SSO](../../admin-en/configuration-guides/sso/intro.md)を有効化すると、後方互換性は終了し、旧UUIDとシークレットキーで認証されたすべてのリクエストは動作しなくなります。

後方互換トークンの生成された値は、リクエストのヘッダーパラメータ`X-WallarmApi-Token`として渡して使用することもできます。

後方互換トークンの権限はユーザーロールと同一で、これらの権限はトークンのウィンドウには表示されず、変更できません。権限を制御したい場合は、後方互換トークンを削除して新しいトークンを作成してください。

## APIトークンとノードトークン

本記事で説明したAPIトークンは、任意のクライアントから任意の権限セットでWallarm Cloud APIの[リクエスト認証](../../api/overview.md)に使用できます。

Wallarm Cloud APIにアクセスするクライアントの1つはWallarm filtering node自身です。Wallarm CloudのAPIへのアクセスをWallarm filtering nodeに付与するには、APIトークンに加えてノードトークンも使用できます。[違いとどちらを使うべきか→](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "一部のデプロイオプションではAPIトークンはサポートされません"
    APIトークンは現在、[Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md)に基づくAWSデプロイでは使用できません。代わりにノードトークンを使用してください。