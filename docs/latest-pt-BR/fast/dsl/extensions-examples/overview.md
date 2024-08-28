[link-points]:               ../points/intro.md
[link-mod-extension]:        mod-extension.md
[link-non-mod-extension]:    non-mod-extension.md
[link-app-examination]:      app-examination.md
[link-juice-shop]:           https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:    https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:      https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:      ../using-extension.md


# Exemplos das Extensões FAST: Visão Geral

A aplicação web vulnerável [OWASP Juice Shop][link-juice-shop] será usada para demonstrar as capacidades do mecanismo de extensão FAST.

Esta aplicação pode ser [implantada][link-juice-shop-deploy] de várias maneiras (por exemplo, usando Docker, Node.JS ou Vagrant).

Para visualizar a documentação OWASP Juice Shop que lista as vulnerabilidades embutidas nela, prossiga para o seguinte [link][link-juice-shop-docs].

!!! aviso "Trabalhando com uma aplicação vulnerável"
    Sugerimos que você evite fornecer ao host que a OWASP Juice Shop executa o acesso à internet ou dados reais (por exemplo, pares de login/senha).

Para testar a aplicação-alvo "OWASP Juice Shop" quanto a vulnerabilidades, siga as seguintes etapas:

1.  [Examine a aplicação web][link-app-examination] para se familiarizar com seu comportamento.
2.  [Elabore uma amostra de extensão modificadora.][link-mod-extension]
3.  [Elabore uma amostra de extensão não modificadora.][link-non-mod-extension]
4.  [Use as extensões criadas.][link-using-extension]

!!! info "Sintaxe da descrição dos elementos do solicitação"
     Ao criar uma extensão FAST, você precisa entender a estrutura da solicitação HTTP enviada para a aplicação e da resposta HTTP recebida da aplicação para descrever corretamente os elementos da solicitação que você precisa trabalhar usando os pontos.
     
     Para ver informações detalhadas, prossiga para este [link][link-points].
