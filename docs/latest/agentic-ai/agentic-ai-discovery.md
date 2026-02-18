# Agentic AI Discovery

Wallarm's API Discovery [automatically identifies](../api-discovery/sbf.md#automatic-tagging) your APIs that are related to ML models, neural networks, chatbots or systems that in turn access some paid third-party AI services, such as OpenAI. You can also mark some endpoints as belonging to AI/LLM manually. In this article, automatic and manual AI discovery is described.

## Automatic tagging of AI/LLM

API Discovery automatically tags endpoints as belonging to **AI/LLM** sensitive business flow - on discovering a new endpoint, it checks whether this endpoint potentially belongs to this sensitive business flow, and, if so, marks it with the **AI/LLM** tag.

![Agentic AI endpoints in API Discovery](../images/agentic-ai-protection/agentic-ai-in-api-discovery.png)

<!--Automatic checks are conducted using keywords from the endpoint URL. For AI/LLM, keywords like `TBD`, `TBD` automatically associate the endpoint with the **AI/LLM** flow. If matches are detected, the endpoint is automatically assigned to the appropriate flow.-->

The automatic tagging discovers most of the **AI/LLM** endpoints. However, it is also possible to manually mark an endpoint as AI/LLM as described in the section below.

## Tagging AI/LLM endpoints manually

To adjust the results of [automatic tagging](#automatic-tagging-of-aillm), you can manually add or remove the **AI/LLM** tag to the required endpoints.

To do that, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow & sensitive data**, select `AI/LLM`.

## Viewing AI/LLM endpoints

Once endpoints are assigned with the **AI/LLM** sensitive business flow tag, you can select to show only them. To do that, set the **Business flow** filter to `AI/LLM`.

## Creating custom protection policies for AI/LLM endpoints (under development)

You can create generic protection rules right from the details page of your AI/LLM endpoint. Also, from here, you can create (**under development**) custom protection policies for AI/LLM specifically.

## AI/LLM business flows in Sessions

Wallarm's [API Sessions](../api-sessions/overview.md) are used to provide you with the full sequence of user activities and thus give more visibility into the logic of malicious actors. If session's requests affect the endpoints that in API Discovery were tagged as **AI/LLM**, such session will be automatically tagged as affecting the **AI/LLM** business flow as well.

Once sessions are assigned with the **AI/LLM** sensitive business flow tag, it becomes possible to select only the sessions touching AI/LLM endpoints. To do that, set the **Business flow** filter to `AI/LLM`.

![API sessions touching Agentic AI endpoints](../images/agentic-ai-protection/agentic-ai-in-api-sessions.png)
