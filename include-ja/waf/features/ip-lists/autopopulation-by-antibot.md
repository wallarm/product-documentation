The Wallarmの[API Abuse Prevention](../../api-abuse-prevention/overview.md)モジュールは、不正なボットのIPをgraylistまたはdenylistに自動的に追加します。

ボットのIPは、`Bot` **Reason**およびその性質の詳細（[confidence rate](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を含む）により区別されます。例えば：

![denylistに登録されたボットのIP](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)