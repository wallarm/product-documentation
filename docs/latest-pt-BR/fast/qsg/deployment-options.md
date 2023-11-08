---
descrição: FAST é uma solução composta por dois componentes, o nó FAST e a nuvem Wallarm. Este guia o instrui sobre como implantar o nó FAST.
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com    


# Opções de implantação

FAST é uma solução composta por dois componentes, o nó FAST e a nuvem Wallarm. Este guia o instrui sobre como implantar o nó FAST.

--8<-- "../include-pt-BR/fast/cloud-note.md"

Para realizar o teste da aplicação, as requisições HTTP ou HTTPS são proxy através do nó FAST primeiro. O FAST cria um novo conjunto de requisições com base nas consultas originais de acordo com a política obtida da nuvem. As novas requisições formam um conjunto de teste de segurança que são executadas para testar as vulnerabilidades da aplicação.

![Um processo de teste com FAST][img-fast-integration]

As requisições base (as requisições originais para as aplicações) podem ser obtidas de diferentes fontes. Por exemplo, as requisições base podem ser escritas por um testador de aplicação ou geradas por uma ferramenta de automação de teste existente. O FAST não requer que todas as requisições base sejam maliciosas: um conjunto de teste de segurança poderia ser gerado com base em requisições legítimas também. O nó FAST é usado para a criação e execução do conjunto de teste de segurança.

![Como o FAST funciona][img-fast-scheme]


## Opções de implantação disponíveis

Você tem a opção de três opções de implantação do nó FAST. A instalação do nó pode ser localizada em
1. O host que serve como fonte de requisição base (por exemplo, o laptop de um testador)
2. O host onde reside a aplicação alvo
3. O host dedicado

![Opções de implantação do FAST][img-fast-deployment-options]


## Principais considerações de implantação

O nó FAST é fornecido como um contêiner Docker e pode ser executado em todas as plataformas que suportam Docker (isso inclui Linux, Windows e macOS).

Uma conta na nuvem Wallarm é um requisito obrigatório para a implantação do FAST. A nuvem é responsável por fornecer uma interface de usuário para a configuração do FAST. Os resultados dos testes também são coletados pela nuvem.

Após concluir a implantação do nó FAST, você deve garantir que:
1. O nó possui acesso à aplicação alvo.
2. O nó possui acesso à nuvem Wallarm.
3. Todas as requisições HTTP ou HTTPS de base serão proxy através do nó.

!!! info "Instalação do certificado SSL"
    No caso de usar HTTPS para interagir com a aplicação alvo, a fonte de requisição pode não confiar no certificado SSL auto-assinado obtido da instalação do nó FAST. Por exemplo, se você usa o navegador Mozilla Firefox como fonte das requisições, você pode encontrar uma mensagem semelhante (pode variar para outros navegadores ou fontes de requisição):
    
    ![Mensagem “Conexão insegura”][img-insecure-connection]
    
    Para resolver o problema do certificado, você tem duas opções:

    1.  Instale o certificado SSL auto-assinado do nó FAST como um certificado confiável na fonte de requisição.
    1.  Instale o certificado SSL confiável existente no seu nó FAST.
  
## Especificações de implantação do FAST no guia Quick Start 

Este guia visa demonstrar a operação do FAST, explorando a opção de implantação onde o nó é instalado localmente com a fonte de requisição.

A instalação que é usada neste guia tem as seguintes especificidades:

* O navegador Mozilla Firefox serve como a fonte de requisição base.
* Uma requisição base HTTPS é construída.
* Um certificado SSL auto-assinado do nó FAST é instalado no navegador.
* Google Gruyere serve como a aplicação alvo.
* A aplicação alvo é testada contra vulnerabilidades XSS
* A política é criada com a interface web da nuvem Wallarm.
* O processo de teste é iniciado com a interface web da nuvem Wallarm.

![Esquema de implantação do guia Quick Start][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    Google Gruyere é uma aplicação construída especificamente para testes de segurança. Ela contém muitas vulnerabilidades intencionalmente integradas. Portanto, cada instância de aplicação é executada em uma sandbox isolada por motivos de segurança. Para começar a trabalhar com a aplicação, você deve navegar até <https://google-gruyere.appspot.com> e executar uma sandbox com a instância separada da aplicação Gruyere.