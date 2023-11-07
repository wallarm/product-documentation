* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desabilitada no Console Wallarm para o [Cloud dos EUA](https://us1.my.wallarm.com/) ou [Cloud da EU](https://my.wallarm.com/)
* SELinux desativado ou configurado de acordo com as [instruções][configure-selinux-instr]
* Versão do NGINX 1.24.0

    !!! info "Versões personalizadas do NGINX"
        Se você tem uma versão diferente, consulte as instruções sobre [como conectar o módulo Wallarm à compilação personalizada do NGINX][nginx-custom]
* Execução de todos os comandos como superusuário (ex.: `root`)
* Para o processamento de solicitações e pós-análise em servidores diferentes: pós-análise instalada em um servidor separado conforme as [instruções][install-postanalytics-instr]
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Garanta que o acesso não esteja bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` para trabalhar com o Cloud Wallarm dos EUA ou a `https://api.wallarm.com` para trabalhar com o Cloud Wallarm da UE. Se o acesso só pode ser configurado via servidor proxy, use as [instruções][configure-proxy-balancer-instr]
* Acesso a endereços IP do Google Cloud Storage listados no [link](https://www.gstatic.com/ipranges/goog.json). Quando você [lista para permissão, para bloqueio, ou para observação][ip-lists-docs] países, regiões ou data centers inteiros em vez de endereços IP individuais, o nó Wallarm recupera endereços IP precisos relacionados às entradas nas listas de IP do banco de dados agregado hospedado no Google Storage
* Editor de texto instalado **vim**, **nano**, ou qualquer outro. Na instrução, **vim** é usado