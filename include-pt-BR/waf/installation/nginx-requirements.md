* Acesso à conta com a função de **Administrador** ou **Deploy** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/)
* SELinux desativado ou configurado de acordo com as [instruções][configure-selinux-instr]
* Execução de todos os comandos como superusuário (por exemplo, `root`)
* Para o processamento de solicitações e pós-análise em servidores diferentes: pós-análise instalada no servidor separado de acordo com as [instruções][install-postanalytics-instr]
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com:444` para trabalhar com a Nuvem Wallarm dos EUA ou para `https://api.wallarm.com:444` para trabalhar com a Nuvem Wallarm da UE. Se o acesso só pode ser configurado via servidor proxy, use as [instruções][configure-proxy-balancer-instr]
* Editor de texto instalado **vim**, **nano**, ou qualquer outro. Na instrução, **vim** é usado
