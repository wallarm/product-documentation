また、Wallarmの[API Abuse Prevention](../../api-abuse-prevention/overview.md)モジュールは、悪意のあるボットのIPアドレスをgraylistまたはdenylistのいずれかに自動的に登録します。

ボットのIPアドレスは、`Bot` **Reason**および[confidence rate](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を含むその性質に関する詳細情報によって識別されます。例えば:

![denylistに登録されたボットのIPアドレス](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)