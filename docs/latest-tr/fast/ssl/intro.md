[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png


# Giriş

HTTPS kullanarak bir tarayıcı üzerinden web uygulaması ile çalışırken, güvenilmeyen bir sertifika hakkında bu veya benzeri bir mesaj görebilirsiniz:

![Mozilla Firefox'un güvenilmeyen sertifika mesajı][img-insecure-connection]

FAST node, bir istemciden gelen HTTPS isteklerini keser ve kendisi uzak sunucuya bağlantı başlatır. Tarayıcınızın FAST node sertifikasına güvenmesi gerekir, aksi halde tarayıcı bu durumu ortadaki adam saldırısı olarak değerlendirir.

Eğer FAST node, kullandığınız tarayıcı tarafından güvenilmeyen bir sertifikaya sahipse, o tarayıcıdan sunucuya HTTPS istekleri göndermeye çalıştığınızda güvensiz bağlantı uyarısı alırsınız.

HTTPS üzerinden web uygulamaları ile başarılı bir şekilde çalışmak için aşağıdaki çözümlerden birini kullanabilirsiniz:
* Tarayıcınızın zaten güvendiği kendi SSL sertifikanız varsa, bunu [FAST node'a ekleyebilirsiniz][link-node-installation].
* Kendi SSL sertifikanız yoksa, FAST node'un imzasız kök sertifikasını tarayıcınıza ekleyebilirsiniz. Bunu yapmak için tarayıcınız için aşağıdaki talimatları izleyin:
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]