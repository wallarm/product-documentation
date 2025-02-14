[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

# Nagios'da Filtre Düğüm Metrikleri ile Çalışma

Nagios'un daha önce oluşturulan hizmetin durumunu başarıyla izlediğini doğrulayın:
1.  Nagios web arayüzüne giriş yapın.
2.  “Hizmetler” bağlantısına tıklayarak hizmetler sayfasına gidin.
3.  `wallarm_nginx_abnormal` hizmetinin görüntülendiğinden ve "OK" durumunda olduğundan emin olun:

    ![Hizmet durumu][img-nagios-service-status]

    
    !!! info "Hizmet kontrolünün zorlanması"
        Hizmetin "OK" durumunda olmaması durumunda, hizmetin durumunu doğrulamak için bir hizmet kontrolü zorlayabilirsiniz.
        
        Bunu yapmak için, "Hizmet" sütunundaki hizmet adına tıklayın ve ardından "Hizmetin bir sonraki kontrolünü yeniden planla" seçeneğini seçerek "Hizmet Komutları" listesindeki gerekli parametreleri girin ve kontrolü çalıştırın.     
    

4.  “Durum” sütunundaki adına tıklayarak hizmet hakkındaki ayrıntılı bilgilere bakın:

    ![Hizmet hakkında ayrıntılı bilgi][img-nagios-service-details]

    Nagios'da görüntülenen ölçüm değerinin ( “Performans Verisi” satırı), filtre düğümünde `wallarm-status` çıktısıyla eşleştiğinden emin olun:

    --8<-- "../include-tr/monitoring/wallarm-status-check-latest.md"
 
5.  Filtre düğümü tarafından korunan bir uygulamada bir test saldırısı gerçekleştirin. Bunu yapmak için, curl yardımcı programı veya bir tarayıcı ile uygulamaya zararlı bir istek gönderebilirsiniz.

    --8<-- "../include-tr/monitoring/sample-malicious-request.md"
    
6.  Nagios'daki “Performans Verisi” değerinin arttığından ve filtre düğümünde `wallarm-status` tarafından görüntülenen değerle eşleştiğinden emin olun:

    --8<-- "../include-tr/monitoring/wallarm-status-output-latest.md"

    ![Güncellenen Performans Verisi değeri][img-nagios-service-perfdata-updated]

Şimdi, filtre düğümünün `wallarm_nginx/gauge-abnormal` metriğinin değerleri, Nagios'daki hizmet durumu bilgisinde görüntüleniyor.

!!! info "Nagios veri görselleştirme"
    Varsayılan olarak, Nagios Core yalnızca hizmet durumunu izlemeyi destekler (`OK`, `UYARI`, `KRİTİK`). "Performans Verisi"nde yer alan metrik değerleri saklamak ve görselleştirmek için üçüncü taraf yardımcı programlarını kullanabilirsiniz, örneğin, [PNP4Nagios][link-PNP4Nagios].