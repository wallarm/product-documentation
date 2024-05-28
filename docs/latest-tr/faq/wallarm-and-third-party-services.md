# Wallarm platformu ve üçüncü taraf hizmetlerle etkileşim

Wallarm platformu ve üçüncü taraf hizmetlerle etkileşim sırasında bazı sorunlar ortaya çıkarsa, bunları ele almak için bu sorun giderme kılavuzunu kontrol edin. İlgili detayları burada bulamadıysanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

## Wallarm platformu hangi üçüncü taraf hizmetlerle etkileşime girer?

Wallarm platformu aşağıdaki üçüncü taraf hizmetlerle etkileşime girer:

* Standart Tarantool örneği verilerini yükleme için Tarantool geri bildirim sunucusu (`https://feedback.tarantool.io`).

    Bellek içi depolama Tarantool, makinenize `wallarm-tarantool` paketinden dağıtılan Wallarm postanalitik modülü tarafından kullanılır. Tarantool depolama, özel (`wallarm-tarantool`) ve standart (`tarantool`) olmak üzere iki örnekte dağıtılır. Bir standart örneğin varsayılan olarak özel bir örnekle birlikte dağıtılır ve Wallarm bileşenleri tarafından kullanılmaz.
    
    Wallarm yalnızca özel bir Tarantool örneğini kullanır ve `https://feedback.tarantool.io`'ya herhangi bir veri göndermez. Ancak, varsayılan bir örneğin saatte bir kez Tarantool geri bildirim sunucusuna veri göndermesi mümkündür ([daha fazla detay](https://www.tarantool.io/en/doc/latest/reference/configuration/#feedback)).

## Standart Tarantool örneği verilerinin `https://feedback.tarantool.io`'ya gönderilmesini devre dışı bırakabilir miyim?

Evet, standart Tarantool örneği verilerinin `https://feedback.tarantool.io`'ya gönderilmesini aşağıdaki şekillerde devre dışı bırakabilirsiniz:

* Standart Tarantool örneğini kullanmıyorsanız, devre dışı bırakabilirsiniz:

    ```bash
    systemctl stop tarantool
    ```
* Standart Tarantool örneği sorunlarınıza yanıt veriyorsa, `https://feedback.tarantool.io`'ya veri göndermeyi [`feedback_enabled`](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-logging-feedback-enabled) parametresini kullanarak devre dışı bırakabilirsiniz.