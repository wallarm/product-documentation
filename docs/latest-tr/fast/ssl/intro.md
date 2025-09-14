[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png


# Giriş

Bir web uygulamasıyla bir tarayıcı üzerinden HTTPS kullanarak çalışırken, güvenilmeyen bir sertifika hakkında buna benzer bir mesaj görebilirsiniz:

![Mozilla Firefox'un güvenilmeyen sertifika mesajı][img-insecure-connection]

FAST node, istemciden gelen HTTPS isteklerini keser ve uzak sunucuya bağlantıyı kendisi başlatır. Tarayıcınızın FAST node sertifikasına güvenmesi gerekir, aksi halde tarayıcı bu durumu ortadaki adam (man-in-the-middle) saldırısı olarak değerlendirir.  

Kullandığınız tarayıcının güvendiği bir sertifikaya FAST node sahip değilse, o tarayıcıdan sunucuya HTTPS istekleri göndermeye çalışmak güvensiz bağlantı uyarısıyla sonuçlanır. 

HTTPS üzerinden web uygulamalarıyla sorunsuz çalışmak için aşağıdaki çözümlerden birini kullanabilirsiniz:
* Tarayıcınızın zaten güvendiği kendi SSL sertifikanız varsa, bunu [FAST node'a ekleyebilirsiniz][link-node-installation].
* Kendi SSL sertifikanız yoksa, FAST node'un kendinden imzalı kök sertifikasını tarayıcınıza ekleyebilirsiniz. Bunu yapmak için tarayıcınıza uygun talimatları izleyin:
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]