設定を適用するには、Wallarmインスタンス上のNGINXを再起動します：

``` bash
sudo systemctl restart nginx
```

設定ファイルの変更ごとに、それを適用するためにNGINXを再起動する必要があります。