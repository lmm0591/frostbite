import {
    ArrayBindingPattern,
    ClassDeclaration,
    ConstructorDeclaration,
    Identifier,
    Node,
    ObjectBindingPattern,
    SyntaxKind,
} from 'typescript';

import { GetterDeclaration, SetterDeclaration } from '../declarations/AccessorDeclaration';
import { ClassDeclaration as TshClass } from '../declarations/ClassDeclaration';
import { ConstructorDeclaration as TshConstructor } from '../declarations/ConstructorDeclaration';
import { DefaultDeclaration as TshDefault } from '../declarations/DefaultDeclaration';
import { MethodDeclaration as TshMethod } from '../declarations/MethodDeclaration';
import { ParameterDeclaration as TshParameter } from '../declarations/ParameterDeclaration';
import { PropertyDeclaration as TshProperty } from '../declarations/PropertyDeclaration';
import { SuperClassDeclaration } from '../declarations/SuperClassDeclaration';
import { Resource } from '../resources/Resource';
import { NameRange } from '../declarations/NameRange';
import {
    isArrayBindingPattern,
    isConstructorDeclaration,
    isGetAccessorDeclaration,
    isIdentifier,
    isMethodDeclaration,
    isObjectBindingPattern,
    isPropertyDeclaration,
    isSetAccessorDeclaration,
} from '../type-guards/TypescriptGuards';
import { parseFunctionParts, parseMethodParams } from './function-parser';
import { parseIdentifier } from './identifier-parser';
import {
    containsModifier,
    getDefaultResourceIdentifier,
    getNodeType,
    getNodeVisibility,
    isNodeDefaultExported,
    isNodeExported,
} from './parse-utilities';

/**
 * Parses the identifiers of a class (usages).
 *
 * @export
 * @param {Resource} tsResource
 * @param {Node} node
 */
export function parseClassIdentifiers(tsResource: Resource, node: Node): void {
    for (const child of node.getChildren()) {
        switch (child.kind) {
            case SyntaxKind.Identifier:
                parseIdentifier(tsResource, <Identifier>child);
                break;
            default:
                break;
        }
        parseClassIdentifiers(tsResource, child);
    }
}

function getSuperClass(tsResource, node) {
  for (const child of node.getChildren()) {
    if(child.kind === SyntaxKind.ExtendsKeyword){
      return node.types[0]
    }
    const result = getSuperClass(tsResource, child);
    if (result) {
      return result
    }
  }
}


/**
 * Parse information about a constructor. Contains parameters and used modifiers
 * (i.e. constructor(private name: string)).
 *
 * @export
 * @param {TshClass} parent
 * @param {TshConstructor} ctor
 * @param {ConstructorDeclaration} node
 */
export function parseCtorParams(
    parent: TshClass,
    ctor: TshConstructor,
    node: ConstructorDeclaration,
): void {
    if (!node.parameters) {
        return;
    }
    node.parameters.forEach((o) => {
        if (isIdentifier(o.name)) {
            ctor.parameters.push(
                new TshParameter(
                    (o.name as Identifier).text, getNodeType(o.type), o.getStart(), o.getEnd(),
                ),
            );
            if (!o.modifiers) {
                return;
            }
            parent.properties.push(
                new TshProperty(
                    (o.name as Identifier).text,
                    getNodeVisibility(o),
                    getNodeType(o.type),
                    !!o.questionToken,
                    containsModifier(o, SyntaxKind.StaticKeyword),
                    new NameRange(o.name.pos, o.name.end),
                    o.getStart(),
                    o.getEnd(),
                ),
            );
        } else if (isObjectBindingPattern(o.name) || isArrayBindingPattern(o.name)) {
            const identifiers = o.name as ObjectBindingPattern | ArrayBindingPattern;
            const elements = [...identifiers.elements];
            // TODO: BindingElement
            ctor.parameters = ctor.parameters.concat(<TshParameter[]>elements.map((bind: any) => {
                if (isIdentifier(bind.name)) {
                    return new TshParameter(
                        (bind.name as Identifier).text, undefined, bind.getStart(), bind.getEnd(),
                    );
                }
            }).filter(Boolean));
        }
    });
}

/**
 * Parses a class node into its declaration. Calculates the properties, constructors and methods of the class.
 *
 * @export
 * @param {Resource} tsResource
 * @param {ClassDeclaration} node
 */
