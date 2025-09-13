# Wallarmオンプレミスソリューションのメンテナンス

本書は、オンプレミスデプロイメントにおけるWallarm Cloudコンポーネントのメンテナンスに関するガイダンスを提供します。定期的なメンテナンス作業、バージョニング手法、監視のセットアップなどを扱います。

## 継続的なメンテナンス作業の概要

Wallarm Cloudのオンプレミスコンポーネントには、以下の定期的なメンテナンス作業が必要です。

1. 利用可能な最新のWallarm Cloudパッチバージョンへの迅速なソフトウェアアップグレード。
1. 新たに利用可能になったメジャー/マイナーリリースへの計画的なソフトウェアアップグレード。
1. 報告されたAPI攻撃にfalse positivesがないかのレビューと、必要な設定修正の適用。
1. Wallarm Cloudの自動通知（メール、Slack、SIEM、その他設定済みの連携経由）の適時なレビュー。

## 監視

Wallarm Cloudには、Victoria Metrics、Alertmanager、Grafanaのオープンソースコンポーネントに基づく組み込みの監視システムが付属しており、以下があらかじめ設定されています。

* データ/メトリクスエクスポーター  
* メトリクスコレクター  
* すべての重要なWallarm Cloudワークフロー向けの監視アラート一連  
* 主要なシステムおよびアプリケーションのメトリクスを網羅するGrafanaのダッシュボード一式

デフォルトでは、監視アラートは管理者のメールアドレスに送信されます。

導入済みのWallarmソリューションについて、以下のパラメータを監視するために既存のエンタープライズ監視システムを使用することを推奨します。

1. Wallarm CloudのAPIエンドポイントがHTTPSプロトコルで到達可能で、エラーではないHTTPステータスコードで応答すること。
1. 導入済みのすべてのWallarm CloudノードがICMPで到達可能であること。
1. ロードバランサのIPアドレス（内蔵ソフトウェアロードバランサの場合はVIP）がICMPで到達可能であること。
1. Wallarm Filtering Nodeが必要なすべてのデータを適時にWallarm Cloudインスタンスへアップロードしていること（利用可能なFiltering Nodeのメトリクスについては[このページ](../../admin-en/configure-statistics-service.md)を参照してください）。
1. Wallarm Filtering NodeがWallarm Cloudインスタンスとの通信に関してエラーを報告していないこと。

## ソフトウェアリリース

Wallarm Cloudのバージョンは、使用しているwctlツールのバージョンで決まります。

Wallarm Filtering Nodeの[バージョニングポリシー](../../updating-migrating/versioning-policy.md)と同様に、Wallarm Cloudコンポーネントは`MAJOR.MINOR.PATCH-BUILD`というソフトウェアのバージョニング規約を採用しています：

* Wallarmは、Wallarm Cloudソフトウェアのメジャーバージョンを6か月ごと、または大きな変更が必要な場合にリリースします。
* マイナーバージョン（既存機能の範囲内での拡張や新しい機能追加で、大きな新ユースケースを導入しないもの）は月次でリリースされる場合があります。
* パッチバージョン（小さなバグ修正や特定の改善のためのパッチ）は必要に応じてリリースされます。

Filtering Nodeと同様に、いくつかのWallarm CloudリリースはLTS（長期サポート）版としてマークされ、重大なバグやセキュリティ脆弱性の修正が14か月間提供されます。

新規のWallarmオンプレミスのお客様には、まず最新のWallarm Cloudソフトウェア（LTS版ではありません）をデプロイし、可能な限り迅速に新しいWallarm Cloudリリースへ更新できるよう、必要なポリシーとプロセスを整備することを推奨します。

サポート対象のWallarm Filtering NodeとWallarm Cloudのバージョンには依存関係がある点にご注意ください：

* 各Wallarm Cloudソフトウェアリリースには、そのリリースでサポートされるWallarm Filtering Nodeのバージョンが記載されています。
* 通常、最新のWallarm Filtering Nodeのバージョンは、最新のWallarm Cloudソフトウェア（LTS版ではありません）でのみサポートされます。

## 高レベルなソフトウェア更新プロセスの概要

以下に、Wallarm Cloudコンポーネントのソフトウェア更新プロセスの高レベルな概要を示します。

1. Wallarm Cloudのリリースノートを確認し、環境固有のリスクや新しい要素（新機能、既存機能の変更、バグ修正、更新されたWallarm設定データ、セキュリティアップデートなど）を特定します。
1. 組織の[変更管理プロセス](https://www.atlassian.com/itsm/change-management)に従い、ソフトウェアアップグレード手順の実施計画を文書化して策定・レビューします。必要に応じてWallarmチームに支援を依頼します。
1. ステージング環境をアップグレードし、定義済みのテストチェックリストを用いてシステムの機能を検証します。検知されたAPI攻撃の[false positives](../../user-guides/events/check-attack.md#false-positives)に注意してください。
1. 本番環境のメンテナンスウィンドウを計画します。
1. 本番環境を一時的に`monitoring`モードに切り替えます（API攻撃の処理については`block`[mode](../../admin-en/configure-wallarm-mode.md)を無効化します）。
1. 本番環境をアップグレードし、定義済みのテストチェックリストを用いてシステムの機能を検証します（主に攻撃検知とfalse positivesを確認します）。
1. 本番環境を`block`モードに戻します。
1. Wallarm CloudのDRインスタンスのアップグレードを計画し、実施します。
1. 更新された各環境をドキュメント化します。