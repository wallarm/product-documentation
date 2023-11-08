# Passo 3: Transferindo Metadata da Okta para o Assistente de Configuração Wallarm

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

Retorne ao assistente de configuração de SSO Okta no Console Wallarm e clique em *Próximo* para ir para a próxima etapa de configuração.

Nesta etapa, você precisa fornecer os metadados [gerados][link-metadata] pelo serviço Okta.

Há duas formas de passar os metadados do provedor de identidade (neste caso, Okta) para o assistente de configuração Wallarm:
* Carregando um arquivo XML com metadados.

    Carregue o arquivo XML clicando no botão *Upload* e selecionando o arquivo apropriado. Você também pode fazer isso arrastando o arquivo do gerenciador de arquivos para o campo do ícone "XML".
    
* Inserindo os metadados manualmente.

    Clique no link *Inserir manualmente* e copie os parâmetros do serviço Okta para os campos do assistente de configuração conforme segue:

    * **URL do Provedor de Identidade de Login Único** para o campo **URL do SSO do provedor de identidade**.
    * **Emissor do Provedor de Identidade** para o campo **Emissor do provedor de identidade**.
    * **Certificado X.509** para o campo **Certificado X.509**.
    
    ![Inserindo os metadados manualmente][img-transfer-metadata-manually]

Clique em *Próximo* para ir ao próximo passo. Se desejar retornar ao passo anterior, clique em *Voltar*.


## Concluindo o Assistente de SSO

Na etapa final do assistente de configuração Wallarm, uma conexão de teste com o serviço Okta será realizada automaticamente e o provedor de SSO será verificado.

Após a conclusão bem sucedida do teste (se todos os parâmetros necessários estiverem preenchidos corretamente), o assistente de configuração informará que o serviço Okta está conectado como um provedor de identidade e você pode começar a conectar o mecanismo de SSO para autenticar seus usuários. 

Termine a configuração do SSO clicando no botão *Finalizar* ou vá para a página do usuário para configurar o SSO clicando no botão correspondente.

![Concluindo o assistente de SSO][img-sp-wizard-finish]

Após concluir o assistente de configuração de SSO, na aba *Integração*, você verá que o serviço Okta está conectado como um provedor de identidade e que nenhum outro provedor de SSO está disponível.

![Aba de “Integração” após terminar o assistente de SSO][img-integration-tab]

Agora, prossiga para [a próxima etapa][doc-allow-access-to-wl] do processo de configuração de SSO.