[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# APIトークン

Wallarm Console → **Settings** → **API tokens** において、[APIリクエスト認証](../../api/overview.md)および[フィルタリングノードのデプロイ](../../installation/supported-deployment-options.md)用のトークンを管理できます。

Wallarm APIトークンは柔軟な管理オプションを提供します。トークンの種類（パーソナルまたは共有など）を選択でき、有効期限を設定し、権限を指定できます。

![Wallarm API token][img-api-tokens-edit]

## パーソナルトークンと共有トークン

パーソナルトークンと共有トークンのいずれかを生成できます:

* パーソナルトークンは、その権限に従って個人使用のために指定されています。[Administrators and Analysts](users.md#user-roles)のみがパーソナルトークンを作成および使用できます。

    パーソナルトークンの値は、その所有者のみがコピーして使用できます。ただし、管理者は企業アカウント内のユーザートークン一覧を閲覧できます。
* 共有トークンは、複数のユーザーまたはシステムによる使用を目的としています。個々のパーソナルアカウントに関連付けられることなく、リソースまたは機能へのアクセスを共同で提供します。

    これらのトークンは、AdministratorsとGlobal Administratorsのみが生成でき、企業内の他の管理者のみが使用できます。

## トークンの有効期限

各トークンに有効期限を設定できます。設定後、指定された日付以降はトークンが無効になります。

トークンの有効期限の3日前にメール通知が発行されます。有効期限が3日未満の短期間トークンの場合、通知は送信されません。

パーソナルトークンの場合は、通知メールが直接トークン所有者に送信され、共有トークンの場合は、すべての管理者が通知を受け取ります。

## トークンの権限

各トークンについて、そのユーザー権限に関連付けられた範囲を超えない権限を設定できます。

トークンの権限は、事前定義されたユーザー権限に基づいて割り当てるか、カスタマイズできます:

* Administrator、Analyst、API Developer、Read Onlyおよび対応するGlobal権限 - これらの権限のいずれかが割り当てられたトークンは、当社の[user role system](users.md#user-roles)に記載された権限を継承します。
* Deploy - この権限を持つAPIトークンは、[Wallarmノードのデプロイ](../../installation/supported-deployment-options.md)に使用されます。
* Custom permissions - 手動での権限選択に切り替えます。
<!--
    [OpenAPIセキュリティテスト](../../fast/openapi-security-testing.md)用のトークンを作成するには、対応する権限を持つカスタムロールが必要です。-->

パーソナルトークン所有者の権限が削減された場合、そのトークンの権限もそれに応じて調整されます。

## トークンの無効化および再有効化

トークンを手動で無効化または有効化できます。一度無効化されると、トークンは直ちに機能を停止します。

無効化されたトークンは、無効化から1週間後に自動的に削除されます。

以前に無効化されたトークンを再有効化するには、新しい有効期限を設定してください。

トークン所有者が[無効化](../../user-guides/settings/users.md#disabling-and-deleting-users)された場合、そのトークンも自動的に無効化されます。

## 後方互換トークン

以前はUUIDと秘密鍵がリクエスト認証に使用されていましたが、現在はトークンに置き換えられています。以前使用していたUUIDと秘密鍵は自動的に**後方互換**トークンに変換されます。このトークンを使用することで、UUIDと秘密鍵で認証されたリクエストは引き続き動作します。

!!! warning "トークンの更新またはSSOを有効化"
    後方互換トークンの値を更新するか、このトークン所有者に[SSO/strict SSO](../../admin-en/configuration-guides/sso/employ-user-auth.md)を有効化すると、後方互換性が終了し、古いUUIDと秘密鍵で認証されたリクエストはすべて動作を停止します。

また、リクエストの`X-WallarmApi-Token`ヘッダーパラメータに後方互換トークンの生成された値を渡すことで使用できます。

後方互換トークンはユーザー権限と同じ権限を持ち、これらの権限はトークンウィンドウに表示されず、変更することができません。権限を制御する場合は、後方互換トークンを削除し、新しいトークンを作成してください。

## APIトークンとノードトークン

本記事で説明しているAPIトークンは、任意のクライアントからのWallarm Cloud API[リクエスト認証](../../api/overview.md)に、任意の権限セットで使用できます。

Wallarm Cloud APIにアクセスするクライアントの一つとして、Wallarmフィルタリングノード自体があります。APIトークンに加え、ノードトークンを使用することで、フィルタリングノードにWallarm CloudのAPIへのアクセスを許可できます。[違いと推奨事項はこちら→](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "一部のデプロイオプションではAPIトークンはサポートされていません"
    現在、APIトークンは[Kong Ingress controllers](../../installation/kubernetes/kong-ingress-controller/deployment.md)および[Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md)を使用したAWSデプロイメントでは使用できません。その代わりにノードトークンを使用してください。