import { argv } from 'yargs';
import dotenv from 'dotenv';

import GlossaryParser from './glossaryParser';
import GlossaryService from '../services/glossaryService';
import { IGlossaryDto } from '../models/glossaryDto';

dotenv.config();

(async () => {
    try {
        const parser = new GlossaryParser(argv.path);
        const glossaryItems: IGlossaryDto[] = parser.execute();
        console.log(`Parsed ${glossaryItems.length} glossary items`);

        await GlossaryService.createMany(glossaryItems);
        console.log('Glossary items successfully parsed');
    } catch (err) {
        console.error('Error parsing glossary items', err);
    }
})();