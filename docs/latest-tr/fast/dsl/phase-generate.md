# Oluşturma Aşaması

!!! info "Aşamanın Kapsamı"  
    Bu aşama, modifiye edici bir eklenti içerisinde kullanılır ve çalışması için opsiyoneldir (YAML dosyasında `generate` bölümü ya mevcut ya da mevcut olmayabilir).

    Bu aşama, değiştirmeyen eklentinin YAML dosyasında bulunmamalıdır.
    
    Eklenti türleri hakkında ayrıntılı bilgiyi [buradan][link-ext-logic] okuyabilirsiniz.

!!! info "İstek öğesi açıklama söz dizimi"  
     Bir FAST eklentisi oluştururken, uygulamaya gönderilen HTTP isteğinin yapısını ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekmektedir. Bu sayede, noktalardan yararlanarak çalışmanız gereken istek öğelerini doğru biçimde tanımlayabilirsiniz.
     
     Detaylı bilgiyi görmek için bu [linke][link-points] gidin.
 
Bu aşama, temel isteğe eklenmek üzere belirli parametrelere payload yerleştirilerek oluşturulan test istekleri için kullanılacak yükü (payload) belirtir.

`generate` bölümü aşağıdaki yapıya sahiptir:

```
generate:
  - into:
    - parameter 1
    - parameter 2
    - …
    - parameter N
  - method:
    - postfix
    - prefix
    - random
    - replace
  - payload:
    - payload 1
    - payload 2
    - …
    - payload N
```

* `into` parametresi, payload'un yerleştirileceği tek veya birden fazla istek öğesinin belirtilmesine olanak tanır. Bu parametrenin değeri bir dize veya dizeler dizisi olabilir. `into` parametresinin değeri olarak [Ruby formatlı düzenli ifade][link-ruby-regexp] kullanılabilir.
    
    Bu parametre opsiyoneldir ve bölümde bulunmayabilir. Eğer `into` parametresi belirtilmezse, payload, verilen test politikasına göre değiştirilebilen istek öğesine yerleştirilir.
    
    Test politikasına göre temel istekten aşağıdaki değiştirilebilir istek öğelerinin çıkarıldığını varsayalım:
    
    * `GET_uid_value`
    * `HEADER_COOKIE_value`
    
    Eklenti, değiştirilebilir olan tüm öğeleri (aynı zamanda ekleme noktaları olarak da bilinir) sırasıyla işler.
    
    Eğer `into` parametresi belirtilmezse, payload'lar sırasıyla `GET_uid_value` parametresine yapıştırılır ve oluşturulan test istekleri, hedef uygulamanın güvenlik açıklarını test etmek için kullanılır. Test isteklerinin sonuçları işlendiğinde, eklenti `HEADER_COOKIE_value` parametresini işler ve payload'ları aynı şekilde bu parametreye ekler.
    
    Eğer `into` parametresi, aşağıdaki örnekte gösterildiği gibi `GET_uid_value` istek parametresini içeriyorsa, payload yalnızca `GET_uid_value` parametresine eklenir; `HEADER_COOKIE_value` parametresine eklenmez.
    
    ```
    into: 
      - 'GET_uid_value'
    ```
    
    Aşağıdaki örnekte yalnızca bir parametre bulunduğundan, into parametresi değeri tek satırda yazılabilir:
    
    `into: 'GET_uid_value'`

* `method` — Bu isteğe bağlı parametre, payload'un temel istek öğesine yerleştirilmesi için kullanılacak yöntemlerin listesini belirtir. 
    * `prefix` — Payload'u temel istek öğesi değerinin başına ekler.
    * `postfix` — Payload'u temel istek öğesi değerinin sonuna ekler.
    * `random` — Payload'u temel istek öğesi değerinin rastgele bir yerine ekler.
    * `replace` — Temel istek öğesi değerini payload ile değiştirir.
    
    ![Payload insertion methods][img-generate-methods]
    
    Eğer `method` parametresi belirtilmezse, varsayılan olarak `replace` yöntemi kullanılır.
    
    Oluşturulan test isteklerinin sayısı, belirtilen `method` sayısına bağlıdır: her ekleme yöntemi için bir test isteği oluşturulur.
    
    Örneğin, aşağıdaki ekleme yöntemleri belirtilmişse:
    
    ```
    method:
      - prefix
      - replace
    ```
    
    O zaman tek bir payload için iki test isteği oluşturulur; iki payload için dört test isteği (her payload için iki test isteği) oluşturulur ve böyle devam eder.

* `payload` parametresi, hedef uygulamanın güvenlik açıklarını test etmek üzere oluşturulan test isteğine eklenmek için istek parametresine yerleştirilecek payload'ların listesini belirtir.
    
    Bu parametre zorunludur ve bölümde her zaman bulunmalıdır. Liste en az bir payload içermelidir. Eğer birden fazla payload varsa, FAST düğümü payload'ları istek parametresine sırasıyla ekler ve her oluşturulan test isteğini kullanarak hedef uygulamayı test eder.
    
    ![Payload generation][img-generate-payload]
    
    Payload, istek işleme sırasında bir parametreye eklenen dizedir.
    
    ??? info "Birden Fazla Payload Örneği"
        ```
        payload:
          - "') or 1=('1"
          - "/%5c../%5c../%5c../%5c../%5c../%5c../%5c../etc/passwd/"
        ```
    
    Güvenlik açığı tespit olanaklarını daha da genişletmek için payload'un bir parçası olarak özel işaretleyiciler kullanabilirsiniz:

    * **`STR_MARKER`** — Payload'a, tam olarak `STR_MARKER` ifadesinin belirtildiği konuma rastgele bir dize ekler. 
        
        Örneğin, `STR_MARKER`, uygulamanın XXS açığı için test edilmesinde kullanılabilir.
        
        ??? info "Örnek"
            `'userSTR_MARKER'`
    
    * **`CALC_MARKER`** — Payload'a, tam olarak `CALC_MARKER` ifadesinin belirtildiği konuma rastgele bir aritmetik ifadeyi (örneğin, `1234*100`) içeren bir dize ekler.
        
        Örneğin, `CALC_MARKER`, uygulamanın RCE açığı için test edilmesinde kullanılabilir.
        
        ??? info "Örnek"
            `'; bc <<< CALC_MARKER'`
    
    * **`DNS_MARKER`** — Payload'a, tam olarak `DNS_MARKER` ifadesinin belirtildiği konuma rastgele bir alan adı (örneğin, `r4nd0m.wlrm.tl`) içeren bir dize ekler.
        
        Örneğin, `DNS_MARKER`, uygulamanın DNS Out-of-Bound güvenlik açıklarını test etmek için kullanılabilir.

        ??? info "Örnek"
            `'; ping DNS_MARKER'`
    
    !!! info "İşaretleyicilerin Çalışma Mantığı"
        Detect aşaması, sunucu yanıtında herhangi bir payload'dan bir işaretleyici tespit ederse, saldırı başarılı sayılır; bu durum, güvenlik açığının başarıyla istismar edildiği anlamına gelir. İşaretleyicilerle çalışan Detect aşamasının detaylı bilgilerini görmek için bu [linke][link-markers] gidin.