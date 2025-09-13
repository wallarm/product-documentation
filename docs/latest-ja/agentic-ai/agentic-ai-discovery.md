# Agentic AIの検出

WallarmのAPI Discoveryは、[自動的に特定します](../api-discovery/sbf.md#automatic-tagging)。対象は、MLモデル、ニューラルネットワーク、チャットボット、またはOpenAIのような有償のサードパーティAIサービスにアクセスするシステムに関連するAPIです。エンドポイントをAI/LLMに属するものとして手動でマークすることもできます。本記事では、AIの自動検出と手動検出について説明します。

## AI/LLMの自動タグ付け

API Discoveryは、エンドポイントが**AI/LLM**の機密性の高いビジネスフローに属するかどうかを自動的に判定し、タグ付けします。新しいエンドポイントを検出すると、そのエンドポイントがこのビジネスフローに属する可能性があるかを確認し、該当する場合は**AI/LLM**タグを付与します。

![API DiscoveryにおけるAgentic AIエンドポイント](../images/agentic-ai-protection/agentic-ai-in-api-discovery.png)

<!--Automatic checks are conducted using keywords from the endpoint URL. For AI/LLM, keywords like `TBD`, `TBD` automatically associate the endpoint with the **AI/LLM** flow. If matches are detected, the endpoint is automatically assigned to the appropriate flow.-->

自動タグ付けにより、**AI/LLM**エンドポイントの大半が検出されます。ただし、以下のセクションで説明するように、エンドポイントをAI/LLMとして手動で指定することも可能です。

## AI/LLMエンドポイントの手動タグ付け

[自動タグ付け](#automatic-tagging-of-aillm)の結果を調整するために、必要なエンドポイントに対して**AI/LLM**タグを手動で追加または削除できます。

これを行うには、Wallarm ConsoleでAPI Discoveryに移動し、対象のエンドポイントの**Business flow & sensitive data**で`AI/LLM`を選択します。

## AI/LLMエンドポイントの表示

エンドポイントに**AI/LLM**の機密性の高いビジネスフロータグが付与されると、それらのみを表示することができます。これを行うには、**Business flow**フィルターを`AI/LLM`に設定します。

## AI/LLMエンドポイント向けカスタム保護ポリシーの作成（開発中）

AI/LLMエンドポイントの詳細ページから、汎用的な保護ルールをその場で作成できます。また、ここからAI/LLM専用のカスタム保護ポリシー（開発中）を作成することもできます。

## SessionsにおけるAI/LLMビジネスフロー

Wallarmの[API Sessions](../api-sessions/overview.md)は、ユーザー活動の完全なシーケンスを提供し、悪意のある行為者のロジックをより可視化するために使用されます。セッション内のリクエストが、API Discoveryで**AI/LLM**としてタグ付けされたエンドポイントに影響する場合、そのセッションも**AI/LLM**ビジネスフローに影響するものとして自動的にタグ付けされます。

セッションに**AI/LLM**の機密性の高いビジネスフロータグが付与されると、AI/LLMエンドポイントに関与するセッションのみを選択できるようになります。これを行うには、**Business flow**フィルターを`AI/LLM`に設定します。

![Agentic AIエンドポイントに関与するAPIセッション](../images/agentic-ai-protection/agentic-ai-in-api-sessions.png)