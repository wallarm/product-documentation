# Agentic AI Protection（早期アクセス）

Wallarmは、AIエージェント、AIプロキシ、AI機能を備えたAPIを保護し、インジェクション攻撃やデータ漏えいを防止し、コストを制御し、セキュアでコンプライアンスに準拠した運用を実現することで、AIシステムにAPIファーストのセキュリティを提供します。

![Agentic AIの動作 - スキーマ](../images/agentic-ai-protection/agentic-ai-schema.png)

## AIエージェントへの一般的な攻撃

AIエージェントに対する一般的な攻撃には、次のようなものがあります。

* ジェイルブレイク：

    * 隠されたシステムプロンプトや指示の取得と悪用。
    * コンテンツフィルタを回避するための暗号化されたプロンプトコマンドの注入。
    * エージェントによる制限付きAPIの呼び出しによる不正操作。

* エージェントAPIへの攻撃：

    * 一般的なAPI攻撃を用いた、エージェントが利用するツールへの攻撃・悪用。
    * 内部APIを介した機微データの漏えい。
    * 弱い認証や設定ミスの悪用。

* ボットとエージェントの悪用：

    * Low-and-slow攻撃やDDoSを含む自動化ボット攻撃。
    * ライセンスの不正使用を含む、利用の濫用やクレジット超過。
    * 自動化されたアカウント乗っ取り攻撃。
    * 大規模なプロンプトインジェクション。

* 不正・シャドーAIエージェント：

    * シャドーITによりデプロイされたエージェントのセキュリティ強化不足によりバックドアが残存。
    * 共有環境での非認可エージェントによるテナント間データ漏えい。
    * 保護されていないシャドーエージェントの悪用によるクレジット窃取や巨額のインフラ請求のリスク。

WallarmのAgentic AI Protectionの詳細な説明は公式サイトの[こちら](https://www.wallarm.com/solutions/s-protect-agentic-ai)をご覧ください。

## 保護の仕組み

AIエージェントへの攻撃に対するWallarmの保護は、次の簡単な手順で機能します。

1. 適切なデプロイオプション（[セルフホスト型](../installation/supported-deployment-options.md)、[Security Edge](../installation/security-edge/overview.md)、[コネクタのデプロイ](../installation/connectors/overview.md)）を使用してWallarmの[フィルタリングノード](../about-wallarm/overview.md#how-wallarm-works)をデプロイします。
1. 任意で、Wallarmの[API Discovery](../api-discovery/overview.md)を有効化して、APIインベントリ内のAI/LLMエンドポイントの[自動検出](agentic-ai-discovery.md)を行います。
1. Wallarm Consoleで、Agentic AI向けの[カスタム保護ポリシー](../user-guides/rules/rules.md)を作成し、攻撃の検出方法と緩和方法を定義します（開発中）。
1. Wallarmが自動で攻撃を検出し、[アクションを実行](../admin-en/configure-wallarm-mode.md)します（攻撃の記録のみ、またはリアルタイムでの記録およびブロック）。
1. 検出・ブロックされた攻撃は[API Sessions](../api-sessions/overview.md)に表示されます。悪意のあるリクエストの詳細には、検出やブロックの原因となったポリシーへのバックリンクが表示されます。

![Agentic AIへの攻撃に対するWallarm - API Sessions](../images/agentic-ai-protection/agentic-ai-wallarm-demo-results.png)

## デモ

WallarmのAgentic AI Protectionは現在、開発中の早期アクセス機能です。[デモ](demo.md)を確認できます。