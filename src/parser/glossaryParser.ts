import fs from 'fs';
import parse from 'csv-parse/lib/sync';

import { IGlossaryDto } from '../models/glossaryDto';

class GlossaryParser {
    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    execute(): IGlossaryDto[] {
        this.validate(this.path);

        const csv: string = fs.readFileSync(this.path).toString();
        const data: IGlossaryDto[] = parse(csv, { delimiter: ';', columns: true });

        return data;
    }

    private validate(path: string) {
        if (!path || !fs.existsSync(path)) {
            throw new Error('File not found');
        }
    }
}

export default GlossaryParser;