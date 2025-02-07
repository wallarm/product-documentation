[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

#   Eşzamanlı CI/CD İş Akışlarında FAST Kullanımı

!!! info "Gerekli veriler" 
    Bu belgede örnek olarak kullanılan değerler şunlardır:

    * Token olarak `token_Qwe12345`.
    * Test kayıtı tanımlayıcıları olarak `rec_1111` ve `rec_2222`.

Aynı anda eşzamanlı CI/CD iş akışlarında birden fazla FAST düğümü dağıtılabilir. Bu düğümler aynı token’ı paylaşır ve tek bir cloud FAST düğümüyle çalışır.

Bu dağıtım şeması, hem [recording][doc-ci-recording] hem de [testing][doc-ci-testing] modlarında çalışan FAST düğümleri için geçerlidir.

Eşzamanlı FAST düğümlerinin çalışması sırasında çakışmaları önlemek için, her düğüm konteynerine `BUILD_ID` ortam değişkeni aktarılır. Bu değişken aşağıdaki amaçlara hizmet eder:
1.  Recording modunda çalışan bir FAST düğümü tarafından oluşturulan test kaydı için ek bir tanımlayıcı görevi görür.
2.  Testing modunda çalışan bir FAST düğümü tarafından oluşturulan test çalışması için hangi test kaydının kullanılacağını belirlemeyi sağlar (böylece test çalışması ilgili test kaydıyla ilişkilendirilir). 
3.  Belirli bir CI/CD iş akışını tanımlar.

`BUILD_ID` ortam değişkeni değeri olarak harfler ve rakamların herhangi bir kombinasyonunu içerebilir.

Aşağıda, iki FAST düğümünü eşzamanlı olarak nasıl çalıştıracağınızın örneği verilecektir: önce recording modunda, ardından testing modunda. Aşağıda açıklanan yaklaşım ölçeklenebilirdir (ihtiyacınız kadar düğüm kullanabilirsiniz, düğüm sayısı aşağıdaki örnekteki iki ile sınırlı değildir) ve gerçek bir CI/CD iş akışına uygulanabilir.


##  Eşzamanlı CI/CD İş Akışlarında Kullanılmak Üzere FAST Düğümünün Recording Modunda Çalıştırılması

!!! info "Örnekler Hakkında Not"
    Aşağıdaki örnekler, bir FAST düğümü konteynerinin çalışır durumda olması için yeterli olan temel ortam değişkenlerini kullanmaktadır. Bu, basitlik açısından yapılmıştır. 

İlk FAST düğüm konteynerini recording modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-1 \    # Bu komut fast-node-1 konteynerini çalıştırır
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm API sunucu ana bilgisayarı (bu durumda ana bilgisayar Avrupa’daki Wallarm Cloud’ta yer alır)
-e WALLARM_API_TOKEN='qwe_12345' \      # Cloud FAST düğümüne bağlanmak için kullanılacak token
-e CI_MODE=recording \                  # Bu düğüm recording modunda çalışacaktır
-e BUILD_ID=1 \                         # BUILD_ID değeri (eşzamanlı pipeline için başka bir değerden farklı olmalıdır)
-p 8080:8080 wallarm/fast               # Port eşlemesi burada yapılır. Ayrıca, kullanılacak Docker imajı burada belirtilmiştir.
```

İkinci eşzamanlı FAST düğüm konteynerini recording modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # İlk FAST düğümde kullanılan token değeriyle aynı olmalıdır
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # BUILD_ID değeri, ilk FAST düğümde kullanılan değerden farklıdır; bu farklı CI/CD iş akışı için kullanılır.
-p 8000:8080 wallarm/fast
```

!!! info "docker run Emirleri Hakkında Not"
    Yukarıda belirtilen komutların aynı Docker host üzerinde çalıştırılması varsayılmaktadır, bu nedenle farklı `BUILD_ID` değerlerinin yanı sıra, bu komutların konteyner isimleri (`fast-node-1` ve `fast-node-2`) ve hedef port değerleri (`8080` ve `8000`) farklıdır.
    
    Eğer FAST düğüm konteynerlerini ayrı Docker host’larda çalıştırıyorsanız, o zaman `docker run` komutları yalnızca `BUILD_ID` değerleri açısından farklılık gösterebilir.

Bu iki komut çalıştırıldıktan sonra, iki FAST düğümü aynı cloud FAST düğümünü kullanarak recording modunda çalışacak, ancak **farklı test kayıtları oluşturulacaktır**.

CI/CD aracı konsol çıktısı, [burada][doc-ci-recording-example] tarif edilen çıktı ile benzer olacaktır.

Gerekli tüm temel isteklerle test kayıtları doldurulduktan sonra, ilgili FAST düğümler kapatılır ve testing modunda diğer düğümler başlatılır.

##  Eşzamanlı CI/CD İş Akışlarında Kullanılmak Üzere FAST Düğümünün Testing Modunda Çalıştırılması

FAST düğümleri `fast-node-1` ve `fast-node-2` recording modunda çalışırken `rec_1111` ve `rec_2222` test kayıtlarının hazırlandığını varsayalım.

Ardından, testing modundaki bir FAST düğümünün `rec_1111` test kaydını kullanması için konteynerine `BUILD_ID=1` ortam değişkeni aktarın. Benzer şekilde, `rec_2222` test kaydını kullanması için `BUILD_ID=2` ortam değişkenini aktarın. Aşağıdaki ilgili `docker run` komutlarını kullanarak FAST düğümlerini testing modunda çalıştırın.

İlk FAST düğüm konteynerini testing modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Bu düğüm testing modunda çalışacaktır
-e BUILD_ID=1 \                         # `BUILD_ID=1` değişkeni, `rec_1111` test kaydına karşılık gelir
wallarm/fast
```

İkinci eşzamanlı FAST düğüm konteynerini testing modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Bu düğüm testing modunda çalışacaktır
-e BUILD_ID=2 \                         # `BUILD_ID=2` değişkeni, `rec_2222` test kaydına karşılık gelir
wallarm/fast
```

CI/CD aracı konsol çıktısı, [burada][doc-ci-testing-example] tarif edilen çıktı ile benzer olacaktır.

İlgili `BUILD_ID` ortam değişkeni değerlerinin FAST düğümlerine aktarılması sonucunda, **iki test çalışması eşzamanlı olarak yürütülmeye başlanır**, her biri farklı bir test kaydıyla çalışır.

Böylece FAST düğümü sayısını `BUILD_ID` ortam değişkenini belirterek eşzamanlı CI/CD iş akışları için çalıştırabilir ve düğümler arasında herhangi bir çakışma oluşturmadan (yeni oluşturulan bir test çalışması, halihazırda çalışan bir test çalışmasının yürütülmesini kesmez) işlem yapabilirsiniz.