# API Sessions'e Genel Bakış <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın **API Sessions** özelliği, trafiğinizdeki kullanıcı oturumlarına görünürlük sağlar. Her oturum için Wallarm, ayrıntılı istek ve ilgili yanıt verilerini toplayarak oturum etkinliğine yapılandırılmış bir bakış sunar. Bu makale, API Sessions’a genel bir bakış sağlar: ele aldığı sorunlar, amacı ve başlıca olanaklar.

API Sessions, [NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0 veya [native Wallarm node](../installation/nginx-native-node-internals.md#native-node) 0.8.0 gerektirir. Yanıt ayrıştırma: NGINX Wallarm node 5.3.0 veya native node 0.12.0.

![!API Sessions bölümü - izlenen oturumlar](../images/api-sessions/api-sessions.png)

## Ele alınan sorunlar

API Sessions’ın ele aldığı temel zorluk, Wallarm tarafından tespit edilen yalnızca tekil saldırılara bakıldığında tam bağlamın eksik olmasıdır. Her oturum içindeki istek ve yanıtların mantıksal sırasını yakalayarak, API Sessions daha geniş saldırı kalıplarına dair içgörüler sağlar ve güvenlik önlemlerinden etkilenen iş mantığı alanlarını belirlemeye yardımcı olur.

**Wallarm API Sessions’ı net biçimde tanımladığından, bunlar**:

* API Abuse Prevention tarafından bot tespitini [daha isabetli](#api-sessions-and-api-abuse-prevention) hale getirir.

**Wallarm tarafından izlenen API Sessions ile şunları yapabilirsiniz**:

* Tek bir oturumda yapılan isteklerin listesini görüntüleyerek ve karşılık gelen yanıtların parametrelerini görme olanağıyla [kullanıcı etkinliğini izleyin](exploring.md#full-context-of-threat-actor-activities); böylece alışılmadık davranış kalıplarını veya tipik kullanımdan sapmaları belirleyebilirsiniz.
* Belirli bir [yanlış pozitif](../about-wallarm/protecting-against-attacks.md#false-positives) ayarı yapmadan, [sanal yama](../user-guides/rules/vpatch-rule.md) uygulamadan, [kurallar](../user-guides/rules/rules.md) eklemeden veya [API Abuse Prevention](../api-abuse-prevention/overview.md) kontrollerini etkinleştirmeden önce hangi API akışlarının/iş mantığı sıralarının etkileneceğini bilin.
* Kullanıcı oturumlarında istenen [uç noktaları](exploring.md) inceleyerek koruma durumlarını, risk düzeylerini ve [shadow or zombie](../api-discovery/rogue-api.md) olma gibi tespit edilen sorunları hızla değerlendirin.
* Kullanıcı deneyimini iyileştirmek için [performans sorunlarını](exploring.md#identifying-performance-issues) ve darboğazları belirleyin.
* Kötü amaçlı bot faaliyeti olarak işaretlenen isteklerin tüm dizisini ve karşılık gelen yanıtlarını görüntüleyerek [API suistimali tespit doğruluğunu doğrulayın](exploring.md#verifying-api-abuse-detection-accuracy).

## API Sessions nasıl çalışır

Wallarm node’unun korumak üzere etkinleştirildiği tüm trafik, oturumlara organize edilir ve **API Sessions** bölümünde görüntülenir.

İsteklerin uygulamanızın mantığına göre oturumlara nasıl gruplanacağını özelleştirebilirsiniz. Ayrıca, oturum içinde hangi istek ve karşılık gelen yanıt parametrelerinin gösterileceğini belirterek oturum içeriğini anlamanıza yardımcı olacak bağlam parametrelerini ayarlayabilirsiniz: kullanıcının neyi, hangi sırayla yaptığı. Ayrıntılar için [API Sessions Kurulumu](setup.md).

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4awxsghrjc8u?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarm’ın oturumları **yalnızca son bir hafta** için saklayıp görüntülediğini unutmayın. Daha eski oturumlar, en uygun performans ve kaynak tüketimini sağlamak için silinir.

## API Sessions ve API Abuse Prevention

Wallarm’ın [API Abuse Prevention](../api-abuse-prevention/overview.md) özelliği, örneğin aynı `SESSION-ID` üstbilgisi değerine sahip olup yalnızca zaman/tarih ile ayrılan oturumlar gibi bir veya birkaç ilişkili oturumdaki istek dizilerini analiz ederek kötü amaçlı botları tespit eder.

Dolayısıyla, isteklerin [oturumlara nasıl gruplanacağını](setup.md#session-grouping) belirli uygulama mantığınıza uygun biçimde özelleştirdiğinizde, bu durum API Abuse Prevention’ın çalışmasını etkiler ve hem oturum tanımlamayı hem de bot tespitini daha isabetli hale getirir.

## API Sessions’da GraphQL istekleri

API Sessions, [GraphQL istekleri](../user-guides/rules/request-processing.md#gql) ve bunlara özgü istek noktalarıyla çalışmayı destekler; GraphQL istek parametrelerinin değerlerini çıkarmak ve görüntülemek için oturumları yapılandırabilirsiniz.

![!API Sessions yapılandırması - GraphQL istek parametresi](../images/api-sessions/api-sessions-graphql.png)

NGINX Node 5.3.0 veya daha yüksek ya da native node 0.12.0 gerektirir.