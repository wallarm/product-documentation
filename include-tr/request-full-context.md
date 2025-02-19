Once the malicious request is detected by Wallarm and displayed in the [**Attacks**][link-attacks] or [**Incidents**][link-incidents] section as the part of some attack, you have an ability to know the full context of this request: to which user session it belongs and what the full sequence of requests in this session is. This allows investigating all activity of the threat actor to understand attack vectors and what resources can be compromised.

Wallarm tarafından kötü niyetli istek tespit edildikten ve [**Attacks**][link-attacks] veya [**Incidents**][link-incidents] bölümünde bir saldırının parçası olarak görüntülendikten sonra, bu isteğin hangi kullanıcı oturumuna ait olduğunu ve bu oturumdaki isteklerin tam sırasını öğrenme imkânına sahip olursunuz. Bu, saldırganın tüm etkinliğini araştırarak saldırı vektörlerini ve hangi kaynakların tehlikeye girebileceğini anlamanıza olanak tanır.

To perform this analysis, in Wallarm Console → **Attacks** or **Incidents**, access the attack, and then specific request details. In request details, click **Explore in API Sessions**. Wallarm will open the [**API Session**][link-sessions] section filtered: the session, the initial request belongs to is displayed, only the initial request is displayed within this session.

Bu analizi gerçekleştirmek için, Wallarm Console → **Attacks** veya **Incidents** bölümünde saldırıya erişin ve ardından belirli istek detaylarına girin. İstek detaylarında **Explore in API Sessions** seçeneğine tıklayın. Wallarm, filtrelenmiş olarak [**API Session**][link-sessions] bölümünü açacaktır: oturum ve ilk isteğe ait bilgiler görüntülenecek, bu oturum içinde yalnızca ilk istek gösterilecektir.

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(58.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/psopwjk9vfas?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Remove the filter by request ID to see all other requests in the session: now you have the full picture of what was going on within the session the malicious request belongs to.

Oturumdaki diğer tüm istekleri görmek için istek ID'sine göre filtrelemeyi kaldırın: artık kötü niyetli isteğin ait olduğu oturumda neler olduğunu tam olarak görebileceksiniz.