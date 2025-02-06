# Tarantool Sorun Giderme

Aşağıdaki bölümler, Tarantool çalışması sırasında sık karşılaşılan hatalar ve bu hataların giderilmesi ile ilgili bilgileri sunmaktadır.

## "readahead limit reached" sorunu nasıl çözülebilir?

/var/log/wallarm/tarantool.log veya /opt/wallarm/var/log/wallarm/tarantool-out.log dosyasında [node kurulum yöntemine bağlı olarak](../admin-en/configure-logging.md) aşağıdaki gibi hatalar oluşabilir:

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

Bu sorun kritik değildir, ancak çok fazla hata oluşması servis performansını düşürebilir.

Sorunu çözmek için:

1. /usr/share/wallarm-tarantool/init.lua klasörüne erişin → box.cfg dosyası.
2. Aşağıdakilerden birini ayarlayın:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

`readahead` parametresi, bir istemci bağlantısına bağlı olarak kullanılan önden okuma tamponunun boyutunu belirler. Tampon ne kadar büyükse, aktif bağlantının tükettiği bellek o kadar artar ve tek bir sistem çağrısı ile işletim sistemi önbelleğinden okunabilecek istek sayısı o kadar fazla olur. Daha fazla ayrıntı için Tarantool [belgelerine](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead) bakınız.

## "net_msg_max limit is reached" sorunu nasıl çözülebilir?

/var/log/wallarm/tarantool.log veya /opt/wallarm/var/log/wallarm/tarantool-out.log dosyasında [node kurulum yöntemine bağlı olarak](../admin-en/configure-logging.md) aşağıdaki gibi hatalar oluşabilir:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

Sorunu çözmek için, `net_msg_max` değerini (varsayılan değer `768`) artırmanız gerekir:

1. /usr/share/wallarm-tarantool/init.lua klasörüne erişin → box.cfg dosyası.
2. `net_msg_max` değerini artırın, örneğin:

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

Fiber işlemlerinin tüm sistemi etkilemesini önlemek için, `net_msg_max` parametresi fiberların işleyebileceği mesaj sayısını sınırlar. `net_msg_max` kullanımı hakkında daha fazla bilgi için Tarantool [belgelerine](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max) bakınız.