# API Sessions Genel Bakış <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın **API Sessions** özellikleri, trafiğinizdeki kullanıcı oturumlarına dair görünürlük sağlar. Her oturum için Wallarm, detaylı istek ve ilgili yanıt verilerini toplayarak oturum etkinliğinin yapılandırılmış bir görünümünü sunar. Bu makale, API Sessions hakkında genel bir bakış sunar: ele alınan sorunlar, amacı ve temel olanakları.

API Sessions, [NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0 veya [native Wallarm node](../installation/nginx-native-node-internals.md#native-node) 0.8.0 gerektirir. Yanıt ayrıştırması – NGINX Wallarm node 5.3.0 ile desteklenir, native node tarafından şu ana kadar desteklenmemektedir.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

## Ele Alınan Sorunlar

API Sessions'in ele aldığı temel zorluk, sadece Wallarm tarafından tespit edilen bireysel saldırılara bakıldığında tam bağlamın eksikliğidir. Her oturum içindeki istek ve yanıtların mantıksal sırasını yakalayarak, API Sessions daha geniş saldırı kalıpları hakkında içgörüler sunar ve güvenlik önlemlerinden etkilenen iş mantığı alanlarının belirlenmesine yardımcı olur.

**Wallarm tarafından kesin olarak tanımlanmış API Sessions mevcut olduğundan, bunlar:**

* API Abuse Prevention'un bot tespitini [daha kesin hale getirir](#api-sessions-and-api-abuse-prevention).

**Wallarm tarafından izlenen API Sessions'a sahip olduğunuz için, şunları yapabilirsiniz:**

* Tek bir oturum içinde yapılan isteklerin listesini görüntüleyerek, ilgili yanıt parametrelerini inceleyip [kullanıcı aktivitesini izleyin](exploring.md#full-context-of-threat-actor-activities); böylece alışılmadık davranış kalıplarını veya tipik kullanımdan sapmaları tespit edebilirsiniz.
* Belirli bir [yanlış pozitif](../about-wallarm/protecting-against-attacks.md#false-positives) ayarlamadan, [virtual patch](../user-guides/rules/vpatch-rule.md) uygulamadan, [rules](../user-guides/rules/rules.md) eklemeden veya [API Abuse Prevention](../api-abuse-prevention/overview.md) kontrollerini etkinleştirmeden önce, hangi API akışı/iş mantığı dizilerinin etkileneceğini bilin.
* Kullanıcı oturumlarında talep edilen [uç noktaları](exploring.md) inceleyerek, koruma durumlarını, risk seviyelerini ve [shadow or zombie](../api-discovery/rogue-api.md) gibi tespit edilen sorunları hızla değerlendirin.
* Kullanıcı deneyimini optimize etmek için [performans sorunlarını ve darboğazlarını tespit edin](exploring.md#identifying-performance-issues).
* Zararlı bot aktivitesi olarak işaretlenen istek dizisinin tamamını, ilgili yanıtlarla birlikte görüntüleyerek [API kötüye kullanım tespit doğruluğunu kontrol edin](exploring.md#verifying-api-abuse-detection-accuracy).

## API Sessions Nasıl Çalışır

Wallarm node'un güvenliğini sağlamak için etkinleştirildiği tüm trafik, oturumlar halinde organize edilir ve **API Sessions** bölümünde görüntülenir.

Uygulamalarınızın mantığına göre isteklerin oturumlara nasıl gruplanacağını özelleştirebilirsiniz. Ayrıca, oturum içinde hangi istek ve ilgili yanıt parametrelerinin görüntüleneceğini belirterek oturum içeriğini – kullanıcının ne yaptığını ve hangi sırayla yaptığı (bağlam parametreleri) – anlamanızı sağlayabilirsiniz. Detaylar için bakınız [API Sessions Setup](setup.md).

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4awxsghrjc8u?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Not: Wallarm, oturumları **sadece son bir hafta** boyunca saklar ve görüntüler. Optimal performans ve kaynak tüketimi sağlamak amacıyla daha eski oturumlar silinir.

## API Sessions ve API Abuse Prevention

Wallarm'ın [API Abuse Prevention](../api-abuse-prevention/overview.md), bir veya birden fazla ilgili oturumdaki istek dizilerini analiz ederek kötü niyetli botları tespit eder; örneğin, `SESSION-ID` başlığı aynı olan ve yalnızca zaman/tarih farkıyla ayrılan oturumlar.

Bu nedenle, isteklerinizi uygulama mantığınıza uygun olarak [nasıl gruplanacağını](setup.md#session-grouping) özelleştirdiğinizde, API Abuse Prevention'un işleyişini etkiler; böylece hem oturum tanımlaması hem de bot tespiti daha kesin hale gelir.

## API Sessions İçinde GraphQL İstekleri

API Sessions, [GraphQL istekleri](../user-guides/rules/request-processing.md#gql) ve bunlara özgü istek noktaları ile çalışmayı destekler; oturumları, GraphQL istek parametrelerinin değerlerini çıkarmak ve görüntülemek üzere yapılandırabilirsiniz.

![!API Sessions configuration - GraphQL request parameter](../images/api-sessions/api-sessions-graphql.png)

NGINX Node 5.3.0 veya üstü gerektirir, Native Node tarafından şu ana kadar desteklenmemektedir.