import { argv } from 'yargs';
import GlossaryParser from './glossaryParser';
import GlossaryService from '../services/glossaryService';

(async () => {
    try {
        const parser = new GlossaryParser(argv.path);
        const glossaryItems = parser.execute();

        await GlossaryService.createMany(glossaryItems);
        console.log('Glossary items successfully parsed');
    } catch (err) {
        console.error('Error parsing glossary items', err);
    }
})();