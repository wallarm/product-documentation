#   Passo 3: Transferindo Metadados do G Suite para o Assistente de Configuração do Wallarm

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:               ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

Retorne para o assistente de configuração SSO do G Suite no Console Wallarm e clique em *Próximo* para prosseguir para a próxima etapa de configuração.

Neste estágio, você precisa fornecer os metadados gerados pelo serviço G Suite para o assistente de configuração SSO do Wallarm.

Existem duas maneiras de transferir metadados:
*   [Fazer upload de um arquivo XML com metadados no assistente de configuração Wallarm.][anchor-upload-metadata-xml]
*   [Copiar e colar os parâmetros necessários no assistente de configuração Wallarm manualmente.][anchor-upload-metadata-manually]


##  Fazendo Upload de Metadados Usando um Arquivo XML

Se você salvou os metadados do G Suite como um arquivo XML ao configurar o aplicativo no G Suite anteriormente (em [Passo 2][doc-setup-idp]), clique no botão *Upload* e selecione o arquivo desejado. Você também pode fazer isso arrastando o arquivo do gerenciador de arquivos para o ícone "XML". Após fazer o upload do arquivo, clique em *Próximo* para ir para a próxima etapa.

![Upload de Metadados][img-sp-wizard-transfer-metadata]


##  Copiando Parâmetros Manualmente

Se você copiou os parâmetros do provedor de identidade fornecidos ao configurar o aplicativo no G Suite, clique no link *Enter manually* para inserir os parâmetros copiados manualmente e preencher o formulário. 

Insira os parâmetros gerados pelo G Suite nos campos do assistente de configuração Wallarm da seguinte maneira:

*   **SSO URL** → **Identity provider SSO URL**
*   **Entity ID** → **Identity provider issuer**
*   **Certificate** → **X.509 Certificate**

Clique em *Próximo* para ir para a próxima etapa. Se quiser voltar à etapa anterior, clique em *Voltar*.

![Inserindo os metadados manualmente][img-transfer-metadata-manually]


##  Completando o Assistente SSO

Na etapa final do assistente de configuração Wallarm, uma conexão teste com o serviço G Suite será realizada automaticamente, e o provedor SSO será verificado.

Após a conclusão bem-sucedida do teste (se todos os parâmetros necessários forem preenchidos corretamente), o assistente de configuração informará que o serviço G Suite está conectado como um provedor de identidade, e você pode começar a conectar o mecanismo SSO para autenticar seus usuários.

Conclua a configuração do SSO clicando no botão *Finish* ou vá para a página do usuário para configurar o SSO clicando no botão correspondente.

![Concluindo o Assistente SSO][img-sp-wizard-finish]

Após completar o assistente de configuração do SSO, na aba de Integração você verá que o serviço G Suite está conectado como um provedor de identidade e que nenhum outro provedor SSO está disponível.

![A aba "Integração" depois de terminar o assistente SSO][img-integration-tab]

Agora, navegue para [a próxima etapa][doc-allow-access-to-wl] do processo de configuração do SSO.
