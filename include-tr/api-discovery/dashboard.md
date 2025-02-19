Review data about your API collected by the Wallarm's [**API Discovery**][apid-overview] with the **API Discovery** dashboard.
API'nizle ilgili verileri Wallarm'ın [**API Discovery**][apid-overview] tarafından toplanan verileri, **API Discovery** panosu ile inceleyin.

The dashboard provides the full landscape of your API endpoints, including shadow, orphan, and zombie APIs.
Pano, gölge, yetim ve zombi API'leri de dahil olmak üzere API uç noktalarınızın tam manzarasını sunar.

It visualizes the **risk score assessment** results helping prioritize security efforts by identifying the most vulnerable or high-risk APIs.
En savunmasız veya yüksek riskli API'leri belirleyerek güvenlik çabalarını önceliklendirmenize yardımcı olmak amacıyla **risk score assessment** sonuçlarını görselleştirir.

APIs evolve over time, with new endpoints being added and old ones deprecated. The dashboard provides visibility into these changes which ensures that deprecated APIs are properly retired and that new or modified APIs are compliant with security policies and standards.
API'ler zaman içinde evrilir; yeni uç noktalar eklenirken eski olanlar kullanımdan kaldırılır. Pano, bu değişikliklere görünürlük sağlayarak, kullanımdan kaldırılan API'lerin düzgün şekilde emekliye ayrıldığını ve yeni ya da değiştirilmiş API'lerin güvenlik politikaları ve standartlarına uygun olduğunu garanti eder.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/e1bl1st5rxkv" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Consider the following:
Aşağıdakileri göz önünde bulundurun:

* How much your API endpoints are under risk is marked with the [risk score][apid-risk-score]
  API uç noktalarınızın ne kadar risk altında olduğunu [risk score][apid-risk-score] ile belirtilir.
* Pay attention to [changes][apid-track-changes] in your API (displayed for the last 7 days)
  API'nizdeki [changes][apid-track-changes] (son 7 gün boyunca gösteriliyor) dikkat edin.
* [Rogue API][apid-rogue] is a serious risk factor - upload your specification to compare with real traffic
  [Rogue API][apid-rogue] ciddi bir risk faktörüdür - gerçek trafik ile karşılaştırmak için spesifikasyonunuzu yükleyin.