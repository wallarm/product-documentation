フィルタリングノードの構成パラメータは、デプロイされたDockerコンテナに以下のいずれかの方法で渡す必要があります:

* **環境変数内に**. このオプションにより、基本的なフィルタリングノードのパラメータのみの構成が可能です。多くの[directives][nginx-waf-directives]は環境変数を通じて構成できません。
* **マウントされた設定ファイル内に**. このオプションにより、任意の[directives][nginx-waf-directives]を使用してフィルタリングノードを完全に構成することが可能です。この設定方法では、フィルタリングノードとWallarm Cloudの接続設定を持つ環境変数もコンテナに渡されます。