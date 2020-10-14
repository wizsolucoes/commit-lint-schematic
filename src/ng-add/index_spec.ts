import {
  SchematicTestRunner,
  UnitTestTree,
} from "@angular-devkit/schematics/testing";
import * as path from "path";

const collectionPath = path.join(__dirname, "../collection.json");

const runner = new SchematicTestRunner("schematics", collectionPath);

describe("ng-add", () => {
  let appTree: UnitTestTree;

  beforeAll(async () => {
    // Run ng g workspace schematic
    appTree = await runner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "workspace",
        { name: "test", version: "10.0.5" },
        appTree
      )
      .toPromise();

    // Run ng g application schematic
    appTree = await runner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "application",
        { name: "my-app" },
        appTree
      )
      .toPromise();

    // Our schematic
    await runner.runSchematicAsync("commit-lint", {}, appTree).toPromise();
  });

  it("adds commitlint.config.js file", async () => {
    expect(appTree.files).toContain("/commitlint.config.js");
  });

  it("adds git hook", async () => {
    const packageJsonBuffer = appTree.read("package.json");
    const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

    expect(packageJsonObject).toEqual(
      jasmine.objectContaining({
        husky: {
          hooks: {
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
          },
        },
      })
    );
  });

  it("adds dependencies to packages.json", async () => {
    const packageJsonBuffer = appTree.read("package.json");
    const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

    expect(packageJsonObject.devDependencies).toEqual(
      jasmine.objectContaining({
        "@commitlint/cli": "^11.0.0",
        "@commitlint/config-conventional": "^11.0.0",
        husky: "^4.3.0",
      })
    );
  });
});
