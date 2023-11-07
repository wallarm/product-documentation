## Requisitos

* Uma conta GCP
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console Wallarm para o [Cloud US](https://us1.my.wallarm.com/) ou [Cloud EU](https://my.wallarm.com/)
* Acesso a `https://us1.api.wallarm.com:444` para trabalhar com o Wallarm Cloud US ou a `https://api.wallarm.com:444` para trabalhar com o Wallarm Cloud EU. Se o acesso puder ser configurado apenas via servidor proxy, use as [instruções][wallarm-api-via-proxy]
* Execução de todos os comandos em uma instância Wallarm como superusuário (por exemplo, `root`)

## 1. Inicie uma instância do nó de filtragem

### Inicie a instância por meio da UI do Google Cloud

Para iniciar a instância do nó de filtragem através da interface do usuário do Google Cloud, abra a [imagem do nó Wallarm no Google Cloud Marketplace](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) e clique em **INICIAR**.

A instância será iniciada com um nó de filtragem pré-instalado. Para ver informações detalhadas sobre o lançamento de instâncias no Google Cloud, prossiga para a [documentação oficial da plataforma Google Cloud][link-launch-instance].

### Inicie a instância através do Terraform ou outras ferramentas

Ao usar uma ferramenta como o Terraform para lançar a instância do nó de filtragem usando a imagem Wallarm GCP, você pode precisar fornecer o nome desta imagem na configuração do Terraform.

* O nome da imagem tem o seguinte formato:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Para iniciar a instância com a versão 4.6 do nó de filtragem, use o seguinte nome de imagem:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

Para obter o nome da imagem, você também pode seguir estas etapas:

1. Instale o [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Execute o comando [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) com os seguintes parâmetros:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. Copie o valor da versão do nome da imagem mais recente disponível e cole o valor copiado no formato de nome de imagem fornecido. Por exemplo, a imagem da versão 4.6 do nó de filtragem terá o seguinte nome:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. Configure a instância do nó de filtragem

Realize as seguintes ações para configurar a instância do nó de filtragem lançada:

1.  Navegue até a página **Instâncias de VM** na seção **Engine de computação** do menu.
2.  Selecione a instância do nó de filtragem lançada e clique no botão **Editar**.
3.  Permita os tipos necessários de tráfego de entrada, marcando as caixas correspondentes nas configurações **Firewalls**.
4.  Se necessário, você pode restringir a conexão à instância com as chaves SSH do projeto e usar um par de chaves SSH personalizado para se conectar a essa instância. Para fazer isso, realize as seguintes ações:
    1.  Marque a caixa **Bloquear em todo o projeto** nas configurações **Chaves SSH**.
    2.  Clique no botão **Mostrar e editar** nas configurações **Chaves SSH** para expandir o campo para inserir uma chave SSH.
    3.  Gere um par de chaves SSH públicas e privadas. Por exemplo, você pode usar os utilitários `ssh-keygen` e `PuTTYgen`.
       
        ![Gerando chaves SSH usando PuTTYgen][img-ssh-key-generation]

    4.  Copie uma chave aberta no formato OpenSSH da interface do gerador de chaves usado (no exemplo atual, a chave pública gerada deve ser copiada da área **Public key for pasting into OpenSSH authorized_keys file** da interface PuTTYgen) e cole-a no campo contendo a dica **Enter entire key data**.
    5.  Salve a chave privada. Ela será necessária para se conectar à instância configurada no futuro.
5.  Clique no botão **Salvar** na parte inferior da página para aplicar as alterações. 

## 3. Conecte-se à instância do nó de filtragem via SSH

Para obter informações detalhadas sobre maneiras de se conectar a instâncias, prossiga para este [link](https://cloud.google.com/compute/docs/instances/connecting-to-instance).

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Conecte o nó de filtragem à Nuvem Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"
