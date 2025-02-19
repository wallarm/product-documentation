```markdown
!!! info "Dockerコンテナ内のNGINXバージョン"
    Dockerコンテナはバージョン`1.14.x`のNGINXを使用しています。このNGINXバージョンではいくつかの脆弱性が発見される可能性がありますが、実際のところほとんどは[Debianチームによって修正済み](https://security-tracker.debian.org/tracker/source-package/nginx)です。DockerコンテナはDebian10.x上でサービスを実行しているため、発見された脆弱性がデータの安全性を損なう結果となることはありません。
```