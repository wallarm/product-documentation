# Sihirbaz için IBM API Connect

Wallarm Edge node, yönetilen API'lere ulaşmadan önce trafiği incelemek amacıyla IBM DataPower'ınıza [senkron](../inline/overview.md) modda bağlanabilir - hiçbir isteği engellemeden.

Bağlantıyı kurmak için aşağıdaki adımları izleyin.

**1. IBM API Connect içindeki API'lere Wallarm politikalarını uygulayın**

1. Platformunuz için sağlanan kod paketini indirin.
1. İstek inceleme politikasını kaydedin:

    ```
    apic policies:create \
        --scope <KATALOG VEYA ALAN> \
        --server <YÖNETİM SUNUCUSU UÇ NOKTASI> \
        --org <KURULUŞ ADI VEYA ID'Sİ> \
        --catalog <KATALOG ADI VEYA ID'Sİ> \
        --configured-gateway-service <GEÇİT HİZMETİ ADI VEYA ID'Sİ> \
        /<YOL>/wallarm-pre.zip
    ```
1. Yanıt inceleme politikasını kaydedin:

    ```
    apic policies:create \
        --scope <KATALOG VEYA ALAN> \
        --server <YÖNETİM SUNUCUSU UÇ NOKTASI> \
        --org <KURULUŞ ADI VEYA ID'Sİ> \
        --catalog <KATALOG ADI VEYA ID'Sİ> \
        --configured-gateway-service <GEÇİT HİZMETİ ADI VEYA ID'Sİ> \
        /<YOL>/wallarm-post.zip
    ```

Çoğu durumda, `configured-gateway-service` adı `datapower-api-gateway`'dir.

**2. Wallarm inceleme adımlarını assembly işlem hattına entegre edin**

API belirtiminizde, `x-ibm-configuration.assembly.execute` bölümünde, trafiği Wallarm Node üzerinden yönlendirmek için aşağıdaki adımları ekleyin veya güncelleyin:

1. `invoke` adımından önce, gelen istekleri Wallarm Node'a aracılı yönlendirmek için `wallarm_pre` adımını ekleyin.
1. `invoke` adımının aşağıdaki gibi yapılandırıldığından emin olun:
    
    * `target-url`, `$(target-url)$(request.path)?$(request.query-string)` biçimini izlemelidir. Bu, isteklerin sorgu parametreleriyle birlikte orijinal backend yoluna aracılı olarak iletilmesini sağlar.
    * `header-control` ve `parameter-control`, tüm başlıkların ve parametrelerin geçmesine izin verir. Bu, Wallarm Node'un isteğin tamamını analiz etmesini, herhangi bir bölümündeki saldırıları tespit etmesini ve API envanterini doğru biçimde oluşturmasını sağlar.
1. `invoke` adımından sonra, yanıtların inceleme için Wallarm Node'a aracılı olarak iletilmesi amacıyla `wallarm_post` adımını ekleyin.

```yaml hl_lines="8-22"
...
x-ibm-configuration:
  properties:
    target-url:
      value: <BACKEND_ADDRESS>
  ...
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
...
```

**3. Güncellenmiş API ile ürününüzü yayınlayın**

Trafik akışındaki değişiklikleri uygulamak için, değiştirilen API'yi içeren ürünü yeniden yayınlayın:

```
apic products:publish \
    --scope <KATALOG VEYA ALAN> \
    --server <YÖNETİM SUNUCUSU UÇ NOKTASI> \
    --org <KURULUŞ ADI VEYA ID'Sİ> \
    --catalog <KATALOG ADI VEYA ID'Sİ> \
    <GÜNCELLENMİŞ ÜRÜN YAML'ININ YOLU>
```

[Daha fazla ayrıntı](ibm-api-connect.md)

<style>
  h1#ibm-api-connect-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>