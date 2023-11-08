* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada no Wallarm Console para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/)
* SELinux desativado ou configurado de acordo com as [instruções][configure-selinux-instr]
* Versão de lançamento NGINX Plus 28 (R28)

    !!! info "Versões personalizadas do NGINX Plus"
        Se você possui uma versão diferente, consulte as instruções sobre [como conectar o módulo Wallarm à compilação personalizada do NGINX][nginx-custom]
* A execução de todos os comandos como superusuário (por exemplo, `root`)
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Certifique-se de que o acesso não esteja bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm dos EUA ou a `https://api.wallarm.com` para trabalhar com a Nuvem Wallarm da UE. Se o acesso só pode ser configurado via servidor proxy, então use as [instruções][configure-proxy-balancer-instr]
* Acesso aos endereços IP do Google Cloud Storage listados no seguinte [link](https://www.gstatic.com/ipranges/goog.json). Quando você [adiciona à lista permitida, lista de bloqueio ou lista de cinza][ip-lists-docs] países inteiros, regiões ou centros de dados em vez de endereços IP individuais, o nó Wallarm obtém endereços IP precisos relacionados às entradas nas listas de IP da base de dados agregada hospedada no Google Storage
* Editor de texto instalado **vim**, **nano**, ou qualquer outro. Na instrução, **vim** é usado
