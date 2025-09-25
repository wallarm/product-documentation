Wallarm tarafından kötü amaçlı istek tespit edilip bir saldırının parçası olarak [**Attacks**][link-attacks] veya [**Incidents**][link-incidents] bölümünde görüntülendiğinde, bu isteğin tam bağlamını öğrenme olanağına sahipsiniz: hangi kullanıcı oturumuna ait olduğunu ve bu oturumdaki isteklerin tam sıralamasının ne olduğunu. Bu, saldırı vektörlerini ve hangi kaynakların tehlikeye girebileceğini anlamak için tehdit aktörünün tüm etkinliğini araştırmanıza olanak tanır.

Bu analizi gerçekleştirmek için, Wallarm Console → **Attacks** veya **Incidents** içinde saldırıya erişin ve ardından belirli istek ayrıntılarına gidin. İstek ayrıntılarında, **Explore in API Sessions**'ı tıklayın. Wallarm, filtre uygulanmış [**API Session**][link-sessions] bölümünü açacaktır: ilk isteğin ait olduğu oturum görüntülenir, bu oturumda yalnızca ilk istek gösterilir.

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(58.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/psopwjk9vfas?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Oturumdaki diğer tüm istekleri görmek için request ID filtresini kaldırın: artık kötü amaçlı isteğin ait olduğu oturumda neler olup bittiğine dair tam bir resme sahipsiniz.