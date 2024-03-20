---
hide:
- navigation
- toc
- feedback
---

# Wallarm APIセキュリティ

Wallarmのソリューションは、OWASP APIトップ10の脅威、APIの乱用、および他の自動化された脅威からAPI、マイクロサービス、およびWebアプリケーションを保護します。これは手動ルール設定不要で、超低誤検知率を実現します。

<div class="navigation">

<div class="navigation-card">
    <h3 class="icon-homepage quick-start-title">クイックスタート</h3>
    <p><ul>
    <li><a href="./about-wallarm/overview/">Wallarmの概要</a></li>
    <li><a href="./quickstart/getting-started/">クイックスタートガイド</a></li>
    <li><a href="./demo-videos/overview/">ビデオガイド</a></li>
    <li><a href="./installation/supported-deployment-options/">デプロイガイド</a></li>
    <li><a href="./about-wallarm/subscription-plans/">サブスクリプションプラン</a></li>
    <li><a href="./quickstart/attack-prevention-best-practices/">攻撃予防のベストプラクティス</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage dashboard-title">ダッシュボードとレポート</h3>
    <p><ul>
    <li><a href="./user-guides/dashboards/threat-prevention/">脅威予防ダッシュボード</a></li>
    <li><a href="./user-guides/dashboards/api-discovery/">API発見ダッシュボード</a></li>
    <li><a href="./user-guides/dashboards/owasp-api-top-ten/">OWASP APIトップ10ダッシュボード</a></li>
    <li><a href="./user-guides/search-and-filters/use-search/">イベント検索と分析</a></li>
    <li><a href="./user-guides/search-and-filters/custom-report/">EメールPDFおよびCSVレポート</a></li>
    <li><a href="./user-guides/settings/audit-log/">活動ログ</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-discovery-title">API発見</h3>
    <p><ul>
    <li><a href="./api-discovery/overview/">API インベントリの探索</a></li>
    <li><a href="./api-discovery/track-changes/">API の変更の追跡</a></li>
    <li><a href="./api-discovery/risk-score/">エンドポイントのリスクスコア</a></li>
    <li><a href="./api-discovery/rogue-api/">シャドウ、孤児、ゾンビ API</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-threat-prevent">API脅威予防</h3>
    <p><ul>
    <li><a href="./about-wallarm/api-abuse-prevention/">API 濫用防止</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bola/">BOLA 保護</a></li>
    <li><a href="./about-wallarm/credential-stuffing/">クレデンシャルスタッフィング検知</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage vuln-title">脆弱性検出</h3>
    <p><ul>
    <li><a href="./about-wallarm/attack-surface/">概要</a></li>
    <li><a href="./user-guides/scanner/">公開されたアセット</a></li>
    <li><a href="./about-wallarm/api-leaks/">API 情報漏えい</a></li>
    <li><a href="./about-wallarm/detecting-vulnerabilities/">脆弱性評価</a></li>
    <li><a href="./vulnerability-detection/active-threat-verification/overview/">アクティブな脅威検証</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-security-testing">APIセキュリティテスト</h3>
    <p><ul>
    <li><a href="./fast/openapi-security-testing/">OpenAPI セキュリティ テスティング</a></li>
    <li><a href="./fast/">APIセキュリティテストのためのフレームワーク</a></li>
    <li><a href="./fast/operations/test-policy/fuzzer-intro/">ファジング</a></li>
    <li><a href="./fast/dsl/intro/">カスタム検出のためのDSL</a></li>
    <li><a href="./fast/poc/integration-overview/">CI/CDへの統合</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage waap-waf-title">WAAP/WAF</h3>
    <p><ul>
    <li><a href="./about-wallarm/waap-overview/">概要</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-ddos/">DDoS 防御</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bruteforce/">ブルートフォース攻撃防御</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-forcedbrowsing/">強制的な閲覧の防止</a></li>
    <li><a href="./user-guides/rules/rate-limiting/">レート制限</a></li>
    <li><a href="./user-guides/rules/vpatch-rule/">仮想パッチング</a></li>
    <li><a href="./user-guides/rules/regex-rule/">ユーザー定義の検出器</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage deployment-title">デプロイメント</h3>
    <p><ul>
    <li><a href="./installation/supported-deployment-options/">すべてのデプロイメントオプション</a></li>
    <li><a href="./installation/oob/overview/">アウトオブバンド</a></li>
    <li><a href="./installation/supported-deployment-options/#public-clouds">パブリッククラウド</a></li>
    <li><a href="./installation/supported-deployment-options/#kubernetes">Kubernetes</a></li>
    <li><a href="./installation/inline/overview/">インライン</a></li>
    <li><a href="./installation/connectors/overview/">コネクタ</a></li>
    <li><a href="./installation/supported-deployment-options/#packages">パッケージ</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage integration-title">統合とアラート</h3>
    <p><ul>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#email-and-messengers">メールおよびメッセンジャー</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#incident-and-task-management-systems">インシデントおよびタスク管理システム</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#siem-and-soar-systems">SIEM および SOAR システム</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#log-management-systems">ログ管理システム</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#data-collectors">データ収集システム</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage user-management-title">ユーザー管理</h3>
    <p><ul>
    <li><a href="./user-guides/settings/users/">概要</a></li>
    <li><a href="./user-guides/settings/account/">ユーザープロファイル</a></li>
    <li><a href="./user-guides/settings/api-tokens/">APIトークン</a></li>
    <li><a href="./admin-en/configuration-guides/sso/intro/">SAML SSO</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage operations-title">オペレーション</h3>
    <p><ul>
    <li><a href="./admin-en/configure-parameters-en/">NGINXベースのノードの構成オプション</a></li>
    <li><a href="./admin-en/configure-wallarm-mode/">フィルタリングモード</a></li>
    <li><a href="./admin-en/using-proxy-or-balancer-en/">エンドユーザーIPの正確なレポート</a></li>
    <li><a href="./admin-en/configuration-guides/allocate-resources-for-node/">リソース割り当て</a></li>
    <li><a href="./user-guides/settings/applications/">アプリケーションごとのトラフィックと設定の分割</a></li>
    <li><a href="./admin-en/configure-logging/">ノードログのフィルタリング</a></li>
    <li><a href="./updating-migrating/what-is-new/">ノードアップグレード</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage references-title">参考文献</h3>
    <p><ul>
    <li><a href="./faq/ingress-installation/">FAQ</a></li>
    <li><a href="./news/">変更ログ & ニュース</a></li>
    <li><a href="./api/overview/">Wallarm API リファレンス</a></li>
    <li><a href="./admin-en/managing/terraform-provider/">Wallarm Terraform プロバイダ</a></li>
    <li><a href="./integrations-devsecops/verify-docker-image-signature/">Docker イメージ署名の確認</a></li>
    </ul></p>
</div>

</div>