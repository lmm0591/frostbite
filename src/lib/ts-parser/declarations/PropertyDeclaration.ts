import { OptionalDeclaration, ScopedDeclaration, StaticDeclaration, TypedDeclaration } from './Declaration';
import { DeclarationVisibility } from './DeclarationVisibility';
import { NameRange } from './NameRange';
/**
 * Property declaration that contains its visibility.
 *
 * @export
 * @class PropertyDeclaration
 * @implements {ScopedDeclaration}
 * @implements {TypedDeclaration}
 */
export class PropertyDeclaration implements OptionalDeclaration, ScopedDeclaration, StaticDeclaration, TypedDeclaration {
    constructor(
        public name: string,
        public visibility: DeclarationVisibility | undefined,
        public type: string | undefined,
        public isOptional: boolean,
        public isStatic: boolean,
        public nameRange: NameRange,
        public start?: number,
        public end?: number,
    ) { }
}
