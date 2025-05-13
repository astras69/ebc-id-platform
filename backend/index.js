const express = require('express');
const { createAgent } = require('@veramo/core');
const { KeyManager } = require('@veramo/key-manager');
const { DIDManager } = require('@veramo/did-manager');
const { KeyDIDProvider } = require('@veramo/did-provider-key');
const { CredentialIssuer } = require('@veramo/credential-w3c');
const { MemoryKeyStore, MemoryPrivateKeyStore } = require('@veramo/kms-local');

const app = express();
app.use(express.json());

const agent = createAgent({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
        local: new MemoryPrivateKeyStore(),
      },
    }),
    new DIDManager({
      defaultProvider: 'did:key',
      providers: {
        'did:key': new KeyDIDProvider({ defaultKms: 'local' }),
      },
    }),
    new CredentialIssuer(),
  ],
});

app.post('/api/register', async (req, res) => {
  try {
    const { nome, cognome, email, eta } = req.body;
    const identifier = await agent.didManagerCreate();
    res.json({
      success: true,
      message: 'Identità creata',
      did: identifier.did,
      data: { nome, cognome, email, eta }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => console.log("Server DID in ascolto sulla porta 3001"));