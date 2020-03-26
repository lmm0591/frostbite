import { Identifier, InterfaceDeclaration, SyntaxKind } from 'typescript';

import { DeclarationVisibility } from '../declarations/DeclarationVisibility';
import { DefaultDeclaration } from '../declarations/DefaultDeclaration';
import { InterfaceDeclaration as TshInterface } from '../declarations/InterfaceDeclaration';
import { MethodDeclaration } from '../declarations/MethodDeclaration';
import { PropertyDeclaration } from '../declarations/PropertyDeclaration';
import { Resource } from '../resources/Resource';
import { isMethodSignature, isPropertySignature } from '../type-guards/TypescriptGuards';
import { parseMethodParams } from './function-parser';
import {
    containsModifier,
    getDefaultResourceIdentifier,
    getNodeType,
    isNodeDefaultExported,
    isNodeExported,
} from './parse-utilities';
import { NameRange } from '../declarations/NameRange';
/**
 * Parses an interface node into its declaration.
 * Calculates the property and method defintions of the interface as well.
 *
 * @export
 * @param {Resource} resource
 * @param {InterfaceDeclaration} node
 */
export function parseInterface(resource: Resource, node: InterfaceDeclaration): void {
    const name = node.name ? node.name.text : getDefaultResourceIdentifier(resource);
    const interfaceDeclaration = new TshInterface(
        name, isNodeExported(node), node.getStart(), node.getEnd(),
    );

    if (isNodeDefaultExported(node)) {
        interfaceDeclaration.isExported = false;
        resource.declarations.push(new DefaultDeclaration(interfaceDeclaration.name, resource));
    }

    if (node.members) {
        node.members.forEach((o) => {
            if (isPropertySignature(o)) {
                interfaceDeclaration.properties.push(
                    new PropertyDeclaration(
                        (o.name as Identifier).text,
                        DeclarationVisibility.Public,
                        getNodeType(o.type),
                        !!o.questionToken,
                        containsModifier(o, SyntaxKind.StaticKeyword),
                        new NameRange(o.name.pos, o.name.end),
                        o.getStart(),
                        o.getEnd(),
                    ),
                );
            } else if (isMethodSignature(o)) {
                const method = new MethodDeclaration(
                    (o.name as Identifier).text,
                    true,
                    DeclarationVisibility.Public,
                    getNodeType(o.type),
                    !!o.questionToken,
                    containsModifier(o, SyntaxKind.StaticKeyword),
                    containsModifier(o, SyntaxKind.AsyncKeyword),
                    new NameRange(o.name.pos, o.name.end),
                    o.getStart(),
                    o.getEnd(),
                );
                method.parameters = parseMethodParams(o);
                interfaceDeclaration.methods.push(method);
            }
        });
    }

    if (node.typeParameters) {
        interfaceDeclaration.typeParameters = node.typeParameters.map(param => param.getText());
    }

    resource.declarations.push(interfaceDeclaration);
}