export function parseClass(tsResource: Resource, node: ClassDeclaration): void {
    const name = node.name ? node.name.text : getDefaultResourceIdentifier(tsResource);
    const classDeclaration = new TshClass(name, isNodeExported(node), node.getStart(), node.getEnd());

    if (isNodeDefaultExported(node)) {
        classDeclaration.isExported = false;
        tsResource.declarations.push(new TshDefault(classDeclaration.name, tsResource));
    }

    if (node.typeParameters) {
        classDeclaration.typeParameters = node.typeParameters.map(param => param.getText());
    }

    const superClass = getSuperClass(tsResource, node)
    if (superClass) {
      classDeclaration.superClassDeclaration = new SuperClassDeclaration(superClass.expression.text, superClass.pos, superClass.end)
    }

    if (node.members) {
        node.members.forEach((o) => {
            if (isPropertyDeclaration(o)) {
                const actualCount = classDeclaration.properties.length;
                if (o.modifiers) {
                    
                    classDeclaration.properties.push(new TshProperty(
                      (o.name as Identifier).text,
                      getNodeVisibility(o),
                      getNodeType(o.type),
                      !!o.questionToken,
                      containsModifier(o, SyntaxKind.StaticKeyword),
                      new NameRange(o.name.pos, o.name.end),
                      o.getStart(),
                      o.getEnd(),
                    ));
                }
                if (actualCount === classDeclaration.properties.length) {
                  
                  const pos = o.modifiers?.length ? o.name.pos : (o.name.end - o.name.getText().length - 1)
                  console.log(' o.name.getText(): ',  o.name.getText());
                  console.log('o: ', o);
                  console.log('pos: ', pos);
                    classDeclaration.properties.push(
                        new TshProperty(
                            (o.name as Identifier).text,
                            getNodeVisibility(o),
                            getNodeType(o.type),
                            !!o.questionToken,
                            containsModifier(o, SyntaxKind.StaticKeyword),
                            new NameRange(pos, o.name.end),
                            o.getStart(),
                            o.getEnd(),
                        ),
                    );
                }
                return;
            }

            if (isGetAccessorDeclaration(o)) {
                classDeclaration.accessors.push(
                    new GetterDeclaration(
                        (o.name as Identifier).text,
                        getNodeVisibility(o),
                        getNodeType(o.type),
                        o.modifiers !== undefined && o.modifiers.some(m => m.kind === SyntaxKind.AbstractKeyword),
                        containsModifier(o, SyntaxKind.StaticKeyword),
                        o.getStart(),
                        o.getEnd(),
                    ),
                );
            }

            if (isSetAccessorDeclaration(o)) {
                classDeclaration.accessors.push(
                    new SetterDeclaration(
                        (o.name as Identifier).text,
                        getNodeVisibility(o),
                        getNodeType(o.type),
                        o.modifiers !== undefined && o.modifiers.some(m => m.kind === SyntaxKind.AbstractKeyword),
                        containsModifier(o, SyntaxKind.StaticKeyword),
                        o.getStart(),
                        o.getEnd(),
                    ),
                );
            }

            if (isConstructorDeclaration(o)) {
                const ctor = new TshConstructor(classDeclaration.name, o.getStart(), o.getEnd());
                parseCtorParams(classDeclaration, ctor, o);
                classDeclaration.ctor = ctor;
                parseFunctionParts(tsResource, ctor, o);
            } else if (isMethodDeclaration(o)) {
                const method = new TshMethod(
                    (o.name as Identifier).text,
                    o.modifiers !== undefined && o.modifiers.some(m => m.kind === SyntaxKind.AbstractKeyword),
                    getNodeVisibility(o),
                    getNodeType(o.type),
                    !!o.questionToken,
                    containsModifier(o, SyntaxKind.StaticKeyword),
                    containsModifier(o, SyntaxKind.AsyncKeyword),
                    new NameRange(o.name.pos, o.name.end),
                    o.getStart(),
                    o.getEnd(),
                );
                method.parameters = parseMethodParams(o);
                classDeclaration.methods.push(method);
                parseFunctionParts(tsResource, method, o);
            }
        });
    }

    parseClassIdentifiers(tsResource, node);

    tsResource.declarations.push(classDeclaration);
}
