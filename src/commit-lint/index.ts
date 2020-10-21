import {
  chain,
  mergeWith,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from "@angular-devkit/schematics";

import {
  addPackageJsonDependency,
  NodeDependencyType,
} from "@schematics/angular/utility/dependencies";

import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.

export function main(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([addFiles(), addGitHook(), installPackages()])(tree, _context);
  };
}

export function addFiles(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const templates = url("./files");

    return mergeWith(templates)(tree, _context);
  };
}

export function addGitHook(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read("package.json");

    if (!packageJsonBuffer) {
      throw new SchematicsException("No package.json found");
    }

    const packageJsonString = packageJsonBuffer.toString();

    const packageJsonObject = JSON.parse(packageJsonString);

    packageJsonObject["husky"] = {
      hooks: {
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      },
    };

    const newPackageJsonString = JSON.stringify(packageJsonObject, null, 2);

    tree.overwrite("package.json", newPackageJsonString);

    return tree;
  };
}

export function installPackages(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const devDependencies: { [key: string]: string } = {
      "@commitlint/cli": "^11.0.0",
      "@commitlint/config-conventional": "^11.0.0",
      "commitlint-azure-pipelines-cli": "^1.0.3",
      husky: "^4.3.0",
    };

    for (let pkg in devDependencies) {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Dev,
        name: pkg,
        version: devDependencies[pkg],
      });
    }

    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
