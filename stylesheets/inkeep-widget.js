// Inkeep AI Chat Widget Integration
// Using ModalChat with custom trigger (Ask AI button)
// Docs: https://docs.inkeep.com/cloud/ui-components/js-snippet/custom-modal-trigger

(function() {
  // Inkeep Configuration
  const INKEEP_API_KEY = 'c5b01085a517e4659ba4bf32d60b3f69f47b65a13ccb03df';
  const INKEEP_ORG_ID = 'org_W935PZxFwn0un80v';
  const INKEEP_INTEGRATION_ID = 'cm8l4jq0s00rxs601d7b8tkbh';
  const ORGANIZATION_NAME = 'Wallarm';
  const PRIMARY_BRAND_COLOR = '#ff441c';
  const BOT_AVATAR_URL = 'https://cdn.prod.website-files.com/5fe3434623c64c793987363d/6006cb97f71f76f8a5e85a32_Frame%201923.png';

  // Load Inkeep CXKit library
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/npm/@inkeep/cxkit-js@0.5/dist/embed.js';
  script.defer = true;

  let modalWidget = null;

  script.addEventListener('load', function() {
    initializeInkeep();
  });

  document.head.appendChild(script);

  function initializeInkeep() {
    // Check if Inkeep is loaded
    if (typeof Inkeep === 'undefined') {
      setTimeout(initializeInkeep, 100);
      return;
    }

    const config = {
      baseSettings: {
        apiKey: INKEEP_API_KEY,
        organizationId: INKEEP_ORG_ID,
        integrationId: INKEEP_INTEGRATION_ID,
        primaryBrandColor: PRIMARY_BRAND_COLOR,
        organizationDisplayName: ORGANIZATION_NAME,
        colorMode: {
          sync: {
            target: document.body,
            attributes: ['data-md-color-scheme'],
            isDarkMode: (attributes) => attributes['data-md-color-scheme'] === 'slate'
          }
        }
      },
      aiChatSettings: {
        chatSubjectName: 'Wallarm',
        botAvatarSrcUrl: BOT_AVATAR_URL,
        quickQuestions: [
          'How to setup API Discovery?',
          'How to customize sensitive data detection?',
          'How does the Vulnerability Scanner work?',
          'How to enable JA3 fingerprinting?'
        ]
      },
      modalSettings: {
        isOpen: false,
        onOpenChange: function(isOpen) {
          if (!isOpen && modalWidget) {
            modalWidget.update({ modalSettings: { isOpen: false } });
          }
        }
      }
    };

    // Initialize the modal chat widget (no floating button)
    modalWidget = Inkeep.ModalChat(config);

    // Expose function to open chat programmatically
    window.openInkeepChat = function() {
      if (modalWidget) {
        modalWidget.update({ modalSettings: { isOpen: true } });
      }
    };

    // Attach click handler to "Ask AI" button on homepage
    attachAskAIHandler();
  }

  function attachAskAIHandler() {
    // Find the Ask AI button and attach click handler
    const askAIButtons = document.querySelectorAll('.homepage-btn-ai');
    askAIButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.openInkeepChat) {
          window.openInkeepChat();
        }
      });
    });
  }

  // Re-attach handler on page navigation (for MkDocs Material instant loading)
  document.addEventListener('DOMContentLoaded', attachAskAIHandler);

  // Support for MkDocs Material instant navigation
  if (typeof document$ !== 'undefined') {
    document$.subscribe(function() {
      attachAskAIHandler();
    });
  }
})();
