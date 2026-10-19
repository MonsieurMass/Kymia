import {notionConfig,verifyNotionAccess} from '../lib/notion.mjs';
import {syncPending} from '../lib/outbox.mjs';
const config=notionConfig();if(!config){console.error('NOTION_TOKEN absent. Configurez .env.local côté serveur.');process.exit(1)}
try{await verifyNotionAccess(config);if(process.argv.includes('--check'))console.log('Accès au pipeline et schéma KYMIA vérifiés.');else console.log(JSON.stringify(await syncPending({config})));}catch{console.error('Accès ou synchronisation Notion non confirmé. Vérifiez le jeton, le partage et le schéma du pipeline.');process.exit(1)}
