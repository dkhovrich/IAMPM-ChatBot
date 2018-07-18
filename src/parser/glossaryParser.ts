import fs from 'fs';
import parse from 'csv-parse/lib/sync';

import { IGlossaryDto } from '../models/glossaryDto';

class GlossaryParser {
    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    execute(): IGlossaryDto[] {
        this.validate();

        const csv: string = fs.readFileSync(this.path).toString();
        const data: IGlossaryDto[] = parse(csv, { delimiter: ';', columns: true });

        return data;
    }

    private validate(): void {
        if (!this.path || !fs.existsSync(this.path)) {
            throw new Error('File not found');
        }
    }
}

export default GlossaryParser;