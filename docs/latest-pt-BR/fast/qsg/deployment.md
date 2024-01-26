[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment/5-qsg-fast-inst-scheme.png
[img-fast-create-node]:         ../../images/fast/qsg/common/deployment/6-qsg-fast-inst-create-node.png   
[img-firefox-options]:          ../../images/fast/qsg/common/deployment/9-qsg-fast-inst-ff-options-window.png
[img-firefox-proxy-options]:    ../../images/fast/qsg/common/deployment/10-qsg-fast-inst-ff-proxy-options.png
[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

[link-https-google-gruyere]:    https://google-gruyere.appspot.com
[link-docker-docs]:             https://docs.docker.com/
[link-wl-fast-trial]:           https://fast.wallarm.com/signup
[link-wl-console]:              https://us1.my.wallarm.com
[link-ssl-installation]:        ../ssl/intro.md

[wl-cloud-list]:    ../cloud-list.md
      
[anchor1]:  #1-installar-o-software-docker              
[anchor2]:  #2-obter-um-token-que-sera-usado-para-conectar-seu-fast-node-ao-cloud-wallarm
[anchor3]:  #3-preparar-um-arquivo-contendo-as-variaveis-de-ambiente-necessarias 
[anchor4]:  #4-implantar-o-container-docker-do-fast-node 
[anchor5]:  #5-configurar-o-navegador-para-trabalhar-com-o-proxy
[anchor6]:  #6-instalar-certificados-ssl 
    
    
# Implantação do nó FAST

Este capítulo o guiará durante o processo de instalação e configuração inicial do nó FAST. Após a conclusão de todas as etapas necessárias, você terá um nó FAST operando. Ele estará ouvindo em `localhost:8080`, pronto para encaminhar as solicitações HTTP e HTTPS para o aplicativo [Google Gruyere][link-https-google-gruyere]. O nó será instalado em sua máquina juntamente com o navegador Mozilla Firefox.
    
!!! info "Nota sobre o navegador a ser usado"
    Este guia sugere que você use o navegador Mozilla Firefox. No entanto, é possível usar qualquer navegador de sua escolha, desde que você o tenha configurado com sucesso para enviar todo o tráfego HTTP e HTTPS para o nó FAST.

![Esquema de implantação do nó FAST em uso][img-qsg-deployment-scheme]    
        
Para instalar e configurar o nó FAST, faça o seguinte:

1.  [Instale o software Docker][anchor1].
2.  [Obtenha um token que será usado para conectar seu nó FAST à nuvem Wallarm][anchor2].
3.  [Prepare um arquivo contendo as variáveis de ambiente necessárias][anchor3].
4.  [Implante o recipiente Docker do nó FAST][anchor4].
5.  [Configure o navegador para trabalhar com o proxy][anchor5].
6.  [Instale os certificados SSL][anchor6].
            
##  1.  Instale o software Docker 

Configure o software Docker em sua máquina. Consulte o [guia de instalação][link-docker-docs] oficial do Docker para obter mais informações.

É sugerido que você use a Edição Comunitária Docker (CE). No entanto, qualquer edição Docker pode ser usada.
    
    
##  2.  Obtenha um token que será usado para conectar seu nó FAST à nuvem Wallarm

1.  Faça login no portal [My Wallarm][link-wl-console] usando sua conta Wallarm.

    Se você ainda não tem uma, então [crie uma conta][link-wl-fast-trial].

2.  Selecione a guia "Nodes", depois clique no botão **Criar nó FAST** (ou no link **Adicionar nó FAST**).

    ![Criação de um novo nó][img-fast-create-node]

3.  Uma janela de diálogo aparecerá. Dê um nome significativo ao nó e seleciona o botão **Criar**. O guia sugere que você use o nome `DEMO NODE`.
    
4.  Passe o cursor do mouse sobre o campo **Token** do nó criado e copie o valor.

    !!! info "Nota sobre o token"
        Também é possível recuperar o token por meio de uma chamada para a API Wallarm. No entanto, isso está fora do escopo deste documento. 
        
##  3.  Prepare um arquivo contendo as variáveis de ambiente necessárias 

É obrigatório que você configure várias variáveis de ambiente para que o nó FAST funcione.

Para fazer isso, crie um arquivo de texto e adicione o seguinte texto a ele:

```
WALLARM_API_TOKEN=<o valor do token que você obteve na etapa 2>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

Você definiu as variáveis de ambiente. Seu objetivo pode ser descrito da seguinte maneira:
* `WALLARM_API_TOKEN` — define o valor do token usado para conectar o nó à nuvem Wallarm
* `ALLOWED_HOSTS` — limita o alcance das solicitações para gerar um teste de segurança a partir de; testes de segurança serão gerados apenas a partir de solicitações para o domínio `google-gruyere.appspot.com`, onde reside o aplicativo de destino.
    
!!! info "Usando a variável de ambiente `ALLOWED_HOSTS`"
    Não é necessário definir o nome de domínio totalmente qualificado. Você poderia usar uma substring (por exemplo, `google-gruyere` ou `appspot.com`).

--8<-- "../include-pt-BR/fast/wallarm-api-host-note.md"
   
##  4.  Implante o recipiente Docker do nó FAST

Para fazer isso, execute o seguinte comando:

```
docker run --name <nome> --env-file=<arquivo de variáveis de ambiente criado na etapa anterior> -p <porta alvo>:8080 wallarm/fast
```

Você deve fornecer vários argumentos ao comando:
    
* **`--name`** *`<nome>`*
        
    Especifica o nome do container Docker.
    
    Deve ser único entre os nomes de todos os containers existentes.
    
* **`--env-file=`** *`<arquivo de variáveis de ambiente criado na etapa anterior>`*
    
    Especifica um arquivo contendo todas as variáveis de ambiente a serem exportadas para o container.
    
    Você deve especificar um caminho para o arquivo que criou na [etapa anterior][anchor3].

* **`-p`** *`<porta alvo>`* **`:8080`**
    
    Especifica uma porta do host Docker para a qual a porta 8080 do container deve ser mapeada. Nenhuma das portas do container está disponível para o host Docker por padrão. 
    
    Para conceder acesso a uma determinada porta do container a partir do host Docker, você deve publicar a porta interna do container na porta externa usando o argumento `-p`. 
    
    Você também pode publicar a porta do container para um endereço IP não loopback no host fornecendo o argumento `-p <IP do host>:<porta alvo>:8080` para torná-lo acessível também fora do host Docker.        

!!! info "Exemplo de um comando `docker run`"
    A execução do seguinte comando executará um container chamado `fast-node` usando o arquivo de variáveis de ambiente `/home/user/fast.cfg` e publicará sua porta para `localhost:8080`:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

Se a implantação do container for bem-sucedida, você receberá uma saída de console como esta:

--8<-- "../include-pt-BR/fast/console-include/qsg/fast-node-deployment-ok.md"

Agora você deve ter o nó FAST pronto para trabalhar conectado à nuvem Wallarm. O nó está ouvindo as solicitações HTTP e HTTPS de entrada em `localhost:8080` reconhecendo as solicitações para o domínio `google-gruyere.appspot.com` como solicitacões baseline.
    
    
##  5.  Configurar o navegador para trabalhar com o proxy

Configure o navegador para encaminhar todas as solicitações HTTP e HTTPS por meio do nó FAST. 

Para configurar o proxy no navegador Mozilla Firefox, faça o seguinte:

1.  Abra o navegador. Selecione “Preferências” no menu. Selecione a guia “Geral” e deslize até “Configurações de Rede.” Selecione o botão **Configurações**.

    ![Opções do Mozilla Firefox][img-firefox-options]

2.  A janela “Configurações de conexão” deve ser aberta. Selecione a opção **Configuração manual do proxy**. Configurar o proxy inserindo os seguintes valores:

    * **`localhost`** como endereço do proxy HTTP e **`8080`** como porta do proxy HTTP. 
    * **`localhost`** como endereço do proxy SSL e **`8080`** como porta de proxy SSL.
        
    Selecione o botão **ОК** para aplicar as alterações.

    ![Configurações do proxy do Mozilla Firefox][img-firefox-proxy-options]
    
    
##  6.  Instalar certificados SSL

Ao trabalhar com o aplicativo [Google Gruyere][link-https-google-gruyere] via HTTPS, você pode encontrar a seguinte mensagem do navegador sobre a interrupção de uma conexão segura:

![Mensagem “Conexão insegura”][img-insecure-connection]

Você deve adicionar um certificado SSL autoassinado do nó FAST para poder interagir com o aplicativo da web via HTTPS. Para fazer isso, navegue até este [link][link-ssl-installation], selecione seu navegador na lista e execute as ações necessárias descritas. Este guia sugere que você use o navegador Mozilla Firefox.
        
Depois de executar e configurar seu nó FAST, agora você deve ter concluído todos os objetivos do capítulo. No próximo capítulo, você aprenderá o que é necessário para gerar um conjunto de testes de segurança com base em algumas solicitações iniciais.