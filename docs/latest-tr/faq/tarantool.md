# Tarantool sorun giderme

Aşağıdaki bölümler, Tarantool işleminde sıkça karşılaşılan hatalar ve bu hataların giderilmesi hakkında bilgi vermektedir.

## "readahead limit reached" sorunu nasıl çözülür?

`/var/log/wallarm/tarantool.log` dosyasında, şu hataları görebilirsiniz:

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

Bu sorun kritik değil ancak çok fazla hata, hizmet performansını düşürebilir.

Sorunu çözmek için:

1. `/usr/share/wallarm-tarantool/init.lua` klasörüne gidin → `box.cfg` dosyasına erişin.
1. Aşağıdaki seçeneklerden birini ayarlayın:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

`readahead` parametresi, istemci bağlantısıyla ilişkilendirilmiş ön okuma tamponunun boyutunu tanımlar. Tampon ne kadar büyük olursa, aktif bir bağlantı o kadar çok bellek tüketir ve işletim sistemi tamponundan tek bir sistem çağrısıyla ne kadar çok istek okunabilir. Tarantool [belgelerinde](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead) daha fazla detay bulabilirsiniz.

## "net_msg_max limit is reached" sorununu nasıl çözüyorum?

`/var/log/wallarm/tarantool.log` dosyasında, şu hataları alabilirsiniz:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

Sorunu çözmek için, `net_msg_max` değerini artırın (varsayılan değer `768`):

1. `/usr/share/wallarm-tarantool/init.lua` klasörüne gidin → `box.cfg` dosyasına erişin.
1. `net_msg_max` değerini artırın, örneğin:

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

Tüm sistemi etkilemesini önlemek için, `net_msg_max` parametresi, liflerin kaç mesajı işleyeceğini sınırlar. `net_msg_max` kullanımıyla ilgili ayrıntılara Tarantool [belgelerinde](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max) ulaşabilirsiniz.