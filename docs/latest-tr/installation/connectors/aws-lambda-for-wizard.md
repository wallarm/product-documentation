# Sihirbaz için Cloudfront

Wallarm Edge node'u Amazon CloudFront'a bağlayarak trafiği [eşzamanlı](../inline/overview.md) veya [eşzamansız](../oob/overview.md) modda - hiçbir isteği engellemeden - inceleyebilirsiniz.

Bağlantıyı kurmak için aşağıdaki adımları izleyin.

1. Platformunuz için sağlanan kod paketini indirin.
1. AWS Console → **Services** → **Lambda** → **Functions** bölümüne gidin.
1. `us-east-1` (N. Virginia) bölgesini seçin; bu, [Lambda@Edge işlevleri için gereklidir](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function).
1. Aşağıdaki ayarlarla **Create function** oluşturun:

    * Runtime: Python 3.x.
    * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
    * Diğer ayarlar varsayılan olarak kalabilir.
1. İşlev oluşturulduktan sonra, **Code** sekmesinde Wallarm istek işleme kodunu yapıştırın.
1. Kodda aşağıdaki parametreleri güncelleyin:

    * `wlrm_node_addr`: Wallarm node URL'niz.
    * `wlrm_inline`: [eşzamansız (out-of-band)](../oob/overview.md) modu kullanıyorsanız, `False` olarak ayarlayın.
    * Gerekirse diğer parametreleri değiştirin.
1. **Actions** → **Deploy to Lambda@Edge** bölümüne geçin ve aşağıdaki ayarları belirtin:

    * Yeni CloudFront tetikleyicisi yapılandırın.
    * Distribution: korumak istediğiniz origin'e trafiği yönlendiren CDN'iniz.
    * Cache behavior: Lambda işlevi için önbellek davranışı, genellikle `*`.
    * CloudFront event: 
        
        * **Origin request**: işlevi yalnızca CloudFront CDN arka uçtan veri istediğinde çalıştırır. CDN önbelleğe alınmış bir yanıt döndürürse, işlev çalıştırılmaz.
        * **Viewer request**: CloudFront CDN'ye gelen her istek için işlevi çalıştırır.
    * **Include body**'yi işaretleyin.
    * **Confirm deploy to Lambda@Edge**'i işaretleyin.
1. Wallarm tarafından sağlanan yanıt işlevi için de aynı işlemi tekrarlayın ve tetikleyici olarak yanıtları seçin.

    Yanıt tetikleyicisinin istek tetikleyicisiyle eşleştiğinden emin olun (origin request için origin response, viewer request için viewer response).

[Daha fazla ayrıntı](aws-lambda.md)

<style>
  h1#cloudfront-for-wizard {
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